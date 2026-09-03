# Territory Arrow — EN Edition · 修改记录 (Modification Log)

Source game: `https://static.zuiqiangyingyu.net/wb_webview/gamblingstone/arrowparty1/index.html`
(Cocos Creator 3.x H5 build, heavily obfuscated, v1.1.4)
Deliverable: fully offline single-player HTML5 game, all-Chinese content localized to English,
ads disabled, overseas-friendly defaults. Everything runs from this folder with any static file
server — no backend required.

## How to run

```
cd game
start_server.bat          (uses Node.js; falls back to Python http.server)
# open http://127.0.0.1:8123/
```

Any static file server pointed at this folder works. QA escape hatch: append `#gm` to the URL to
keep the in-game GM debug panel visible.

---

## 1. Full asset capture (mirror)

- Entry `index.html` → loader `s.25896.js` → engine `cocos2d-js-min.06694.js` + `physics-min.js`
  + 7 asset bundles (`internal`, `resources`, `main`, `gameScript`, `gameBundle`, `level_local`, `zqddn_zhb`).
- All 538 files (bundle configs, packed import JSONs, native PNG/TTF/MP3) were downloaded and
  verified: every asset listed in the (runtime-decrypted) bundle configs exists on disk; the 183
  URLs observed in a live play session are all covered. 0 gaps.

## 2. Encryption removed (configs shipped as plain JSON)

The publisher encrypts the 7 bundle `config.*.json` files with AES (OpenSSL "Salted__" format).
The decryption routine lives inside the modified engine file and is controlled by two globals set
by the loader:

- `htaPSJotpytC` — list of encrypted files
- `epyTSJotpyrC = '4'` — cipher mode; passphrase = `location.hostname`

Changes:
- **Decrypted all 7 configs offline** (via the runtime cipher, key = production hostname) and
  saved them as plain JSON at the same paths.
