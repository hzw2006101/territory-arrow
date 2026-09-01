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
    }
    CACHE[s] = hit;
    return hit;
  }
  window.__i18nTranslate = translate;

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
    //      _ButtonPlus$setting  (-325,  +63)  gear / settings   (keep)
    //      _ButtonPlus$rank     (-316,  -52)  leaderboard       (keep)
    //      _ButtonPlus$sidebar  (-313, -142)  gift pack         (HIDE)
    var HIDE_NAMES = ['_Node$UnlockNode', 'UnlockNode', 'SidebarDialog',
                      '_ButtonPlus$sidebar'];
    // Sweep is short-lived; stops after the dialog system is up.
    var sweeps = 0;
    var sweepTimer = setInterval(function () {
      sweeps++;
      try {
        var scene = cc.director && cc.director._scene;
        if (!scene) return;
        (function walk(node) {
          if (!node) return;
          if (!TEST_GM && (node.name === 'GMVIew' || node.name === 'GMView')) {
            if (node.active) node.active = false;
          }
          if (HIDE_NAMES.indexOf(node.name) !== -1) {
            if (node.active) node.active = false;
          }
          (node.children || []).forEach(walk);
        })(scene);
      } catch (e) { /* ignore */ }
      if (sweeps > 1800) clearInterval(sweepTimer);
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
