/*
 * ad-bridge.js — unified ad integration layer for ArrowParty (EN edition).
 *
 * WHY THIS EXISTS
 *   The original Chinese build's ad-rendering code is NOT in this offline
 *   bundle (no banner/reward/video literals survive). What survives is only
 *   the *data contract* (config_info.json flags + apistub/ads.json list) and
 *   the SDK-blocking stub in api-shim.js. To show real ads you must supply the
 *   display + reward logic yourself. This file is that seam: a single,
 *   provider-agnostic API (`window.AdBridge`) your Cocos code calls, behind
 *   which a real SDK adapter can be plugged later.
 *
 * TWO MODES
 *   - STUB mode (default, AD_CONFIG.provider === null):
 *       Every call resolves immediately and GRANTS the reward, so you can wire
 *       up the game's reward flow and UI surfaces offline without any SDK.
 *       Look for the "[AdBridge STUB]" console warnings — they mean no real
 *       ad was shown.
 *   - LIVE mode (AD_CONFIG.provider set + adapter registered):
 *       Calls delegate to the registered provider adapter, which talks to the
 *       real SDK. Fill AD_CONFIG + registerProvider() to go live.
 *
 * LOADING ORDER (index.html): api-shim.js  ->  ad-bridge.js  ->  i18n-shim.js
 *   ->  s.25896.js. ad-bridge only defines window.AdBridge; it must load
 *   before the engine bootstrap so Cocos code can call it at runtime.
 */

