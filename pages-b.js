window.MH_PAGES = window.MH_PAGES || {};
(function () {
  var STATUS_CLASS = {
    'Not started': 's-not-started', 'Draft': 's-draft', 'Submitted': 's-submitted',
    'Under review': 's-review', 'Approved': 's-approved', 'Rejected': 's-rejected'
  };
  function T(key, fallback) { var v = window.MH.t(key); return (v && v !== key) ? v : (fallback || key); }
  function esc(s) { return window.MH.escape(String(s == null ? '' : s)); }
  function isTe() { return window.MH.lang === 'te'; }
  function scholarships() { return (window.MH_DATA && window.MH_DATA.scholarships) || []; }
  function findScholarship(id) { return scholarships().filter(function (s) { return s.id === id; })[0]; }
  function nameOf(s) { return (isTe() && s.nameTe) ? s.nameTe : s.name; }
  function descOf(s) { return (isTe() && s.descriptionTe) ? s.descriptionTe : s.description; }
  function listOf(s, key) { var arr = (isTe() && s[key + 'Te']) ? s[key + 'Te'] : s[key]; return arr || []; }
  function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }); }
  function today() { return new Date().toISOString().slice(0, 10); }
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return esc(iso);
    return esc(d.toLocaleDateString(isTe() ? 'te-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  }
  function statusOptions(current) {
    return (window.MH_DATA.statuses || []).map(function (st) {
      return '<option value="' + esc(st) + '"' + (st === current ? ' selected' : '') + '>' + esc(st) + '</option>';
    }).join('');
  }

  /* 1. Discover */
  function cardsHtml(items) {
    if (!items.length) return '<div class="empty-state">' + esc(T('emptyState', 'No results')) + '</div>';
    return items.map(function (s) {
      return '<article class="scholarship-card">' +
        '<span class="badge badge-sample">' + esc(T('sampleBadge', 'SAMPLE')) + '</span>' +
        '<h3>' + esc(nameOf(s)) + '</h3>' +
        '<p class="muted">' + esc(s.provider) + '</p>' +
        (s.amountLabel ? '<p><strong>' + esc(s.amountLabel) + '</strong></p>' : '') +
        '<p>' + esc(T('deadline', 'Deadline')) + ': ' + fmtDate(s.deadline) + '</p>' +
        (s.category || s.level ? '<div>' + (s.category ? '<span class="tag">' + esc(s.category) + '</span> ' : '') + (s.level ? '<span class="tag">' + esc(s.level) + '</span>' : '') + '</div>' : '') +
        '<p class="muted small">' + esc(T('verifiedNo', 'Not verified')) + '</p>' +
        '<a class="btn btn-ghost btn-small" href="#/scholarship/' + encodeURIComponent(s.id) + '">' + esc(T('detailsTitle', 'Details')) + '</a>' +
        '</article>';
    }).join('');
  }
  function loadingHtml() { return '<div class="loading-state"><span class="spinner"></span> ' + esc(T('loadingState', 'Loading...')) + '</div>'; }
  function errorHtml() { return '<div class="error-state">' + esc(T('errorState', 'Could not load scholarships.')) + ' <button class="btn btn-ghost btn-small" type="button" data-action="retry">' + esc(T('retry', 'Retry')) + '</button></div>'; }
  function notFoundHtml() { return '<div class="error-state">' + esc(T('notFound', 'Scholarship not found')) + ' <a class="btn btn-ghost btn-small" href="#/discover">' + esc(T('backToList', 'Back')) + '</a></div>'; }
  function demoBannerHtml() {
    return '<div class="notice" role="status">' + esc(T('demoModeBody', 'Demo mode: live scholarship data is unavailable. The records shown are unverified samples. Do not rely on them.')) + '</div>';
  }
  function optionsFor(values, allLabel) { return '<option value="">' + esc(allLabel) + '</option>' + values.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join(''); }

  function discover(el) {
    var filterAll = T('filterAll', 'All');
    el.innerHTML =
      '<div class="page-header"><div><h1>' + esc(T('discoverTitle', 'Discover')) + '</h1></div></div>' +
      '<div id="mh-banner"></div>' +
      '<div class="filters">' +
        '<input class="input" type="search" id="mh-search" placeholder="' + esc(T('searchPlaceholder', 'Search')) + '">' +
        '<select class="select" id="mh-cat">' + optionsFor([], filterAll) + '</select>' +
        '<select class="select" id="mh-level">' + optionsFor([], filterAll) + '</select>' +
      '</div>' +
      '<div id="mh-results" class="scholarship-grid"></div>';
    var results = el.querySelector('#mh-results');
    results.innerHTML = loadingHtml();
    var all = [];
    function update() {
      var q = (el.querySelector('#mh-search').value || '').trim().toLowerCase();
      var cat = el.querySelector('#mh-cat').value;
      var lvl = el.querySelector('#mh-level').value;
      var items = all.filter(function (s) {
        var hay = (s.name + ' ' + (s.nameTe || '') + ' ' + s.provider).toLowerCase();
        return (!q || hay.indexOf(q) !== -1) && (!cat || s.category === cat) && (!lvl || s.level === lvl);
      });
      results.innerHTML = cardsHtml(items);
    }
    el.querySelector('#mh-search').addEventListener('input', update);
    el.querySelector('#mh-cat').addEventListener('change', update);
    el.querySelector('#mh-level').addEventListener('change', update);
    window.MH_API.listScholarshipsStatus().then(function (r) {
      all = r.items;
      if (r.source === 'demo') { el.querySelector('#mh-banner').innerHTML = demoBannerHtml(); }
      el.querySelector('#mh-cat').innerHTML = optionsFor(uniq(all.map(function (s) { return s.category; })), filterAll);
      el.querySelector('#mh-level').innerHTML = optionsFor(uniq(all.map(function (s) { return s.level; })), filterAll);
      update();
    }).catch(function () {
      results.innerHTML = errorHtml();
      var rb = results.querySelector('[data-action="retry"]');
      if (rb) rb.addEventListener('click', function () { discover(el); });
    });
  }

  /* 2. Scholarship details */
  function detailHtml(s) {
    var rows = '';
    if (s.amountLabel) rows += '<dt>' + esc(T('amount', 'Amount')) + '</dt><dd>' + esc(s.amountLabel) + '</dd>';
    if (s.deadline) rows += '<dt>' + esc(T('deadline', 'Deadline')) + '</dt><dd>' + fmtDate(s.deadline) + '</dd>';
    if (s.provider) rows += '<dt>Provider</dt><dd>' + esc(s.provider) + '</dd>';
    if (s.level) rows += '<dt>Level</dt><dd>' + esc(s.level) + '</dd>';
    if (s.category) rows += '<dt>Category</dt><dd>' + esc(s.category) + '</dd>';
    var desc = descOf(s);
    var html =
      '<div class="page-header"><div><h1>' + esc(nameOf(s)) + ' <span class="badge badge-sample">' + esc(T('sampleBadge', 'SAMPLE')) + '</span></h1></div></div>' +
      '<div class="notice">' + esc(T('demoNotice', window.MH_DATA.notice)) + '<br>' + esc(T('verifiedNo', 'Not verified')) + ' - ' + esc(s.source) + '</div>' +
      '<div class="card"><div class="card-body"><dl>' + rows + '</dl>' +
        (desc ? '<p>' + esc(desc) + '</p>' : '') +
        (s.officialUrl ? '<p><a href="' + esc(s.officialUrl) + '" target="_blank" rel="noopener">Official source</a></p>' : '') +
      '</div></div>';
    if (s.eligibility && s.eligibility.length) {
      html += '<div class="card"><div class="card-title">' + esc(T('eligibility', 'Eligibility')) + '</div><div class="card-body"><ul>' +
        s.eligibility.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';
    }
    if (s.documents && s.documents.length) {
      html += '<div class="card"><div class="card-title">' + esc(T('documents', 'Documents')) + '</div><div class="card-body"><ul>' +
        s.documents.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';
    }
    html += '<div class="actions">' +
        '<button class="btn btn-primary" type="button" data-action="apply">' + esc(T('applyNow', 'Apply')) + '</button> ' +
        '<a class="btn btn-ghost" href="#/discover">' + esc(T('backToList', 'Back')) + '</a>' +
        '<p id="mh-apply-msg" class="notice-inline"></p>' +
      '</div>';
    return html;
  }

  function scholarship(el, params) {
    var id = String((params && params.id) || '');
    el.innerHTML =
      '<div class="page-header"><div><h1>' + esc(T('detailsTitle', 'Details')) + '</h1></div></div>' +
      '<div id="mh-detail-body"></div>';
    var body = el.querySelector('#mh-detail-body');
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) { body.innerHTML = notFoundHtml(); return; }
    body.innerHTML = loadingHtml();
    window.MH_API.getScholarshipStatus(id).then(function (r) {
      body.innerHTML = (r.source === 'demo' ? demoBannerHtml() : '') + detailHtml(r.item);
      var btn = body.querySelector('[data-action="apply"]');
      if (btn) btn.addEventListener('click', function () {
        window.MH.store.set(function (st) {
          if (!st.applications.some(function (a) { return a.scholarshipId === r.item.id; })) {
            st.applications.push({ id: 'app-' + r.item.id + '-' + Date.now(), scholarshipId: r.item.id, status: 'Draft',
              updatedOn: today(), notes: 'Created from backend record' });
          }
          return st;
        });
        body.querySelector('#mh-apply-msg').innerHTML = esc(T('applyNow', 'Apply')) + ' OK - <a href="#/tracker">' + esc(T('navTracker', 'Tracker')) + '</a>';
      });
    }).catch(function (err) {
      if (err && err.status === 404) {
        body.innerHTML = notFoundHtml();
      } else {
        body.innerHTML = errorHtml();
        var rb = body.querySelector('[data-action="retry"]');
        if (rb) rb.addEventListener('click', function () { scholarship(el, params); });
      }
    });
  }


  /* 3. Tracker */
  function tracker(el, params) {
    var apps = window.MH.store.get().applications || [];
    var head = '<div class="page-header"><div><h1>' + esc(T('trackerTitle', 'Tracker')) + '</h1></div>' +
      '<div class="actions"><button class="btn btn-ghost btn-small" type="button" data-action="reset">' + esc(T('resetDemo', 'Reset demo')) + '</button></div></div>' +
      '<div class="notice">' + esc(T('demoNotice', window.MH_DATA.notice)) + '</div>';
    if (!apps.length) {
      el.innerHTML = head + '<div class="empty-state">' + esc(T('emptyState', 'Nothing here yet')) + '</div>';
    } else {
      var rows = apps.map(function (a) {
        var sc = findScholarship(a.scholarshipId);
        var nm = sc ? nameOf(sc) : a.scholarshipId;
        return '<tr><td>' + esc(nm) + '</td>' +
          '<td><span class="badge-status ' + (STATUS_CLASS[a.status] || '') + '">' + esc(a.status) + '</span></td>' +
          '<td>' + esc(a.updatedOn || '') + '</td>' +
          '<td><select class="select" data-app-select="' + esc(a.id) + '">' + statusOptions(a.status) + '</select> ' +
          '<button class="btn btn-small btn-primary" type="button" data-action="mark" data-app-id="' + esc(a.id) + '">' + esc(T('markStatus', 'Mark')) + '</button></td></tr>';
      }).join('');
      var timeline = apps.slice().sort(function (x, y) { return (y.updatedOn || '').localeCompare(x.updatedOn || ''); })
        .map(function (a) {
          var sc = findScholarship(a.scholarshipId);
          return '<div class="timeline-item"><strong>' + esc(sc ? nameOf(sc) : a.scholarshipId) + '</strong><div>' +
            esc(a.status) + ' - ' + esc(a.updatedOn || '') + '</div></div>';
        }).join('');
      el.innerHTML = head +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Scholarship</th><th>' + esc(T('statusLabel', 'Status')) +
        '</th><th>Updated</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<h2>Timeline</h2><div class="timeline">' + timeline + '</div>';
    }
    el.onclick = function (ev) {
      var btn = ev.target.closest && ev.target.closest('button[data-action]');
      if (!btn) return;
      if (btn.getAttribute('data-action') === 'mark') {
        var id = btn.getAttribute('data-app-id');
        var sel = el.querySelector('select[data-app-select="' + id + '"]');
        window.MH.store.updateApplicationStatus(id, sel.value);
        tracker(el, params);
      } else if (btn.getAttribute('data-action') === 'reset') {
        window.MH.store.reset();
        tracker(el, params);
      }
    };
  }

  /* 4. Admin */
  function admin(el) {
    var list = scholarships();
    var apps = window.MH.store.get().applications || [];
    var now = today();
    var expired = list.filter(function (s) { return s.deadline && s.deadline < now; }).length;
    var statusCounts = (window.MH_DATA.statuses || []).map(function (st) {
      return '<li>' + esc(st) + ': ' + apps.filter(function (a) { return a.status === st; }).length + '</li>';
    }).join('');
    var stat = function (value, label) {
      return '<div class="stat-card"><span class="badge badge-sample">' + esc(T('sampleBadge', 'SAMPLE')) + '</span>' +
        '<div class="stat-value">' + value + '</div><div class="stat-label">' + esc(label) + '</div></div>';
    };
    el.innerHTML =
      '<div class="page-header"><div><h1>' + esc(T('adminTitle', 'Admin')) + '</h1></div></div>' +
      '<div class="notice">' + esc(T('demoNotice', window.MH_DATA.notice)) + '</div>' +
      '<div class="admin-grid">' +
        stat(list.length, 'Total scholarships (demo)') +
        stat(apps.length, 'Total applications (demo)') +
        stat(expired, 'Expired deadlines (demo)') +
      '</div>' +
      '<div class="card"><div class="card-title">Status breakdown (demo)</div><div class="card-body"><ul>' + statusCounts + '</ul></div></div>' +
      '<div class="card"><div class="card-title">Scholarship records (demo)</div><div class="card-body"><div class="table-wrap"><table class="table">' +
        '<thead><tr><th>Name</th><th>Category</th><th>Level</th><th>Deadline</th><th>Verified</th><th>Source</th></tr></thead><tbody>' +
        list.map(function (s) {
          return '<tr><td>' + esc(s.name) + '</td><td>' + esc(s.category) + '</td><td>' + esc(s.level) + '</td><td>' +
            fmtDate(s.deadline) + '</td><td>No - not verified</td><td>' + esc(s.source) + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>' +
      '<p class="muted">Records must be checked against official notifications before publishing. This view shows no personal student data.</p>';
  }

  window.MH_PAGES.discover = discover;
  window.MH_PAGES.scholarship = scholarship;
  window.MH_PAGES.tracker = tracker;
  window.MH_PAGES.admin = admin;
})();
