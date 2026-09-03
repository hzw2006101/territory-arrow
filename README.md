# Territory Arrow (EN Edition)

Offline English edition of the neon arrow-cutting casual game (Cocos Creator 3.x, v1.1.4 base).

## Run

- Double-click `start_server.bat` (needs Node.js or Python installed), then open
  <http://127.0.0.1:8123/SinglePlayer/arrowparty/>.
  The root URL <http://127.0.0.1:8123/> also works.
- Or serve this folder with any static server (`npx serve`, `python -m http.server`, nginx…).
  When mounting under a sub-path of a larger site, the game accepts both
  `/...` and `/SinglePlayer/arrowparty/...` URLs and strips the mount
  prefix before resolving files.

No internet connection is needed — all backend calls are stubbed locally (`apistub/`).

## QA notes

- Append `#gm` to the URL to keep the GM debug panel visible
  (Skip Lv / Victory / Fail / Next buttons for fast testing).
- Top-right %, hearts and level number behave exactly like the original game.

## Docs

- `MODIFICATIONS.md` — complete modification log (what was changed, where, and why).