(function () {
  'use strict';

  // ===========================================================================
  // 1) CONFIG — fill these in when you pick a real ad network.
  //    Leave `provider: null` to stay in STUB mode (offline, reward granted).
  // ===========================================================================
  var AD_CONFIG = {
    // One of: null (stub) | 'pangle' | 'admob' | 'appLovin' | 'unity' | custom
    provider: null,

    // SDK app id / app key issued by the ad network (subdir hosting is fine;
    // most SDKs accept any valid id as long as the domain allow-listed in
    // api-shim.js matches the SDK's verified domain).
    appId: 'YOUR_APP_ID',

    // Placement / ad unit ids per slot. Names are free-form — your adapter
    // maps them to the SDK's actual slot ids.
    placements: {
      rewarded: 'YOUR_REWARDED_PLACEMENT_ID',     // 激励视频（看视频得奖励）
      interstitial: 'YOUR_INTERSTITIAL_PLACEMENT_ID', // 插屏
      fullscreen: 'YOUR_FULLSCREEN_PLACEMENT_ID',    // 全屏/开屏
      banner: 'YOUR_BANNER_PLACEMENT_ID'             // Banner
    },

    // Test mode: SDKs usually have a sandbox; flip this when going live.
    testMode: true,

    // In STUB mode, delay (ms) before faking "ad finished" so the UX roughly
    // matches a real ad. Set 0 to resolve instantly.
    stubDelayMs: 800
  };

  // ===========================================================================
  // 2) Provider registry. Register an adapter per network. An adapter is a
  //    plain object implementing: init(cfg), showRewarded, showInterstitial,
  //    showFullscreen, showBanner, hideBanner. See exampleAdapter below.
  // ===========================================================================
  var PROVIDERS = {};

  function registerProvider(name, adapter) {
    PROVIDERS[name] = adapter;
  }

  function activeAdapter() {
    return AD_CONFIG.provider ? PROVIDERS[AD_CONFIG.provider] : null;
  }

  // ===========================================================================
  // 3) Internal helpers
  // ===========================================================================
  function warnStub(method) {
    if (!AD_CONFIG.provider) {
      console.warn('[AdBridge STUB] ' + method +
        '() called — no real ad shown, reward granted for offline testing.');
    }
  }

  function fakeFinish(cb, payload) {
    var delay = AD_CONFIG.stubDelayMs || 0;
    setTimeout(function () {
      if (typeof cb === 'function') cb(payload || {});
    }, delay);
  }

  // ===========================================================================
  // 4) Public API
  // ===========================================================================
  var AdBridge = {
    config: AD_CONFIG,

    init: function (cfg) {
      if (cfg) {
        for (var k in cfg) {
          if (k === 'placements' && cfg.placements) {
            for (var p in cfg.placements) AD_CONFIG.placements[p] = cfg.placements[p];
          } else {
            AD_CONFIG[k] = cfg[k];
          }
        }
      }
      var adapter = activeAdapter();
      if (adapter && typeof adapter.init === 'function') adapter.init(AD_CONFIG);
      console.log('[AdBridge] init — provider=' +
        (AD_CONFIG.provider || 'STUB') + ', testMode=' + !!AD_CONFIG.testMode);
      return AdBridge;
    },

    registerProvider: registerProvider,

    isLive: function () { return !!activeAdapter(); },

    // --- Rewarded video: user must watch to earn. onReward() fires on
    //     completion; onClose({rewarded:bool}) fires when the UI closes. ---
    showRewarded: function (slot, opts) {
      opts = opts || {};
      var adapter = activeAdapter();
      if (adapter && typeof adapter.showRewarded === 'function') {
        return adapter.showRewarded(slot || AD_CONFIG.placements.rewarded, opts);
      }
      warnStub('showRewarded');
      // STUB: grant the reward, then close.
      fakeFinish(function () {
        if (typeof opts.onReward === 'function') opts.onReward({ slot: slot });
        if (typeof opts.onClose === 'function') opts.onClose({ rewarded: true });
      });
    },

    // --- Interstitial (插屏) ---
    showInterstitial: function (slot, opts) {
      opts = opts || {};
      var adapter = activeAdapter();
      if (adapter && typeof adapter.showInterstitial === 'function') {
        return adapter.showInterstitial(slot || AD_CONFIG.placements.interstitial, opts);
      }
      warnStub('showInterstitial');
      fakeFinish(function () {
        if (typeof opts.onClose === 'function') opts.onClose({});
      });
    },

    // --- Fullscreen / splash (全屏/开屏) ---
    showFullscreen: function (slot, opts) {
      opts = opts || {};
      var adapter = activeAdapter();
      if (adapter && typeof adapter.showFullscreen === 'function') {
        return adapter.showFullscreen(slot || AD_CONFIG.placements.fullscreen, opts);
      }
      warnStub('showFullscreen');
      fakeFinish(function () {
        if (typeof opts.onClose === 'function') opts.onClose({});
      });
    },

    // --- Banner: needs a DOM container (id or element). Returns a handle. ---
    showBanner: function (slot, container, opts) {
      opts = opts || {};
      var adapter = activeAdapter();
      if (adapter && typeof adapter.showBanner === 'function') {
        return adapter.showBanner(slot || AD_CONFIG.placements.banner, container, opts);
      }
      warnStub('showBanner');
      console.warn('[AdBridge STUB] banner would mount in', container);
      return { destroy: function () {} };
    },

    hideBanner: function (handle) {
      var adapter = activeAdapter();
      if (adapter && typeof adapter.hideBanner === 'function') {
        return adapter.hideBanner(handle);
      }
      // STUB: nothing to hide.
    }
  };

  // ===========================================================================
  // 5) EXAMPLE ADAPTER (template). Copy, rename, implement the SDK calls, and
  //    registerProvider('pangle', newPangleAdapter). The bridge then routes to
  //    it automatically once AD_CONFIG.provider === 'pangle'.
  //
  //    Pseudocode below — replace with the real SDK (Pangle/AdMob/AppLovin/...).
  // ===========================================================================
  /*
  registerProvider('pangle', {
    _sdk: null,
    init: function (cfg) {
      // e.g. load the SDK script if not present, then pangle.init(cfg.appId, {test: cfg.testMode});
      this._sdk = window.pangle || window.ToutiaoJSSDK || null;
    },
    showRewarded: function (slot, opts) {
      var sdk = this._sdk;
      if (!sdk) return opts.onClose && opts.onClose({ rewarded: false });
      sdk.showRewardedVideo({
        slotId: slot,
        onReward: function () { opts.onReward && opts.onReward({ slot: slot }); },
        onClose: function (info) { opts.onClose && opts.onClose(info); }
      });
    },
    showInterstitial: function (slot, opts) { ... },
    showFullscreen:  function (slot, opts) { ... },
    showBanner:      function (slot, container, opts) { ... return { destroy: fn }; },
    hideBanner:      function (handle) { handle && handle.destroy && handle.destroy(); }
  });
  */

  window.AdBridge = AdBridge;
  // Auto-init with defaults (provider=null => STUB mode). Call AdBridge.init({...})
  // again from your own bootstrap once you have real config.
  AdBridge.init();
})();
