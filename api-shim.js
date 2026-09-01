/*
 * api-shim.js — offline stub layer for ArrowParty (EN edition).
 *
 * Rewrites the game's backend API calls (op-data.zuiqiangyingyu.net) to
 * same-origin static stub files under ./apistub/, so the game runs with zero
 * backend connectivity. It also stubs common ad-SDK globals so any ad call
 * becomes a no-op (the promised reward is granted by the game logic itself).
 *
 * Loaded from index.html BEFORE the engine bootstrap (s.25896.js).
 */
(function () {
  'use strict';

  var ROUTES = [
    { re: /common\/config\/info/i, file: 'apistub/config_info.json' },
    { re: /common\/game\/share_list/i, file: 'apistub/share_list.json' },
    { re: /common\/game\/v2\/ads/i, file: 'apistub/ads.json' },
  ];

  function routeOf(url) {
    url = String(url || '');
    for (var i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i].re.test(url)) return ROUTES[i].file;
    }
    return null;
  }

  // ---- XHR: rewrite backend API urls to same-origin stubs ----
  var OrigOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    var f = routeOf(url);
    if (f) {
      // Use a relative path so the stub resolves correctly whether the page
      // is hosted at the site root (/) or under a sub-path
      // (/SinglePlayer/arrowparty/).
      arguments[1] = f;
    }
    return OrigOpen.apply(this, arguments);
  };

  // ---- fetch: same rewrite (in case the game uses fetch) ----
  if (typeof window.fetch === 'function') {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var f = routeOf(url);
      if (f) {
        input = f;
      }
      return origFetch.call(this, input, init);
    };
  }

  // ---- Block well-known ad / analytics SDK beacons as a safety net ----
  var BLOCK_RE = /googleadservices|doubleclick|googlesyndication|google-analytics|googletagmanager|facebook\.net|connect\.facebook|applovin|unityads|unity3d\.com\/ads|admob|adservice\./i;

  // Allow-list: domains that should NOT be blocked even if they match BLOCK_RE.
  // Fill this with your real ad SDK's domains once you pick a network, e.g.
  //   window.__AD_ALLOW_DOMAINS = ['pangle\.com', 'admob\.com', 'appylivin\.com'];
  // An empty list keeps the original behaviour (everything ad-related blocked),
  // which is what you want while the game runs fully offline.
  var AD_ALLOW_DOMAINS = (window.__AD_ALLOW_DOMAINS || []).slice();
  function isAllowed(url) {
    for (var i = 0; i < AD_ALLOW_DOMAINS.length; i++) {
      try { if (new RegExp(AD_ALLOW_DOMAINS[i], 'i').test(url)) return true; }
      catch (e) { /* bad pattern, ignore */ }
    }
    return false;
  }
  if (typeof window.fetch === 'function') {
    var origFetch2 = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (BLOCK_RE.test(url) && !isAllowed(url)) {
        return Promise.resolve(new Response('{"code":0,"msg":"blocked","data":{}}',
          { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return origFetch2.call(this, input, init);
    };
  }
  var OrigOpen2 = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (BLOCK_RE.test(String(url || '')) && !isAllowed(String(url || ''))) {
      arguments[1] = 'data:application/json,{"code":0,"msg":"blocked","data":{}}';
    }
    return OrigOpen2.apply(this, arguments);
  };

  // ---- Origin compatibility layer.
  // The obfuscated loader/bundles run publisher domainLock checks against
  // document.domain / location.host and redirect to about:blank (or attempt a
  // banned `document.domain = ...` reassignment) when hosted elsewhere.
  // We present the original production host to those checks so the game runs
  // from any origin. Subresource loading and XHR use the real origin and are
  // unaffected.
  var PROD_HOST = 'static.zuiqiangyingyu.net';
  try {
    var domDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'domain');
    Object.defineProperty(Document.prototype, 'domain', {
      get: function () { return PROD_HOST; },
      set: function (v) { /* ignored on purpose */ },
      configurable: true
    });
  } catch (e) { /* older engines */ }
  ['hostname', 'host'].forEach(function (prop) {
    try {
      var d = Object.getOwnPropertyDescriptor(Location.prototype, prop);
      if (d && d.get) {
        Object.defineProperty(Location.prototype, prop, {
          get: function () { return PROD_HOST; },
          set: d.set ? function (v) { d.set.call(this, v); } : undefined,
          configurable: true
        });
      }
    } catch (e) { /* ignore */ }
  });

  // ---- No-op stubs for ad SDK globals the Chinese build may probe ----
  window.__AD_SHIM__ = true;
  // Expose the allow-list knob so ad-bridge.js (or your bootstrap) can open
  // a specific SDK's domains without editing this file:
  //   window.__AD_ALLOW_DOMAINS = ['pangle\\.com', 'admob\\.com'];
  window.__AD_ALLOW_DOMAINS = window.__AD_ALLOW_DOMAINS || [];
})();
