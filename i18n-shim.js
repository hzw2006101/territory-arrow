/*
 * i18n-shim.js — runtime Chinese→English translation layer for ArrowParty EN edition.
 *
 * The game code is heavily obfuscated (string-array + rotation checksums), so
 * static replacement inside bundle JS is risky. Instead this shim hooks the
 * Cocos Creator text components at runtime and translates every string that
 * reaches a Label / RichText / EditBox, covering:
 *   - texts baked into prefabs & scenes (import JSON)
 *   - texts composed dynamically in JS (e.g. "第" + level + "关")
 *
 * Loaded from index.html before the game bootstrap; installs itself as soon
 * as the engine (cc) is available.
 */
(function () {
  'use strict';

  var EXACT = {
    '开始游戏': 'PLAY',
    '开始挑战': 'Start',
    '继续游戏': 'Continue',
    '重新挑战': 'Try Again',
    '重新挑战将会丢失游戏进度哦!': 'Restarting now will lose your progress!',
    '重玩本关': 'Replay',
    '返回首页': 'Home',
    '确定': 'OK',
    '跳过': 'Skip',
    '跳过关卡': 'Skip Level',
    '胜利': 'Victory!',
    '失败': 'Level Failed',
    '完成关卡': 'Level Complete',
    '提示': 'Tip',
    '点击任意位置继续': 'Tap anywhere to continue',
    '请输入关卡号': 'Enter level number',
    '复活': 'Revive',
    '免费复活': 'Free Revive',
    '是否复活': 'Keep going?',
    '复活并恢复3个爱心': 'Revive & restore 3 hearts',
    '复活并恢复1个爱心': 'Revive & restore 1 heart',
    '复活次数+1': '+1 Revive',
    '领取奖励': 'Claim Reward',
    '领取': 'Claim',
    '已领取': 'Claimed',
    '已完成挑战': 'Challenge Complete',
    '获取': 'Get',
    '每日挑战': 'Daily Challenge',
    '每日挑战胜利获得皇冠,收集皇冠赢奖励!': 'Win daily challenges to earn crowns & rewards!',
    '抢先挑战': 'Play First',
    '达成该档位奖励所需完': 'Clear levels to reach the reward tier',
    '本周累计': 'This Week',
    '本日累计': 'Today',
    '已挑战': 'Played',
    '剩余挑战次数': 'Attempts left',
    '次数:0': 'Attempts: 0',
    '今日挑战次数': 'Daily attempts',
    '每周一刷新': 'Refreshes every Monday',
    '每日0点刷新': 'Refreshes daily at midnight',
    '活动奖励': 'Event reward',
    '本周奖励': 'Weekly reward',
    '月奖励': 'Monthly reward',
    '获得奖励': 'Got reward',
    '本期已获得': 'Earned this period',
    '上期排名': 'Last rank',
    '当前排名': 'Current rank',
    '未上榜': 'Unranked',
    '击败': 'Beat',
    '挑战玩家': 'Rival',
    'PK': 'VS',
    '道具': 'Items',
    '增加道具': 'More Boosters',
    '增加体力': 'More Energy',
    '补充体力': 'Refill Energy',
    '试用': 'Trial',
    '无敌': 'Shield',
    '试试无敌!': 'Try Shield!',
    '冰冻': 'Freeze',
    '减速': 'Slow',
    '长达24小时': 'Up to 24 hours',
    '强力礼包助你通关！': 'Power pack helps you win!',
    '游戏设置': 'Settings',
    '音效': 'SFX',
    '音乐': 'Music',
    '震动': 'Vibration',
    '清除数据': 'Clear Data',
    '添加桌面': 'Shortcut',
    '长按屏幕,让箭头前进切割\\n长按屏幕,让箭头前进切割': 'Hold to steer the arrow\\nReach 90% to win',
    '长按屏幕,让箭头前进切割\n长按屏幕,让箭头前进切割': 'Hold to steer the arrow\nReach 90% to win',
    '长按屏幕,让箭头前进切割\n切割进度达到90%则胜利': 'Hold to steer the arrow\nReach 90% to win',
    '长按查看局内进度': 'Press & hold to view progress',
    '跟随箭头': 'Follow the arrow',
    '解锁新元素!': 'Unlock new items!',
    '注意躲避弹弹球~': 'Watch out for bouncing balls!',
    '注意躲避齿轮障碍~': 'Watch out for spinning gears!',
    '当前没有作用障碍': 'No active obstacles',
    '轻松又舒心': 'Relax & unwind',
    '畅玩不停歇': 'Endless fun',
    '去除广告': 'Remove Ads',
    '著作权登记号：2020SR0057230': '',
    '粤ICP备2023086686号-10X': '',
    '广州小贝科技有限公司': '',
    '跳关': 'Skip Lv',
    '隐藏UI': 'Hide UI',
    '隐藏GM': 'Hide GM',
    '开发ID': 'Dev ID',
    '顺序ID': 'Seq ID',
    '跳转': 'Jump',
    '下一关': 'Next Level',
    '开': 'On',
    '开+复': 'Auto+Revive',
    '开+复+无敌': 'Auto+Revive+Shield',
    '开启调试': 'Debug On',
    '网络不佳': 'Poor connection',
    '网络链接失败，请刷新网络': 'Network error. Please check your connection.',
    '齿轮': 'Gear',
    '进度：50%': 'Progress: 50%',
    '还有N关解锁': 'Unlocks in N levels',
    '上一关': 'Previous',
    '上月': 'Prev',
    '下月': 'Next',
    '关闭': 'Close',
    '使用': 'Use',
    '刷新网络': 'Retry',
    '切换关卡组': 'Switch Level Pack',
    '体力系统': 'Energy System',
    '去除弹窗广告': 'Remove Interstitial Ads',
    '专注闯关更尽兴': 'Focus & enjoy',
    '享受纯粹的乐趣': 'Pure fun',
    '免费获得10点体力': 'Get 10 free energy',
    '全部完成': 'All Complete',
    '去侧边栏': 'Sidebar',
    '每日有礼': 'Daily Gift',
    ' 每日有礼': ' Daily Gift',
    '复 活': 'REVIVE',
    ' 复 活': 'REVIVE',
    '同行箭头': 'Moving Arrows',
    '前进时注意躲避齿轮~': 'Dodge the gears as you go!',
    '不要被敌方箭头追上哦~': "Don't get caught by enemy arrows!",
    '你动它也动,小心箭头相撞~': 'They move when you move - avoid head-on collisions!',
    '*Tips：退出或者重玩会丢失游戏进度哦！': '*Tip: Quitting or restarting loses progress!',
    '《健康游戏忠告》\n抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。': '',
    '关': '',
    '已跳过广告': 'Ads Skipped',
    '体力:开': 'Energy: On',
    '体力:关': 'Energy: Off',
    '一月': 'Jan', '二月': 'Feb', '三月': 'Mar', '四月': 'Apr', '五月': 'May', '六月': 'Jun',
    '七月': 'Jul', '八月': 'Aug', '九月': 'Sep', '十月': 'Oct', '十一月': 'Nov', '十二月': 'Dec',
    '周一': 'Mon', '周二': 'Tue', '周三': 'Wed', '周四': 'Thu', '周五': 'Fri', '周六': 'Sat', '周日': 'Sun'
  };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var RULES = [
    [/^第(\d+)关$/, 'Level $1'],
    [/^进度[：:]\s*(\d+)%$/, 'Progress: $1%'],
    [/^还有(\d+)关解锁$/, 'Unlocks in $1 levels'],
    [/^(一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月)\s*(\d{4})$/, function (m) {
      return MONTHS['一月二月三月四月五月六月七月八月九月十月十一月十二月'.indexOf(m[1]) / 2] + ' ' + m[2];
    }]
  ];

  // CJK-only fallback: any string that contains Chinese characters and was
  // not in the EXACT table gets replaced with an empty string. This prevents
  // leaked Chinese text from popup panels (e.g. Daily Challenge inner tabs,
  // rank labels, rank-week hints) from showing up in the EN build. The
  // exposed `__i18nLastZh` lets you inspect the last dropped string from
  // the devtools console to fill in the EXACT table properly.
  var CJK_RE = /[\u3400-\u9fff]/;
  function hasCjk(s) { return CJK_RE.test(s); }

  var CACHE = Object.create(null);

  function translate(s) {
    if (typeof s !== 'string' || !s) return s;
    var hit = CACHE[s];
    if (hit !== undefined) return hit;
    if (Object.prototype.hasOwnProperty.call(EXACT, s)) {
      hit = EXACT[s];
    } else {
      hit = s;
      for (var i = 0; i < RULES.length; i++) {
        if (RULES[i][0].test(s)) { hit = s.replace(RULES[i][0], RULES[i][1]); break; }
      }
      if (hit === s && hasCjk(s)) {
        // Untranslated CJK — drop it to avoid leaking Chinese in EN build.
        window.__i18nLastZh = s;
        if (window.__i18nZhLog === undefined) {
          window.__i18nZhLog = [];
        }
        window.__i18nZhLog.push(s);
        if (window.__i18nZhLog.length > 100) window.__i18nZhLog.shift();
        if (typeof console !== 'undefined' && console.warn) {
          // eslint-disable-next-line no-console
          console.warn('[i18n] dropped CJK:', s);
        }
        hit = '';
      }
    }
    CACHE[s] = hit;
    return hit;
  }
  window.__i18nTranslate = translate;

  // Level bookkeeping for the per-level REVIVE budget.
  // These MUST be declared here — the file runs under 'use strict', so a bare
  // `LAST_LEVEL = x` inside the Label setter would throw ReferenceError and get
  // swallowed by the surrounding try/catch, silently killing the "new level
  // resets revive" logic (it was dead code: storeRemove was never reached).
  // We compare the level as a NUMBER, not as a string: several nodes can be
  // named '_Label$level' (HUD, fail dialog, result screen) and they do not all
  // render the value the same way ("5" vs "Lv.5"). A string compare made those
  // two values look like a level change on every single write, so the revive
  // flag was wiped over and over *on the same level* — the fail dialog came
  // straight back after one revive.
  var LAST_LEVEL_RAW = null;
  var LAST_LEVEL_NUM = null;
  function levelNum(s) {
    var d = String(s || '').replace(/[^0-9]/g, '');
    if (!d) return null;
    var n = parseInt(d, 10);
    return isNaN(n) ? null : n;
  }

  function install() {
    if (!window.cc) return false;

    // Hook cc.Label / cc.RichText `string` accessors (ES getter/setter on prototype)
    ['Label', 'RichText'].forEach(function (name) {
      var proto = cc[name] && cc[name].prototype;
      if (!proto) return;
      var desc = Object.getOwnPropertyDescriptor(proto, 'string');
      if (desc && desc.set) {
        Object.defineProperty(proto, 'string', {
          get: desc.get,
          set: function (v) { desc.set.call(this, translate(v)); },
          configurable: true,
          enumerable: desc.enumerable
        });
      }
      if (typeof proto.setString === 'function' && !proto.setString.__i18n) {
        var origSet = proto.setString;
        proto.setString = function (v) { return origSet.call(this, translate(v)); };
        proto.setString.__i18n = true;
      }
      // also cover direct `this._string = ...` writes: define a prototype
      // accessor so deserialization & game code that bypass the `string`
      // setter still get translated. CC3 stores _string as a plain instance
      // field, so a prototype accessor intercepts every write.
      try {
        if (!Object.getOwnPropertyDescriptor(proto, '_string')) {
          (function () {
            var dirty = name === 'Label' ? 'markForUpdateRenderData' : null;
            Object.defineProperty(proto, '_string', {
              get: function () { return this.__i18nStr !== undefined ? this.__i18nStr : ''; },
              set: function (v) {
                this.__i18nStr = translate(v);
                // Detect level-number label changes so the REVIVE budget is
                // refreshed on every new level — one revive per level.
                // Everything else (skip / freerevive / slow / freeze /
                // invincible) is deliberately session-scoped: one use for the
                // whole session, it is NOT restored by entering a new level.
                try {
                  var nd = this.node;
                  if (nd && nd.name === '_Label$level') {
                    var newLvl = String(this.__i18nStr || '');
                    // LAST_LEVEL must be MODULE-scoped, not per-Label-instance.
                    // The game rebuilds the HUD (and with it the level label)
                    // after a revive / restart, and more than one node can be
                    // named '_Label$level'. With a per-instance field every
                    // fresh instance starts at undefined, so its very first
                    // write looked like a "level change" and wiped
                    // ta_used_revive — the flag was cleared on the SAME level,
                    // which is why the fail dialog came straight back.
                    // Compare the level NUMBER (see levelNum above): raw string
                    // compare false-positives whenever two '_Label$level' nodes
                    // format the same level differently, wiping the flag on
                    // every HUD refresh instead of only on a real level change.
                    var newNum = levelNum(this.__i18nStr);
                    if (newNum !== null && LAST_LEVEL_NUM !== newNum) {
                      LAST_LEVEL_NUM = newNum;
                      LAST_LEVEL_RAW = newLvl;
                      // refresh the per-level revive budget on a new level
                      storeRemove('ta_used_revive');
                    }
                  }
                } catch (e) { /* ignore */ }
                if (dirty && typeof this[dirty] === 'function') {
                  try { this[dirty](); } catch (e) { /* engine variation */ }
                }
              },
              configurable: true,
              enumerable: true
            });
          })();
        }
      } catch (e) { /* ignore */ }
    });

    // Hook EditBox placeholder text
    if (cc.EditBox && cc.EditBox.prototype) {
      var eb = cc.EditBox.prototype;
      ['placeholder', 'string'].forEach(function (prop) {
        var d = Object.getOwnPropertyDescriptor(eb, prop);
        if (d && d.set) {
          Object.defineProperty(eb, prop, {
            get: d.get,
            set: function (v) { d.set.call(this, translate(v)); },
            configurable: true,
            enumerable: d.enumerable
          });
        }
      });
    }

    window.__i18nInstalled = true;

    // ---- Western-edition UI adjustments ----
    // QA escape hatch: open the game with #gm to keep the GM debug panel.
    var TEST_GM = /#gm/i.test(location.hash || '');

    // 1) UnlockNode: hide the China-channel share/unlock promo (result dialog)
    // 2) GMView: hide the GM debug panel unless #gm
    // 3) SidebarDialog: the right-side "welfare" panel (福利弹窗,
    //    bg_tanchuang_fuli / ReceivePrize). It briefly pops up at boot
    //    before the game logic dismisses it; we want it gone from the first
    //    frame instead of flashing.
    // 4) _ButtonPlus$sidebar: the gift-pack icon button at the top-left —
    //    the entry point that opens the SidebarDialog above.
    //    Left column of HomeScreen/TopView (parent at y=+587), top-down:
    //      _ButtonPlus$setting   (-325,  +63)  gear / settings     (keep)
    //      _ButtonPlus$rank      (-316,  -52)  leaderboard         (keep)
    //      _ButtonPlus$sidebar   (-313, -142)  gift pack           (HIDE)
//      _ButtonPlus$DailyChallenge       daily challenge btn  (HIDE)
//      _ButtonPlus$NoAd                 remove-ads btn       (HIDE)
//      _Node$DifficultInfo              "难度飙升" floating banner (HIDE)
//      _Spine$DifficultAni              spine animation behind banner (HIDE)
// Note: we list BOTH the bare name (e.g. 'NoAd') and the
// component-prefixed form (e.g. '_ButtonPlus$NoAd') because the
// runtime cc.Node.name convention varies by Cocos version and scene.
    var HIDE_NAMES = ['_Node$UnlockNode', 'UnlockNode', 'SidebarDialog',
                      '_ButtonPlus$sidebar', 'sidebar',
                      '_ButtonPlus$DailyChallenge', 'DailyChallenge',
                      '_ButtonPlus$DailyChallengeLock', 'DailyChallengeLock',
                      '_ButtonPlus$NoAd', 'NoAd',
                      '_Node$DifficultInfo', 'DifficultInfo',
                      '_Spine$DifficultAni', 'DifficultAni'];

    // ---- GM debug panel flash fix (render-time suppression) ------------
    // This Cocos 2.x build activates the GM debug panel (launch/Canvas/GMVIew)
    // by writing its internal _active field rather than through the `active`
    // accessor setter, so intercepting the setter is impossible -- verified by
    // overriding the prototype setter and confirming `node.active=true` still
    // reads back true. The only reliable point to keep it from ever painting
    // is the LAST hook before the GPU draws: cc.Director.EVENT_BEFORE_DRAW.
    // We walk the live scene tree on every draw and force the GM panel inactive,
    // so it never gets a single painted frame. The #gm QA escape hatch keeps it
    // visible (TEST_GM is true).
    var GM_NODE_NAMES = ['GMVIew', 'GMView', 'GmNode'];
    function _suppressGM(root) {
      if (!root) return;
      (function walk(n, d) {
        if (!n || d > 16) return;
        var nm = n.name || '';
        if (GM_NODE_NAMES.indexOf(nm) !== -1) {
          if (n.active) { try { n.active = false; } catch (e) {} }
        }
        var ch = n.children || [];
        for (var i = 0; i < ch.length; i++) walk(ch[i], d + 1);
      })(root, 0);
    }
    try {
      if (typeof cc !== 'undefined' && cc.director) {
        var _dEvt = function (name) { return (cc.Director && cc.Director[name]) || name; };
        var _onFrame = function () {
          if (TEST_GM) return;
          try { var s = cc.director.getScene(); if (s) _suppressGM(s); } catch (e) {}
        };
        // Re-attach idempotently (off-then-on) so repeated scene loads never
        // accumulate duplicate guards nor lose them if a build clears director
        // events on loadScene.
        var _attachGMGuards = function () {
          try {
            cc.director.off(_dEvt('EVENT_BEFORE_UPDATE'), _onFrame);
            cc.director.off(_dEvt('EVENT_BEFORE_DRAW'), _onFrame);
            cc.director.on(_dEvt('EVENT_BEFORE_UPDATE'), _onFrame);
            cc.director.on(_dEvt('EVENT_BEFORE_DRAW'), _onFrame);
          } catch (e) {}
        };
        if (typeof cc.director.on === 'function') {
          _attachGMGuards();
          // Re-arm on every scene launch (entering a level calls loadScene).
          cc.director.on(_dEvt('EVENT_AFTER_SCENE_LAUNCH'), _attachGMGuards);
        }
      }
    } catch (e) { /* director events unavailable; the sweep below is the fallback */ }


    // ---- One-shot power-ups / revive / skip -------------------------------
    // These buttons still WORK (they slow time, freeze hazards, grant
    // invincibility, revive after a fail, skip a level) but the ad SDK that
    // was supposed to gate them is stripped, so a player could spam them and
    // breeze through every level. Give each feature exactly ONE free use per
    // game session: the button stays until it is tapped once, then disappears
    // for the rest of the session. Reopening the game restores them.
    // Storage is sessionStorage so a page refresh / new visit resets the
    // budget; switch to localStorage below for a permanent, per-save limit.
    // One-shot feature gating. The Cocos scene files use INCONSISTENT casing for
    // these nodes — e.g. GameScreen has both `Freeze` and `freeze`, `Invincible`
    // and `invincible`, `Skip` and `skip`, plus `_ButtonPlus$skip` (lowercase).
    // To catch every variant we store the map with lowercased keys and look nodes
    // up case-insensitively. The value (revive/skip/slow/freeze/invincible/
    // freerevive) is the stable sessionStorage budget key, independent of casing.
    // Budget scope per key. Read together with the requirement:
    //   revive  -> ONCE PER LEVEL  (refreshed when the level number changes).
    //              FreeRevive counts as a "revive" — both buttons share the
    //              same per-level budget so the player cannot stack a paid
    //              Revive and a FreeRevive on the same level.
    //   slow / freeze / invincible / skip
    //           -> ONCE PER SESSION = once for the whole game session.
    //              They never refresh across levels, restart is not enough —
    //              a refresh or new visit is the only way to bring them back.
    //   restart / continue / freerevive (as its own budget)
    //           -> removed: the player can press them any number of times.
    //              The earlier "session" scope made the LEVEL FAILED dialog
    //              lose its Restart/Replay button after the first tap, which
    //              trapped the run — the dialog reappeared with NO way out,
    //              exactly the "stuck on the fail dialog" the player reported.
    var ONE_SHOT_SCOPE = {
      revive: 'level',
      skip: 'session',
      slow: 'session',
      freeze: 'session',
      invincible: 'session'
    };
    var ONE_SHOT = {
      // Revive button on the REVIVE dialog (`017f5b358`). One per level — see
      // scope above.
      '_buttonplus$revive': 'revive',
      'revive': 'revive',
      // FreeRevive on the same dialog shares the per-level revive budget, so
      // a single level cannot chain a paid Revive into a free one.
      '_buttonplus$freerevive': 'revive',
      'freerevive': 'revive',
      '_node$freerevive': 'revive',
      // GameScreen prop tray (`_Node$bottomView`). Once per game session —
      // the player should not get two Shields in a single run.
      'slow': 'slow',
      '_node$slow': 'slow',
      'freeze': 'freeze',
      '_node$freeze': 'freeze',
      'invincible': 'invincible',
      '_node$invincible': 'invincible',
      // Skip button on GameScreen (`_Node$topView`). Once per session.
      // The "Skip" node on the LEVEL FAILED dialog is also captured here,
      // so the skip button stays in sync across both surfaces.
      '_buttonplus$skip': 'skip',
      'skip': 'skip',
      'btn_skip': 'skip'
      // restart / _buttonplus$restart / btn_restart / continue / btn_continue
      // are deliberately NOT in this map. They are the player's "keep going"
      // buttons and must remain available for every attempt.
    };
    // ---- Storage with layered fallback -----------------------------------
    // On platform wrappers (SpellSync and friends) the game runs inside a
    // cross-origin iframe or a sandboxed webview. There, merely *touching*
    // window.sessionStorage can THROW, and setItem can fail silently (blocked
    // storage / quota / private mode). When that happens STORE is null and —
    // far worse — markUsed() swallows the failure: the button is hidden for
    // the moment, but nothing is ever recorded, so isUsed() returns false on
    // the next fail and the whole dialog (Revive button included) comes back.
    // That is exactly the "used revive once, dialog is back next time" bug.
    // Fix: sessionStorage -> localStorage -> in-memory, and VERIFY every write
    // by reading it back, falling through to the next layer if it did not stick.
    var MEM_STORE = {};
    var STORE = null;
    try { STORE = window.sessionStorage; } catch (e) { STORE = null; }

    function storeGet(k) {
      if (STORE) { try { var v = STORE.getItem(k); if (v !== null) return v; } catch (e) {} }
      try { if (window.localStorage) { var l = window.localStorage.getItem(k); if (l !== null) return l; } } catch (e) {}
      return Object.prototype.hasOwnProperty.call(MEM_STORE, k) ? MEM_STORE[k] : null;
    }
    function storeSet(k, v) {
      if (STORE) {
        try { STORE.setItem(k, v); if (STORE.getItem(k) === v) return true; } catch (e) {}
      }
      try {
        if (window.localStorage) {
          window.localStorage.setItem(k, v);
          if (window.localStorage.getItem(k) === v) return true;
        }
      } catch (e) {}
      try { MEM_STORE[k] = v; return true; } catch (e) {}
      return false;
    }
    function storeRemove(k) {
      if (STORE) { try { STORE.removeItem(k); } catch (e) {} }
      try { if (window.localStorage) window.localStorage.removeItem(k); } catch (e) {}
      try { delete MEM_STORE[k]; } catch (e) {}
    }
    function usedKey(k) { return 'ta_used_' + k; }
    function isUsed(k) { return storeGet(usedKey(k)) === '1'; }
    function markUsed(k) { storeSet(usedKey(k), '1'); }

    // Diagnostics. On a platform wrapper the game runs in an iframe; if the
    // one-shot logic ever misbehaves there, open devtools on the game frame and
    // run __taDiag() — it reports which storage layer actually works and what
    // the current usage flags are.
    window.__taDiag = function () {
      var out = { session: false, local: false, mem: {}, used: {}, levelNum: LAST_LEVEL_NUM };
      try {
        window.sessionStorage.setItem('__ta_probe', '1');
        out.session = window.sessionStorage.getItem('__ta_probe') === '1';
        window.sessionStorage.removeItem('__ta_probe');
      } catch (e) { out.sessionErr = String((e && e.message) || e); }
      try {
        window.localStorage.setItem('__ta_probe', '1');
        out.local = window.localStorage.getItem('__ta_probe') === '1';
        window.localStorage.removeItem('__ta_probe');
      } catch (e) { out.localErr = String((e && e.message) || e); }
      ['revive', 'skip', 'slow', 'freeze', 'invincible'].forEach(function (k) {
        out.used[k] = isUsed(k);
      });
      for (var m in MEM_STORE) {
        if (Object.prototype.hasOwnProperty.call(MEM_STORE, m)) out.mem[m] = MEM_STORE[m];
      }
      return out;
    };
    // Recognise a FAIL-style dialog without depending on its node name.
    // A dialog counts as fail-style when its subtree contains a revive-ish
    // button. The prop-info dialog is explicitly excluded (it carries
    // '_Label$Tip2') so it is never caught by this rule.
    function containsReviveButton(root) {
      var yes = false;
      var isTip = false;
      (function dfs(n, d) {
        if (!n || d > 8) return;
        var nm = String(n.name || '').toLowerCase();
        if (nm === '_label$tip2') isTip = true;
        if (!yes && nm.indexOf('revive') !== -1) yes = true;
        if (isTip && yes) return;
        (n.children || []).forEach(function (c) { dfs(c, d + 1); });
      })(root, 0);
      return yes && !isTip;
    }

    // ---- Per-dialog revive verdict ---------------------------------------
    // A fail/revive dialog is judged ONCE, the moment it first appears:
    //   'allow'    - the level's revive budget is still intact. From here on we
    //                must NOT touch this dialog or its Revive button. The game
    //                drives its whole resurrection flow from that dialog's
    //                nodes, so hiding it while the click is being handled tears
    //                the flow apart and leaves the game frozen at the death
    //                point. Measured: with the old "hide the dialog as soon as
    //                revive is used" rule, node motion after the revive click
    //                was 0 (frozen); with the shim out of the way it is 14 and
    //                the game resumes. That freeze is what the player reported.
    //   'suppress' - the dialog appeared AFTER the budget was spent. Only then
    //                do we hide the Revive button, and the Close (X) button is
    //                left alone so the run can still be settled normally.
    // The verdict lives ON THE DIALOG NODE, so it dies with the dialog and the
    // next death gets a fresh judgement.
    function judgeDialogs(scene) {
      try {
        (function find(n, d) {
          if (!n || d > 8) return;
          if (n.name === '__UI_Dialog') {
            var kids = n.children || [];
            for (var i = 0; i < kids.length; i++) {
              var kid = kids[i];
              if (!kid || !kid.active) continue;
              if (containsReviveButton(kid) && kid.__taVerdict === undefined) {
                kid.__taVerdict = isUsed('revive') ? 'suppress' : 'allow';
              }
            }
            return;
          }
          (n.children || []).forEach(function (c) { find(c, d + 1); });
        })(scene, 0);
      } catch (e) { /* ignore */ }
    }
    // Which verdict governs a node? Walk up to the nearest judged dialog.
    // Nodes outside any judged dialog default to 'allow' (never hide).
    function verdictFor(node) {
      var p = node;
      var guard = 0;
      while (p && guard++ < 24) {
        if (p.__taVerdict !== undefined) return p.__taVerdict;
        p = p.parent;
      }
      return 'allow';
    }

    // Arm a one-shot button.
    //
    // Event list: 'touchstart' is deliberately included. The game tears the
    // fail dialog down as soon as the revive handler runs, and on some paths
    // that happens on the press rather than the release — if we only listened
    // for 'touchend' the node was already gone and markUsed() never fired, so
    // the budget was silently restored on the next fail. Recording on the
    // press makes the write unavoidable.
    //
    // We also arm the button's children: the visible hit area is usually a
    // Label / icon child, and arming only the parent relies entirely on Cocos
    // bubbling. Registering on the children too means a tap is recorded even if
    // bubbling is interrupted by game code calling stopPropagation().
    //
    // `hideAfter` (default true) controls whether the button is visually
    // retired 300ms after the tap. It MUST be false for the dialog the player
    // is currently using — see the per-dialog verdict above.
    function armOneShot(node, key, hideAfter) {
      var fired = false;
      // The in-level prop buttons (Slow / freeze / invincible) carry a
      // `GrayState` child node that the game activates while the prop is
      // unavailable. When the player taps such a button the game itself does
      // nothing, but our listener would still fire and consume the budget.
      // Guard both at arm time (in the walk) and at click time (here) so the
      // session/level budget is never burned by a gray tap.
      var isGrayed = function () {
        try {
          var ks = node.children || [];
          for (var gj = 0; gj < ks.length; gj++) {
            if (ks[gj].name === 'GrayState' && ks[gj].active) return true;
          }
        } catch (e) {}
        return false;
      };
      var handler = function () {
        if (fired) return;
        if (isGrayed()) return; // prop unavailable — click does nothing
        fired = true;
        markUsed(key);
        try { console.log('[i18n] one-shot used:', key, '- retiring button'); } catch (e) {}
        // On a dialog we cleared for this death the game is still driving its
        // resurrection flow through these nodes. Hiding them mid-flow freezes
        // the game, so on those we only record the budget and never hide.
        if (hideAfter === false) return;
        // Give the game a moment to run its own click logic before hiding.
        setTimeout(function () {
          try { node.active = false; } catch (e) {}
        }, 300);
      };
      var events = ['touchstart', 'touchend', 'click', 'mouse-up'];
      var bind = function (target) {
        if (!target || typeof target.on !== 'function') return;
        for (var i = 0; i < events.length; i++) {
          try { target.on(events[i], handler, target); } catch (e) { /* ignore */ }
        }
      };
      bind(node);
      // Arm the immediate visual children as well (label / icon / sprite), so
      // a tap that lands on them is still recorded.
      try {
        var kids = node.children || [];
        for (var ci = 0; ci < kids.length && ci < 8; ci++) bind(kids[ci]);
      } catch (e) { /* ignore */ }
    }
    // Sweep is short-lived; stops after the dialog system is up.
    var sweeps = 0;
    var hidLogged = false;
    var sweepTimer = setInterval(function () {
      sweeps++;
      try {
        // Cocos Creator 3.x exposes the running scene via director.getScene();
        // the 2.x private field cc.director._scene does NOT exist there, which
        // silently disabled every HIDE_NAMES rule. Try both, prefer getScene().
        var scene = null;
        try {
          var d = cc.director;
          if (d) {
            if (typeof d.getScene === 'function') scene = d.getScene();
            if (!scene && d._scene) scene = d._scene;
            // 3.x also keeps a scene list; fall back to the first loaded scene.
            if (!scene && d._scenes && d._scenes.length) scene = d._scenes[0];
          }
        } catch (e) { /* ignore */ }
        if (!scene) return;
        if (!hidLogged) {
          hidLogged = true;
          try { console.log('[i18n] scene found:', scene && scene.name, '- hiding', HIDE_NAMES.length, 'node names'); } catch (e) {}
        }
        // --- Power-up info dialog (PropDialog) -----------------------------
        // The dialog pairs a `_Label$Tip2` label with the power-up icon nodes
        // `_Node$Slow / _Node$Freeze / _Node$Invincible`. CRUCIAL: those same
        // icon names ALSO appear on the in-level prop buttons, so they must be
        // told apart by TREE POSITION, not by name. We therefore locate the
        // dialog root structurally (closest ancestor of `_Label$Tip2` that still
        // contains an icon node) and scope every dialog descendant so ONE_SHOT /
        // HIDE never touch it. The dialog's Title / Tip1 / Tip2 are then filled
        // with English copy on every sweep while it is visible, so the text is
        // always present even if the game re-clears it. Durations mirror
        // apistub/config_info.json data.itemTime = [8,8,10]
        // -> { invincible:8, freeze:8, slow:10 }.
        var dialogRoot = null;
        try {
          var tip2Node = null;
          (function findTip2(n, d) {
            if (!n || tip2Node || d > 12) return;
            if (n.name === '_Label$Tip2') { tip2Node = n; return; }
            (n.children || []).forEach(function (c) { findTip2(c, d + 1); });
          })(scene, 0);
          if (tip2Node) {
            var containsIcon = function (root) {
              var yes = false;
              (function dfs(n, dd) {
                if (!n || yes || dd > 8) return;
                var nn = n.name;
                if (nn === '_Node$Slow' || nn === '_Node$Freeze' || nn === '_Node$Invincible') { yes = true; return; }
                (n.children || []).forEach(function (c) { dfs(c, dd + 1); });
              })(root, 0);
              return yes;
            };
            var cur = tip2Node;
            while (cur && cur !== scene) {
              if (containsIcon(cur)) { dialogRoot = cur; break; }
              cur = cur.parent;
            }
            if (!dialogRoot) dialogRoot = tip2Node.parent || tip2Node;
          }
        } catch (e) { dialogRoot = null; }

        function isInDialog(node) {
          if (!dialogRoot || !node) return false;
          var p = node;
          while (p) { if (p === dialogRoot) return true; p = p.parent; }
          return false;
        }

        function fillPropDialog(root) {
          if (!root || !root.active) return;
          var titleNode = null, tip1Node = null, tip2Node2 = null;
          var slowI = null, freezeI = null, invI = null;
          (function deep(n, depth) {
            if (!n || depth > 8) return;
            var dn = n.name;
            if (dn === '_Label$Title') titleNode = n;
            else if (dn === '_Label$Tip1') tip1Node = n;
            else if (dn === '_Label$Tip2') tip2Node2 = n;
            else if (dn === '_Node$Slow') slowI = n;
            else if (dn === '_Node$Freeze') freezeI = n;
            else if (dn === '_Node$Invincible') invI = n;
            (n.children || []).forEach(function (c) { deep(c, depth + 1); });
          })(root, 0);
          if (!titleNode || !tip2Node2) return;
          // Determine which power-up is shown. Prefer the stable active-icon
          // state (the game sets exactly one icon active at a time), and fall
          // back to the title text for the rare case none is active.
          var key = null;
          if (slowI && slowI.active) key = 'slow';
          else if (freezeI && freezeI.active) key = 'freeze';
          else if (invI && invI.active) key = 'invincible';
          else {
            var title = '';
            try { title = (titleNode.getComponent(cc.Label) && titleNode.getComponent(cc.Label).string) || titleNode._string || ''; } catch (e) {}
            var tl = (title || '').trim().toLowerCase();
            if (tl === 'slow') key = 'slow';
            else if (tl === 'freeze') key = 'freeze';
            else if (tl === 'shield') key = 'invincible';
          }
          if (!key) return;
          var DUR = { slow: 10, freeze: 8, invincible: 8 };
          var txt = {
            slow:       { title: 'Slow',   tip1: '(Only affects balls)', tip2: 'Balls slow for ' + DUR.slow + 's' },
            freeze:     { title: 'Freeze', tip1: '(Only affects balls)', tip2: 'Balls freeze for ' + DUR.freeze + 's' },
            invincible: { title: 'Shield', tip1: '',                      tip2: 'Arrows are invincible for ' + DUR.invincible + 's' }
          }[key];
          var setL = function (nd, s) {
            if (!nd) return;
            try { var L = nd.getComponent(cc.Label); if (L) L.string = s; else nd._string = s; } catch (e) {}
          };
          setL(titleNode, txt.title);
          setL(tip1Node, txt.tip1);
          setL(tip2Node2, txt.tip2);
        }

        // Judge every fail/revive dialog ONCE, before the walk below runs, so
        // the walk can consult the verdict while arming/hiding one-shot nodes.
        judgeDialogs(scene);

        (function walk(node) {
          if (!node) return;
          var nm = node.name || '';
          if (!TEST_GM && (nm === 'GMVIew' || nm === 'GMView')) {
            if (node.active) node.active = false;
          }
          // Never hide / arm anything inside the prop dialog subtree.
          if (!isInDialog(node)) {
            if (HIDE_NAMES.indexOf(nm) !== -1) {
              if (node.active) node.active = false;
            }
            var oneKey = ONE_SHOT[nm.toLowerCase()];
            if (oneKey) {
              // GrayState check: if the prop button has an active `GrayState`
              // child it is in the unavailable state — do NOT arm the listener,
              // so a tap on the grayed-out button is a true no-op (no budget
              // consumed, no debounce, no hide-after-300ms side effects).
              var gray = null;
              var ks = node.children || [];
              for (var gi = 0; gi < ks.length; gi++) {
                if (ks[gi].name === 'GrayState') { gray = ks[gi]; break; }
              }
              var isGray = gray && gray.active;
              var verdict = verdictFor(node);
              // Per-key hide rule:
              //   'revive' is per-LEVEL — only retire it on a dialog that
              //   appeared AFTER the level's revive budget was spent. The
              //   gating by verdict (== 'suppress') is what makes it
              //   "per-level": the verdict flips back to 'allow' on a new
              //   level (see judgeDialogs + the level-label watcher that
              //   resets ta_used_revive), so the button comes back.
              //   FreeRevive is mapped to the same 'revive' key (see above),
              //   so it shares the per-level budget and the same verdict
              //   gating — the dialog's FreeRevive button stays visible on
              //   the first death of a level and is hidden the second time.
              //   Every other ONE_SHOT key (skip / slow / freeze / invincible)
              //   is per-SESSION AND has no first-click dependency on the
              //   dialog, so it is retired the instant isUsed(key) is true,
              //   regardless of which dialog it appears in. Without this
              //   those buttons would reappear on every level after their
              //   session budget was spent — the bug the player just caught.
              //   restart / continue are not in ONE_SHOT at all, so this
              //   block is never reached for those — they remain visible
              //   every time, including on the LEVEL FAILED dialog.
              var usedNow = isUsed(oneKey);
              var shouldHide = usedNow && verdict === 'suppress';
              if (shouldHide) {
                if (node.active) node.active = false;
              } else if (!isGray && !node.__taOneShot) {
                node.__taOneShot = true;
                // On the FIRST dialog for a level, the game is still driving
                // its resurrection flow through the revive-ish button — if we
                // hide it 300 ms after the click the flow dies with it. So
                // 'revive' (and 'freerevive', which maps to the same key) is
                // only auto-hidden on a 'suppress' dialog; every other key
                // (slow / freeze / invincible / skip) hides unconditionally
                // because the game transitions out of them within a few frames
                // and our 300 ms grace is harmless.
                var hideAfter = oneKey !== 'revive' || verdict === 'suppress';
                armOneShot(node, oneKey, hideAfter);
              }
            }
          }
          if (node === dialogRoot) fillPropDialog(node);
          (node.children || []).forEach(walk);
        })(scene, false);
      } catch (e) { /* ignore */ }

      // ---- Why we no longer tear the whole fail dialog down ---------------
      // An earlier version hid the ENTIRE fail/revive dialog as soon as
      // ta_used_revive was set. That flag is written on 'touchstart' (see
      // armOneShot), i.e. at the instant the player PRESSES Revive — so the
      // very next 100 ms sweep ripped the dialog out of the tree while the
      // game was still running its resurrection flow through that dialog's
      // nodes. The flow died with it and the game stayed frozen at the death
      // point: the dialog vanished, the screen looked playable, but nothing
      // ever moved again.
      //
      // A/B on the same build proves it:
      //   shim enabled  -> ta_used_revive='1', moving nodes after the click: 0
      //   shim disabled -> ta_used_revive unset, moving nodes: 14 (resumes)
      //
      // So the dialog is now left strictly alone while the player is using it.
      // Limiting revive to once per level is handled by the per-dialog verdict
      // in judgeDialogs(): the dialog is judged the moment it appears, and only
      // a dialog that shows up AFTER the budget is spent loses its Revive
      // button. The Close (X) button always stays, so the run can still be
      // settled through the game's own flow.

      // Sweep must run FOREVER, not just 3 minutes. loadScene() destroys the
      // previous scene and creates a fresh node tree; if the sweeper is
      // already stopped, every node we hid reappears the next time the player
      // navigates back to HomeScreen. Walking ~30 nodes every 100 ms is
      // negligible CPU.
      if (sweeps % 200 === 0) {
        try { console.log('[i18n] sweep', sweeps, '— keeping nodes hidden'); } catch (e) {}
      }
    }, 100);

    return true;
  }

  // Install as soon as the engine defines cc.Label (engine script is added
  // dynamically by the bootstrap, so poll briefly).
  (function waitEngine() {
    if (install()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (install() || tries > 600) clearInterval(timer); // up to ~30s
    }, 50);
  })();
})();
