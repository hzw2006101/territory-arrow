// Simple static file server for the Territory Arrow (EN edition) game mirror.
//
// Designed to host the game under a sub-path so it can be embedded inside a
// larger site (e.g. https://host/SinglePlayer/arrowparty/). When the request
// URL begins with that prefix we strip it before resolving a file on disk, so
// the page can be opened at either:
//   - http://127.0.0.1:8123/                    (root)
//   - http://127.0.0.1:8123/SinglePlayer/arrowparty/        (subdir)
const http = require('http');
const fs = require('fs');
const path = require('path');

const GAME_DIR = __dirname;
// Strip a leading mount point so the game can live at /SinglePlayer/arrowparty/.
const URL_PREFIX = '/SinglePlayer/arrowparty';
const PORT = process.env.PORT || 8123;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.ttf': 'font/ttf',
  '.fnt': 'text/plain; charset=utf-8',
  '.plist': 'application/xml',
  '.atlas': 'text/plain; charset=utf-8',
  '.bin': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  // Decode and strip the optional sub-path mount point.
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === URL_PREFIX || urlPath === URL_PREFIX + '/') {
    urlPath = '/';
  } else if (urlPath.startsWith(URL_PREFIX + '/')) {
    urlPath = urlPath.slice(URL_PREFIX.length); // keep the leading '/'
  }
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = path.join(GAME_DIR, urlPath);
  if (!filePath.startsWith(GAME_DIR)) { res.writeHead(403); res.end(); return; }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      if (process.env.LOG_404 === '1') console.log('[404]', urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => console.log(`serving ${GAME_DIR} at http://127.0.0.1:${PORT}/`));