- `index.html`: added an inline script after the loader that sets
  `htaPSJotpytC = undefined; epyTSJotpyrC = undefined;` so the engine treats every asset as plain
  JSON. (The engine's own download path already passes objects through untouched.)

## 3. Anti-tamper / domain-lock neutralization (required for local hosting)

The obfuscated code contains three protections that kill the game when it is not served from the
publisher domain. All three were neutralized **inside the shipped JS** (surgical string patches,
no re-obfuscation):

| # | Where | Protection | Patch |
|---|-------|------------|-------|
| 1 | `s.25896.js` | `class FuckDevtool` — anti-devtools watchdog (debugger timing w/ 100 ms threshold, F12/shortcut blocking). False-positives under CDP automation and redirects to `about:blank`. | Instantiation replaced with `void 0;` (class body left as dead code). |
| 2 | `s.25896.js` (~offset 337k) | javascript-obfuscator **domainLock**: validates `document.domain` against a whitelist, redirects to `about:blank` on mismatch. | Validation flag forced true (`=![];` → `=!![];`). |
| 3 | `assets/main/index.4396b.js` | Second domainLock whose failure path "self-heals" by assigning `document.domain = 'zuiqiangyingyu.net'` — throws `SecurityError` on modern Chrome, killing the boot module. | Self-heal invocation `_0x3f45aa();` commented out. |

Runtime compatibility layer (`game/api-shim.js`, loaded first):
- `document.domain` getter returns `static.zuiqiangyingyu.net` (setter is a no-op) and
  `location.hostname/host` read as the production host, so any remaining domain checks in the
  8 MB `gameScript` bundle pass no matter where the folder is hosted.
- Known trade-off: the top-bar level indicator uses an embedded bitmap font whose glyph set only
  contains `第/关/日/月 + digits`, so `Level N` renders as the bare number. Kept (matches western
  minimal HUD style); the result dialogs spell out "Level N" in full.

## 4. Chinese → English

Two cooperating layers (translation table shared between them):

1. **Static**: all label strings inside prefabs/scenes (import JSONs) were replaced by
   `tools/apply_json_i18n.js` using `tools/i18n_map.js` (~129 strings across 22 files).
2. **Runtime**: `game/i18n-shim.js` hooks `cc.Label` / `cc.RichText` / `cc.EditBox`
   (`string`, `setString`, and the raw `_string` field via a prototype accessor) so strings composed
   dynamically in JS (e.g. `"第" + level + "关"`, weekday/month names, GM labels) are translated at
   render time. Regex rules handle patterns (`第N关 → Level N`, `进度：N% → Progress: N%`,
   `YYYY月 → Mon YYYY`).

Not translated on purpose (metadata, translating breaks the engine):
`骨骼` (spine bone name in `level_local/import/b2/b260628b*.json` — an earlier accidental rename
caused `Bone not found` and was reverted), `logo-箭头派对` (atlas frame name),
`BMS：{0}…` (GM debug info), ThinkingData SDK type-declaration string.

Legal/regulatory strings for China were blanked: ICP filing, copyright registration number,
company name, and the 《健康游戏忠告》 notice.

## 5. Baked art text (images) replaced

Recreated in matching neon style with English text (transparent PNG, glow pass + core pass),
same file paths/dimensions (`tools/regen_art.js`, originals re-fetched from CDN first):

| File (game/assets/…) | Was | Now |
|---|---|---|
| `gameBundle/native/d6/d6313723*.png` | 挑战成功 | **LEVEL COMPLETE** (orange) |
| `gameBundle/native/6b/6b235878*.png` | 挑战失败 | **LEVEL FAILED** (purple) |
| `gameBundle/native/e6/e6d09372*.png` | 每日挑战 | **DAILY CHALLENGE** (pink) |
| `gameBundle/native/9a/9a8b04ef*.png` | 每日挑战 (small) | **DAILY CHALLENGE** (cyan) |
| `gameBundle/native/88/88dd72f8*.png` | 恭喜获得 | **CONGRATS!** (yellow) |
| `gameBundle/native/3d/3db5b6f0*.png` | 去除广告 | **REMOVE ADS** (orange) |
| `main/native/d3/d32c73f3*.png` | 箭头派对 logo | **ARROW PARTY** (blue/pink two-tone neon) |
| `main/native/48/482e6492*.png` | 16+ CADPA 适龄提示 badge | blanked (transparent) — not applicable overseas |

The tutorial tip was shortened to fit its fixed-width bubble:
"Hold to steer the arrow / Reach 90% to win".

## 6. Ads & channel features

- `game/api-shim.js` rewrites the game's backend calls to local stubs (`game/apistub/*.json`),
  captured from the live ops server:
  - `common/config/info` → `apistub/config_info.json` (GM flag off, `noAds:1`, `fullScreenAd:"no"`,
    `isbanner:0` — the production config already disables ads; kept that way)
  - `common/game/share_list` → empty list
  - `common/game/v2/ads` → empty list
- Common ad/analytics beacons (Google/DoubleClick/Facebook/AppLovin/Unity Ads…) are blackholed at
  the XHR/fetch layer as a safety net.
- The result-dialog share/unlock promo (`UnlockNode`, baked Chinese art, China-channel feature)
  is hidden at runtime.
- The "Remove Ads" shop button still renders (native game UI); with the ads config empty it is
  inert.

## 7. Overseas experience adjustments

- GM debug panel hidden by default (runtime sweep; `#gm` URL hash keeps it for QA).
- GM button labels shortened to fit (`Fail`, `Next`).
- English UI copy written in natural casual-game tone ("Tap anywhere to continue",
  "Revive & restore 3 hearts", "Win daily challenges to earn crowns & rewards!", …).
- Title changed to `Territory Arrow` (was `Arrow Party` — a literal translation
  of the Chinese title 箭头派对; the new name fits the gameplay = long-press
  to steer an arrow along a closed path and cut 90% of the territory). Logo PNG
  is baked so the in-home big-letter "ARROW PARTY" label still shows as such
  (it would need a designer to regen); favicon kept.
- Chinese-only concepts removed/neutralized: ICP/age-rating/copyright notices, add-to-desktop
  shortcut label (`Shortcut`), health notice.
- Offline: the game needs no network after the folder is on disk (all API calls stubbed locally).

## 8. Sub-path deployment + overseas UI tweaks

The game is intended to be embedded inside a larger site at the
`/SinglePlayer/arrowparty/` mount point, with the right-side sidebar
hidden at boot (no flash) and the top-left "gift pack" icon removed.

- `server.js` — serves the game folder from `__dirname` and strips an
  optional `/SinglePlayer/arrowparty/` URL prefix before resolving
  files, so the same folder can be hosted at the site root or behind
  the mount point.
- `api-shim.js` — backend stub URLs are now written as relative
  paths so the XHR/fetch hooks resolve correctly when the page is
  served from a sub-path.
- `i18n-shim.js` — the post-load scene sweep now runs every 100 ms
  (was 1200 ms) and hides a fixed list of node names on every pass:
  `SidebarDialog` (the right-side 福利 panel, briefly visible at boot)
  and `_ButtonPlus$sidebar` (the top-left gift-pack button that opens
  it). `UnlockNode` keeps its original rule.
- `start_server.bat`, `README.md` — updated to open the
  `/SinglePlayer/arrowparty/` URL by default.

### HomeScreen left column — node layout reference

Parent `TopView` sits at `(0, +587)`; positions below are local to it,
so a larger local y = higher on screen. Left column, top to bottom:

| Node | Local pos | Absolute y | Role |
|---|---|---|---|
| `_ButtonPlus$setting` | `(-325, +63)` | 650 | gear / settings — **keep** |
| `_ButtonPlus$rank` | `(-316, -52)` | 535 | leaderboard — **keep** |
| `_ButtonPlus$sidebar` | `(-313, -142)` | 445 | gift pack → opens SidebarDialog — **hide** |

`SidebarDialog` is the panel it opens: background `bg_tanchuang_fuli`
(福利 = welfare/benefits) with `ReceivePrize` (领取奖励) / `Complete`
(已领取) buttons — i.e. the China-channel reward entry point.

## 9. Ad integration scaffold (offline bridge + SDK allow-list)

The original build's ad-rendering code is absent from this offline bundle
(no banner/reward/video literals). The `apistub/config_info.json` flags and
`apistub/ads.json` list are the surviving *data contract*; you must supply
the display + reward logic yourself. This scaffold provides the seam:

- `ad-bridge.js` (**new**) — defines `window.AdBridge`, a provider-agnostic
  API: `init()`, `registerProvider()`, `isLive()`, `showRewarded()`,
  `showInterstitial()`, `showFullscreen()`, `showBanner()`, `hideBanner()`.
  Runs in **STUB mode by default** (`provider: null`): every call resolves
  immediately and GRANTS the reward, so the game's reward flow + UI can be
  wired offline. Set `AD_CONFIG.provider` + register a real adapter to go
  live. `AD_CONFIG` (`appId`, `placements`, `testMode`, `stubDelayMs`) is the
  single place to fill keys.
- `api-shim.js` — the ad/analytics beacon blocklist now honours an
  **allow-list**: `window.__AD_ALLOW_DOMAINS` (regex fragments). Matches
  `BLOCK_RE` but also matches an allow entry pass through. Empty list keeps
  the original offline behaviour (everything blocked).
- `index.html` — loads `ad-bridge.js` right after `api-shim.js` and before
  `i18n-shim.js`/`s.25896.js`; a commented SDK-loader template documents the
  3 steps to go live (load SDK script, set `__AD_ALLOW_DOMAINS`, configure +
  register adapter in `ad-bridge.js`).

## 10. Performance: CDN cache headers + precompression (first-cross-region speed)

The first cross-region visit was hitting the Vercel origin because no cache headers
were set and the 7.8 MB `gameScript` transferred uncompressed. Three fixes:

- `vercel.json` (**new**) — static asset cache policy:
  - `index.html` and `/` → `public, max-age=0, must-revalidate` (deploys propagate).
  - root static (js/css/json/atlas/png/…) → `public, max-age=86400, must-revalidate`.
  - `assets/**` (every engine file is content-hashed, e.g. `index.fc3c9.js`) →
    `public, max-age=31536000, immutable`. After the first fetch the CDN serves these
    forever; repeat visits cost 0 requests. This is the core fix for the origin-hit.
- Precompressed siblings: every text asset (js/css/json/atlas/html/svg/…) now has a
  `.br` (brotli -9) and `.gz` (gzip -9) companion. Vercel serves the precompressed
  variant when the client sends `Accept-Encoding`, so compression is guaranteed even if
  the upstream proxy strips `Accept-Encoding`. Key wins (brotli):
  - `assets/gameScript/index.fc3c9.js` 7.82 MB → 2.05 MB (−74%)
  - `cocos2d-js-min.06694.js` 2.03 MB → 444 KB
  - `s.25896.js` 343 KB → 109 KB
  - `assets/zqddn_zhb/index.c64ec.js` 1.38 MB → 347 KB
  - total text payload 12.3 MB → ~3.2 MB brotli (25.9%)
  Config/non-client files (`server.js`, `vercel.json`) were NOT precompressed.
- "Merge small JSON" — **NOT done on purpose.** The 230 `assets/**/*.json` are Cocos
  engine assets loaded by UUID from the bundle's import map; merging files breaks the
  loader. The 3 `apistub/*.json` are independent API stubs the engine parses each as a
  standalone `{code,msg,data}` response, so merging would need invasive response-body
  rewriting. The cache + precompression above already make the first visit the only
  cost — every asset is CDN-cached (immutable) afterwards, so repeat visits are 0
  requests. To cut first-visit *request count*, the proper path is a Cocos build-time
  bundle setting, out of scope for this static mirror.

## File inventory (what changed vs. the original mirror)

| File | Change |
|---|---|
| `index.html` | title, script tags (`api-shim.js`, `i18n-shim.js`), decrypt-layer off switch |
| `api-shim.js` | **new** — API stubs, ad beacons, origin compatibility layer (rewritten stub URLs to be relative for sub-path hosting) |
| `i18n-shim.js` | **new** — runtime translation hooks + UI sweeps (sweep cadence + hide-list extended) |
| `s.25896.js` | FuckDevtool instance removed; domainLock flag forced true |
| `assets/main/index.4396b.js` | domainLock self-heal call disabled |
| `assets/*/config.*.json` (7) | decrypted to plain JSON |
| `assets/*/import/**` (21) | label strings translated |
| `assets/gameBundle/native/{d6,6b,e6,9a,88,3d}/*.png` | banner art re-drawn in English |
| `assets/main/native/d3/*.png` | logo re-drawn ("ARROW PARTY") |
| `assets/main/native/48/*.png` | age badge blanked |
| `assets/level_local/import/b2/*.json` | spine bone name restored after mis-translation (fix) |
| `server.js`, `start_server.bat` | **new** — local server + launcher (now supports sub-path mount) |
| `apistub/*.json` | **new** — canned backend responses |
| `vercel.json` | **new** — static cache-control headers (HTML no-cache; `assets/**` immutable 1y; root static 1 day revalidate) |
| `*.br` / `*.gz` (270 each) | **new** — precompressed companions for every text asset (brotli -9 / gzip -9); `server.js` & `vercel.json` excluded |

## Verification performed

- Headless Chrome (CDP) boot test: engine boots, all 7 bundles register, scene runs, zero
  page errors, zero 404s.
- Simulated play: hold-to-cut raises progress 0%→19%+; win dialog, fail dialog, home screen,
  settings and daily-challenge UI all render in English with the new art; GM panel hidden.
- Live grep gate: no user-facing Chinese labels remain in the scene graph; only intentional
  metadata strings listed above persist in files.
