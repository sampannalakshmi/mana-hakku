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
  var token = sessionStorage.getItem('mh_access_token');
  var msg = body.querySelector('#mh-apply-msg');

  if (!token) {
    msg.textContent = 'Please log in to apply.';
    return;
  }

  btn.disabled = true;
  msg.textContent = 'Submitting your application...';

  window.MH_API.createApplication(r.item.id, token)
    .then(function () {
      msg.innerHTML =
        'Application submitted successfully! - ' +
        '<a href="#/tracker">View Tracker</a>';
    })
    .catch(function (err) {
      msg.textContent = err.message ||
        'Unable to submit application. Please try again.';
    })
    .then(function () {
      btn.disabled = false;
    });
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
  var token = sessionStorage.getItem('mh_access_token');

  var head = '<div class="page-header"><div><h1>' +
    esc(T('trackerTitle', 'Tracker')) +
    '</h1></div></div>';

  if (!token) {
    el.innerHTML = head +
      '<div class="empty-state">Please log in to view your applications.</div>';
    return;
  }

  el.innerHTML = head +
    '<div class="loading">Loading your applications...</div>';

  window.MH_API.getMyApplications(token)
    .then(function (apps) {
      apps = Array.isArray(apps) ? apps : [];

      if (!apps.length) {
        el.innerHTML = head +
          '<div class="empty-state">No applications found. Apply for a scholarship to get started.</div>';
        return;
      }

      var rows = apps.map(function (a) {
        var status = String(a.status || 'draft');
        var displayStatus = status.charAt(0).toUpperCase() +
          status.slice(1).toLowerCase();
        var updated = a.submitted_at || a.created_at || '';
        var scholarshipName = 'Scholarship #' + a.scholarship_id;

        return '<tr>' +
          '<td>' + esc(scholarshipName) + '</td>' +
          '<td><span class="badge-status ' +
          (STATUS_CLASS[displayStatus] || '') + '">' +
          esc(displayStatus) + '</span></td>' +
          '<td>' + esc(updated ? new Date(updated).toLocaleDateString() : '') +
          '</td></tr>';
      }).join('');

      el.innerHTML = head +
        '<div class="table-wrap"><table class="table">' +
        '<thead><tr><th>Scholarship</th><th>' +
        esc(T('statusLabel', 'Status')) +
        '</th><th>Created / Submitted</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>';
    })
    .catch(function (err) {
      el.innerHTML = head +
        '<div class="empty-state">Could not load applications. Please refresh and try again.</div>';
    });
}

  /* 4. Admin */
function admin(el) {
  el.innerHTML =
    '<div class="page-header"><div><h1>Admin Dashboard</h1></div></div>' +

    '<div class="card">' +
      '<div class="card-title">Add New Scholarship</div>' +
      '<div class="card-body">' +
        '<form id="mh-add-scholarship">' +

          '<div class="field">' +
            '<label for="mh-sch-name">Scholarship Name *</label>' +
            '<input class="input" id="mh-sch-name" required maxlength="200">' +
          '</div>' +

          '<div class="field">' +
            '<label for="mh-sch-provider">Provider</label>' +
            '<input class="input" id="mh-sch-provider" maxlength="200">' +
          '</div>' +

          '<div class="field">' +
            '<label for="mh-sch-description">Description</label>' +
            '<textarea class="input" id="mh-sch-description"></textarea>' +
          '</div>' +

          '<div class="field">' +
            '<label for="mh-sch-eligibility">Eligibility</label>' +
            '<textarea class="input" id="mh-sch-eligibility"></textarea>' +
          '</div>' +

          '<div class="field">' +
            '<label for="mh-sch-deadline">Deadline</label>' +
            '<input class="input" id="mh-sch-deadline" type="date">' +
          '</div>' +

          '<div class="field">' +
            '<label for="mh-sch-url">Official URL</label>' +
            '<input class="input" id="mh-sch-url" type="url">' +
          '</div>' +

          '<div class="field">' +
            '<label><input id="mh-sch-verified" type="checkbox"> Verified</label>' +
          '</div>' +

          '<button class="btn btn-primary" type="submit">Add Scholarship</button>' +
          '<p id="mh-sch-message" role="status"></p>' +

        '</form>' +
      '</div>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">Scholarship Management</div>' +
      '<div class="card-body" id="mh-admin-scholarships">Loading scholarships...</div>' +
    '</div>';

  var body = el.querySelector('#mh-admin-scholarships');
  var form = el.querySelector('#mh-add-scholarship');
  var message = el.querySelector('#mh-sch-message');

  function loadScholarships() {
    body.textContent = 'Loading scholarships...';

    window.MH_API.listScholarshipsStatus().then(function (result) {
      if (!el.isConnected) return;

      if (result.source === 'demo') {
        body.innerHTML = '<p>Backend unavailable. Showing demo records only.</p>';
        return;
      }

      if (result.items.length === 0) {
        body.innerHTML = '<p>No scholarships found.</p>';
        return;
      }

      body.innerHTML =
        '<p>Total scholarships: <strong>' + result.items.length + '</strong></p>' +
        '<div class="table-wrap"><table class="table">' +
        '<thead><tr><th>ID</th><th>Name</th><th>Provider</th><th>Deadline</th><th>Verified</th></tr></thead>' +
        '<tbody>' +
        result.items.map(function (s) {
          return '<tr>' +
            '<td>' + esc(s.id) + '</td>' +
            '<td>' + esc(s.name) + '</td>' +
            '<td>' + esc(s.provider || 'Not provided') + '</td>' +
            '<td>' + esc(s.deadline || 'Not provided') + '</td>' +
            '<td>' + (s.verified ? 'Yes' : 'No') + '</td>' +
            '</tr>';
        }).join('') +
        '</tbody></table></div>';
    }).catch(function () {
      body.textContent = 'Unable to load scholarships.';
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = 'Saving scholarship...';

    var data = {
      name: form.querySelector('#mh-sch-name').value.trim(),
      provider: form.querySelector('#mh-sch-provider').value.trim(),
      description: form.querySelector('#mh-sch-description').value.trim(),
      eligibility: form.querySelector('#mh-sch-eligibility').value.trim(),
      deadline: form.querySelector('#mh-sch-deadline').value || null,
      official_url: form.querySelector('#mh-sch-url').value.trim(),
      is_verified: form.querySelector('#mh-sch-verified').checked
    };

    var token = sessionStorage.getItem('mh_access_token');

    window.MH_API.createScholarship(data, token)
      .then(function () {
        form.reset();
        message.textContent = 'Scholarship added successfully!';
        loadScholarships();
      })
      .catch(function (error) {
        message.textContent = error.message || 'Unable to add scholarship.';
      })
      .then(function () {
        button.disabled = false;
      });
  });

  loadScholarships();
}

  window.MH_PAGES.discover = discover;
  window.MH_PAGES.scholarship = scholarship;
  window.MH_PAGES.tracker = tracker;
  window.MH_PAGES.admin = admin;
})();
