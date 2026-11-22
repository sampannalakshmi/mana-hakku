/*
 * Mana Hakku - application shell, router, i18n helper and state store.
 * Plain browser JavaScript (ES2018). Depends on globals defined by
 * data.js (MH_DATA), i18n.js (MH_I18N) and pages-a.js / pages-b.js (MH_PAGES).
 */
(function () {
  'use strict';

  var LANG_KEY = 'mh_lang';
  var STATE_KEY = 'mh_state_v1';
  var LOADING_DELAY_MS = 250;
  var SUPPORTED_LANGS = ['en', 'te'];
  var PAGE_ROUTES = [
  'dashboard',
  'profile',
  'assistant',
  'discover',
  'tracker',
  'admin',
  'login',
  'register'
];

  // Sidebar navigation: [route name, i18n key for label]
  var NAV = [
    ['dashboard', 'navDashboard'],
    ['profile', 'navProfile'],
    ['assistant', 'navAssistant'],
    ['discover', 'navDiscover'],
    ['tracker', 'navTracker'],
    ['admin', 'navAdmin']
  ];

  // Topbar / document title label keys per route
  var ROUTE_LABELS = {
  dashboard: 'navDashboard',
  profile: 'navProfile',
  assistant: 'navAssistant',
  discover: 'navDiscover',
  scholarship: 'navDiscover',
  tracker: 'navTracker',
  admin: 'navAdmin',
  login: 'Login',
  register: 'Register'
};

  var renderToken = 0;

  /* ---------- helpers ---------- */

  function escapeHTML(str) {
    return String(str === null || str === undefined ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(n) {
    var num = Math.round(Number(n));
    if (!isFinite(num)) { num = 0; }
    var neg = num < 0;
    var s = String(Math.abs(num));
    var out;
    if (s.length <= 3) {
      out = s;
    } else {
      var last = s.slice(-3);
      var rest = s.slice(0, -3);
      var parts = [];
      while (rest.length > 2) {
        parts.unshift(rest.slice(-2));
        rest = rest.slice(0, -2);
      }
      if (rest) { parts.unshift(rest); }
      out = parts.join(',') + ',' + last;
    }
    return '\u20B9 ' + (neg ? '-' : '') + out;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function todayISO() {
    var d = new Date();
    var mm = String(d.getMonth() + 1);
    var dd = String(d.getDate());
    return d.getFullYear() + '-' + (mm.length < 2 ? '0' + mm : mm) + '-' + (dd.length < 2 ? '0' + dd : dd);
  }

  /* ---------- language ---------- */

  function readLang() {
    try {
      var saved = window.localStorage.getItem(LANG_KEY);
      if (SUPPORTED_LANGS.indexOf(saved) !== -1) { return saved; }
    } catch (e) { /* storage unavailable */ }
    return 'en';
  }

  function t(key) {
    var dict = (window.MH_I18N && window.MH_I18N[MH.lang]) || {};
    var fallback = (window.MH_I18N && window.MH_I18N.en) || {};
    if (dict[key]) { return dict[key]; }
    if (fallback[key]) { return fallback[key]; }
    return key;
  }

  function setLang(l) {
    if (SUPPORTED_LANGS.indexOf(l) === -1) { return; }
    MH.lang = l;
    try {
      window.localStorage.setItem(LANG_KEY, l);
    } catch (e) { /* ignore storage errors */ }
    document.documentElement.lang = l;
    render();
  }

  /* ---------- state store ---------- */

  function defaultState() {
    var data = window.MH_DATA || {};
    return {
      profile: clone(data.student || {}),
      applications: clone(data.applications || []),
      assistantLog: []
    };
  }

  function readState() {
    var base = defaultState();
    try {
      var raw = window.localStorage.getItem(STATE_KEY);
      if (!raw) { return base; }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) { return base; }
      return Object.assign({}, parsed, {
        profile: parsed.profile && typeof parsed.profile === 'object' ? parsed.profile : base.profile,
        applications: Array.isArray(parsed.applications) ? parsed.applications : base.applications,
        assistantLog: Array.isArray(parsed.assistantLog) ? parsed.assistantLog : base.assistantLog
      });
    } catch (e) {
      return base;
    }
  }

  function writeState(state) {
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      if (window.console) { console.warn('Mana Hakku: could not save state', e); }
    }
  }

  var store = {
    get: function () {
      return readState();
    },

    // updater: partial object to merge, or function(current) returning new state.
    // Saves and re-renders the current route unless opts.render === false.
    set: function (updater, opts) {
      var cur = readState();
      var next;
      if (typeof updater === 'function') {
        var res = updater(cur);
        next = res && typeof res === 'object' ? res : cur;
      } else {
        next = Object.assign({}, cur, updater || {});
      }
      writeState(next);
      if (!opts || opts.render !== false) { render(); }
      return next;
    },

    reset: function () {
      writeState(defaultState());
      render();
    }
  };

  function updateApplicationStatus(appId, status) {
    var state = readState();
    var updated = null;
    var apps = state.applications.map(function (app) {
      if (String(app.id) === String(appId)) {
        updated = Object.assign({}, app, { status: status, updatedOn: todayISO() });
        return updated;
      }
      return app;
    });
    store.set({ applications: apps });
    return updated;
  }

  /* ---------- router ---------- */

  function parseRoute() {
    var hash = (window.location.hash || '').replace(/^#/, '');
    var path = hash.split('?')[0];
    if (!path || path === '/') { return { name: 'landing', params: {} }; }

    var m = /^\/scholarship\/([^\/]+)\/?$/.exec(path);
    if (m) {
      var id;
      try { id = decodeURIComponent(m[1]); } catch (e) { id = m[1]; }
      return { name: 'scholarship', params: { id: id } };
    }

    var name = path.replace(/^\/+|\/+$/g, '');
    if (PAGE_ROUTES.indexOf(name) !== -1) { return { name: name, params: {} }; }
    return { name: 'landing', params: {} };
  }

  function navigate(hash) {
    var h = String(hash || '#/');
    if (h.charAt(0) !== '#') { h = '#' + (h.charAt(0) === '/' ? '' : '/') + h; }
    if (window.location.hash === h) {
      render();
    } else {
      window.location.hash = h;
    }
  }

  /* ---------- rendering ---------- */

  function loadingHTML() {
    return '<div class="loading-state"><div class="spinner"></div><p>' +
      escapeHTML(t('loadingState')) + '</p></div>';
  }

  function errorHTML(err) {
    var msg = err && err.message ? err.message : String(err);
    return '<div class="error-state"><p><strong>' + escapeHTML(t('errorState')) +
      '</strong></p><p>' + escapeHTML(msg) + '</p></div>';
  }

  function shellHTML(route) {
    var active = route.name === 'scholarship' ? 'discover' : route.name;

    var links = NAV.map(function (item) {
      var cls = 'nav-link' + (active === item[0] ? ' active' : '');
      return '<a class="' + cls + '" href="#/' + item[0] + '">' +
        escapeHTML(t(item[1])) + '</a>';
    }).join('');

    var langEn = 'lang-btn' + (MH.lang === 'en' ? ' active' : '');
    var langTe = 'lang-btn' + (MH.lang === 'te' ? ' active' : '');

    return '' +
      '<div class="app-shell">' +
        '<aside class="sidebar">' +
          '<div class="brand">' +
            '<div class="brand-mark">\u0C2E</div>' +
            '<div class="brand-name">Mana Hakku</div>' +
            '<div class="brand-te">\u0C2E\u0C28 \u0C39\u0C15\u0C4D\u0C15\u0C41</div>' +
          '</div>' +
          '<nav>' + links + '</nav>' +
          '<button class="nav-link" type="button" data-logout="true">Logout</button>' +
          '<div class="sidebar-footer">' + escapeHTML(t('sidebarFooter')) + '</div>' +
        '</aside>' +
        '<div class="main-column">' +
          '<header class="topbar">' +
            '<button class="menu-toggle" type="button" aria-label="Menu">&#9776;</button>' +
            '<div class="page-title">' + escapeHTML(t(ROUTE_LABELS[route.name] || 'navDashboard')) + '</div>' +
            '<div class="lang-switch">' +
              '<button class="' + langEn + '" type="button" data-lang="en">English</button>' +
              '<button class="' + langTe + '" type="button" data-lang="te">\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41</button>' +
            '</div>' +
          '</header>' +
          '<div class="main"></div>' +
        '</div>' +
      '</div>';
  }

  function setDocumentTitle(route) {
    if (route.name === 'landing') {
      document.title = 'Mana Hakku \u00B7 \u0C2E\u0C28 \u0C39\u0C15\u0C4D\u0C15\u0C41';
    } else {
      document.title = t(ROUTE_LABELS[route.name] || 'navDashboard') + ' \u00B7 Mana Hakku';
    }
  }

  function runPage(container, route) {
    try {
      var fn = window.MH_PAGES && window.MH_PAGES[route.name];
      if (typeof fn !== 'function') {
        throw new Error('Page not available: ' + route.name);
      }
      fn(container, route.params || {});
    } catch (err) {
      if (window.console) { console.error(err); }
      container.innerHTML = errorHTML(err);
    }
  }

  function render() {
    var app = document.getElementById('app');
    if (!app) { return; }

    var route = parseRoute();
    var publicRoutes = ['landing', 'login', 'register'];
var accessToken = sessionStorage.getItem('mh_access_token');

if (publicRoutes.indexOf(route.name) === -1 && !accessToken) {
  navigate('#/login');
  return;
}

if (route.name === 'admin' &&
    sessionStorage.getItem('mh_user_role') !== 'admin') {
  navigate('#/dashboard');
  return;
}
    var token = ++renderToken;
    var container;

    document.documentElement.lang = MH.lang;
    setDocumentTitle(route);

    if (route.name === 'landing') {
  app.innerHTML = '<div class="mh-landing"></div>';
  container = app.querySelector('.mh-landing');
} else if (route.name === 'login' || route.name === 'register') {
  app.innerHTML = '<div class="mh-auth"></div>';
  container = app.querySelector('.mh-auth');
} else {
  app.innerHTML = shellHTML(route);
  container = app.querySelector('.main');
}

    container.innerHTML = loadingHTML();

    window.setTimeout(function () {
      if (token !== renderToken) { return; } // a newer render superseded this one
      runPage(container, route);
    }, LOADING_DELAY_MS);
  }

  /* ---------- global event handling (delegation) ---------- */

  function onClick(event) {
    var target = event.target;
    if (!target || !target.closest) { return; }
    var logoutBtn = target.closest('[data-logout]');
if (logoutBtn) {
  window.MH_API.logout();
  navigate('#/login');
  return;
}

    var langBtn = target.closest('[data-lang]');
    if (langBtn) {
      setLang(langBtn.getAttribute('data-lang'));
      return;
    }

    if (target.closest('.menu-toggle')) {
      var sidebarToggle = document.querySelector('.sidebar');
      if (sidebarToggle) { sidebarToggle.classList.toggle('open'); }
      return;
    }

    // Click outside the mobile drawer closes it.
    var openSidebar = document.querySelector('.sidebar.open');
    if (openSidebar && !target.closest('.sidebar')) {
      openSidebar.classList.remove('open');
    }
  }

  /* ---------- public API ---------- */

  var MH = {
    lang: readLang(),
    t: t,
    setLang: setLang,
    store: store,
    updateApplicationStatus: updateApplicationStatus,
    navigate: navigate,
    parseRoute: parseRoute,
    render: render,
    escape: escapeHTML,
    formatMoney: formatMoney
  };

  window.MH = MH;

  function init() {
    document.documentElement.lang = MH.lang;
    render();
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('click', onClick);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
