@echo off
rem Territory Arrow (EN edition) - local server launcher
rem Open both URL forms: the root path and the sub-path mount
rem (/SinglePlayer/arrowparty/) used when the game is embedded
rem inside a larger site.
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  echo Starting Territory Arrow at http://127.0.0.1:8123/
  start "" http://127.0.0.1:8123/SinglePlayer/arrowparty/
  node server.js
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting Territory Arrow at http://127.0.0.1:8123/
  start "" http://127.0.0.1:8123/SinglePlayer/arrowparty/
  python -m http.server 8123
  goto :eof
)
echo Node.js or Python is required to serve the game files.
pause
