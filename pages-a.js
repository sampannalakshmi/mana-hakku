/* Mana Hakku - page renderers part A: landing, dashboard, profile, assistant.
 * Plain browser JavaScript (ES2018). Depends on window.MH (app.js),
 * window.MH_DATA and window.MH_I18N (data.js). Each page function takes
 * (el, params) and renders HTML into el.innerHTML.
 */
(function () {
  'use strict';

  window.MH_PAGES = window.MH_PAGES || {};

  /* ---------- helpers ---------- */

  // Translate a key, falling back to the given text when the key is not defined.
  function tr(key, fallback) {
    var v = window.MH.t(key);
    return (v && v !== key) ? v : fallback;
  }

  // Pick a bilingual field: item.nameTe when Telugu is active, else item.name.
  function loc(obj, base) {
    if (!obj) return '';
    var te = window.MH.lang === 'te' ? obj[base + 'Te'] : null;
    return te || obj[base] || '';
  }

  // Choose a local bilingual string.
  function lt(en, te) {
    return window.MH.lang === 'te' ? te : en;
  }

  function scholarships() {
    return (window.MH_DATA && Array.isArray(window.MH_DATA.scholarships))
      ? window.MH_DATA.scholarships
      : [];
  }

  function scholarshipById(id) {
    var list = scholarships();
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].id) === String(id)) return list[i];
    }
    return null;
  }

  function state() {
    return window.MH.store.get() || {};
  }

  function applications(s) {
    return Array.isArray(s.applications) ? s.applications : [];
  }

  var STATUS_CLASS = {
    'Not started': 's-not-started',
    'Draft': 's-draft',
    'Submitted': 's-submitted',
    'Under review': 's-review',
    'Approved': 's-approved',
    'Rejected': 's-rejected'
  };

  function statusClass(status) {
    return STATUS_CLASS[status] || 's-not-started';
  }

  function clampPercent(v) {
    if (typeof v === 'boolean') return v ? 100 : 0;
    var n = Number(v);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function escapeText(v) {
    return window.MH.escape(String(v == null ? '' : v));
  }

  /* ---------- 1. landing ---------- */

  var FEATURES = {
    en: [
      { title: 'Telugu-first guidance', text: 'Scholarship details and application steps explained in plain Telugu.' },
      { title: 'AI eligibility help', text: 'Quick answers to your questions. Always verify rules against the official notification.' },
      { title: 'Deadline and document tracker', text: 'See deadlines and required documents for each application in one place.' }
    ],
    te: [
      { title: 'తెలుగు-ముందు మార్గదర్శనం', text: 'స్కాలర్‌షిప్ వివరాలు మరియు దరఖాస్తు దశలు సులభమైన తెలుగులో.' },
      { title: 'AI అర్హత సహాయం', text: 'మీ ప్రశ్నలకు త్వరిత సమాధానాలు. నిబంధనలను అధికారిక నోటిఫికేషన్‌తో ఎల్లప్పుడూ ధృవీకరించండి.' },
      { title: 'గడువు & పత్రాల ట్రాకర్', text: 'ప్రతి దరఖాస్తుకు గడువులు మరియు అవసరమైన పత్రాలను ఒకే చోట చూడండి.' }
    ]
  };

  var STEPS = {
    en: [
      { title: 'Create profile', text: 'Add your basic details. No identity numbers are needed.' },
      { title: 'Discover schemes', text: 'Browse scholarships that may suit your course and district.' },
      { title: 'Track applications', text: 'Keep track of status, deadlines and documents.' }
    ],
    te: [
      { title: 'ప్రొఫైల్ సృష్టించండి', text: 'మీ ప్రాథమిక వివరాలు జోడించండి. ఎలాంటి గుర్తింపు నంబర్లు అవసరం లేదు.' },
      { title: 'పథకాలను కనుగొనండి', text: 'మీ కోర్సు మరియు జిల్లాకు సరిపోయే స్కాలర్‌షిప్‌లను చూడండి.' },
      { title: 'దరఖాస్తులను ట్రాక్ చేయండి', text: 'స్థితి, గడువులు మరియు పత్రాలను గమనించండి.' }
    ]
  };

  function landing(el) {
    var MH = window.MH;
    var lang = MH.lang === 'te' ? 'te' : 'en';
    var features = FEATURES[lang];
    var steps = STEPS[lang];
    var disclaimer = lt(
      'This is a prototype with demo data. It is not an official government service.',
      'ఇది డెమో డేటాతో కూడిన ప్రోటోటైప్. ఇది అధికారిక ప్రభుత్వ సేవ కాదు.'
    );

    var featureHtml = features.map(function (f) {
      return '<div class="feature-card">' +
        '<h3>' + escapeText(f.title) + '</h3>' +
        '<p>' + escapeText(f.text) + '</p>' +
        '</div>';
    }).join('');

    var stepHtml = steps.map(function (s, i) {
      return '<div class="step">' +
        '<span class="step-num">' + (i + 1) + '</span>' +
        '<h3>' + escapeText(s.title) + '</h3>' +
        '<p>' + escapeText(s.text) + '</p>' +
        '</div>';
    }).join('');

    el.innerHTML =
      '<div class="landing">' +
        '<header class="landing-nav">' +
          '<div class="brand">' +
            '<span class="brand-mark">మ</span>' +
            '<div>' +
              '<div class="brand-name">Mana Hakku</div>' +
              '<div class="brand-te">మన హక్కు</div>' +
            '</div>' +
          '</div>' +
          '<div class="lang-switch">' +
            '<button type="button" class="lang-btn' + (lang === 'en' ? ' active' : '') + '" data-lang="en">English</button>' +
            '<button type="button" class="lang-btn' + (lang === 'te' ? ' active' : '') + '" data-lang="te">తెలుగు</button>' +
          '</div>' +
        '</header>' +

        '<section class="hero">' +
          '<h1>' + escapeText(MH.t('heroTitle')) + '</h1>' +
          '<p class="hero-tagline">Know Your Rights. Claim Your Benefits.</p>' +
          '<p class="hero-sub">' + escapeText(MH.t('heroSub')) + '</p>' +
          '<div class="hero-actions">' +
            '<a class="btn btn-primary" href="#/dashboard">' + escapeText(MH.t('heroCta')) + '</a>' +
            '<a class="btn btn-ghost" href="#/discover">' + escapeText(MH.t('heroCtaSecondary')) + '</a>' +
          '</div>' +
        '</section>' +

        '<div class="notice">' + escapeText(MH.t('demoNotice')) + '</div>' +

        '<section class="feature-grid">' + featureHtml + '</section>' +

        '<section class="steps">' + stepHtml + '</section>' +

        '<footer class="site-footer">' +
          '<p>' + escapeText(disclaimer) + '</p>' +
        '</footer>' +
      '</div>';

    var buttons = el.querySelectorAll('.lang-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (e) {
        var code = e.currentTarget.getAttribute('data-lang');
        window.MH.setLang(code === 'te' ? 'te' : 'en');
      });
    }
  }

  /* ---------- 2. dashboard ---------- */

  function dashboard(el) {
    var MH = window.MH;
    var s = state();
    var apps = applications(s);
    var now = Date.now();

    var upcoming = scholarships().filter(function (sc) {
      var t = sc.deadline ? new Date(sc.deadline).getTime() : NaN;
      return isFinite(t) && t > now;
    }).length;

    var profile = s.profile || {};
    var completion = clampPercent(profile.profileComplete);

    var rows = apps.map(function (a) {
      var sc = scholarshipById(a.scholarshipId || a.id);
      var name = sc ? loc(sc, 'name') : (a.scholarshipName || '');
      var status = String(a.status || 'Not started');
      return '<div class="app-row">' +
        '<div class="app-name">' + escapeText(name) + '</div>' +
        '<span class="badge-status ' + statusClass(status) + '">' + escapeText(status) + '</span>' +
        '<a class="link" href="#/tracker">' + escapeText(MH.t('navTracker') === 'navTracker' ? 'Tracker' : MH.t('navTracker')) + '</a>' +
        '</div>';
    }).join('');

    var listHtml = apps.length
      ? '<div class="app-list">' + rows + '</div>'
      : '<div class="empty-state">' + escapeText(MH.t('emptyState')) + '</div>';

    el.innerHTML =
      '<div class="page-header"><h1>' + escapeText(MH.t('dashboardTitle')) + '</h1></div>' +
      '<div class="notice">' + escapeText(MH.t('demoNotice')) + '</div>' +
      '<div class="stat-grid">' +
        '<div class="stat-card">' +
          '<span class="badge-sample">' + escapeText(MH.t('sampleBadge')) + '</span>' +
          '<div class="stat-label">' + escapeText(tr('totalTracked', 'Applications tracked')) + '</div>' +
          '<div class="stat-value">' + apps.length + '</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<span class="badge-sample">' + escapeText(MH.t('sampleBadge')) + '</span>' +
          '<div class="stat-label">' + escapeText(tr('upcoming', 'Upcoming deadlines')) + '</div>' +
          '<div class="stat-value">' + upcoming + '</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<span class="badge-sample">' + escapeText(MH.t('sampleBadge')) + '</span>' +
          '<div class="stat-label">' + escapeText(MH.t('profileCompletion')) + '</div>' +
          '<div class="stat-value">' + completion + '%</div>' +
          '<div class="progress"><div class="progress-fill" style="width:' + completion + '%"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<h2>' + escapeText(tr('applications', 'Applications')) + '</h2>' +
        listHtml +
      '</div>';
  }

  /* ---------- 3. profile ---------- */

  var PROFILE_FIELDS = [
    { key: 'name', type: 'text', label: 'name', fb: 'Full name' },
    { key: 'district', type: 'text', label: 'district', fb: 'District' },
    { key: 'category', type: 'text', label: 'category', fb: 'Category (e.g. OC, BC, SC, ST, EWS)' },
    { key: 'annualFamilyIncome', type: 'number', label: 'annualFamilyIncome', fb: 'Annual family income (INR)' },
    { key: 'course', type: 'text', label: 'course', fb: 'Course' },
    { key: 'year', type: 'number', label: 'year', fb: 'Year of study' },
    { key: 'documentsReady', type: 'text', label: 'documentsReady', fb: 'Documents ready (comma-separated)' }
  ];

  function profile(el) {
    var MH = window.MH;
    var saved = state().profile || {};

    var fieldsHtml = PROFILE_FIELDS.map(function (f) {
      var value = saved[f.key];
      if (f.key === 'documentsReady' && Array.isArray(value)) value = value.join(', ');
      if (value == null) value = '';
      return '<div class="field">' +
        '<label for="pf-' + f.key + '">' + escapeText(tr(f.label, f.fb)) + '</label>' +
        '<input class="input" id="pf-' + f.key + '" name="' + f.key + '" type="' + f.type + '" value="' + escapeText(value) + '">' +
        '</div>';
    }).join('');

    el.innerHTML =
      '<div class="page-header">' +
        '<h1>' + escapeText(MH.t('navProfile')) + '</h1>' +
        '<p>' + escapeText(MH.t('profileCompletion')) + '</p>' +
      '</div>' +
      '<div class="notice">' + escapeText(MH.t('demoNotice')) + '</div>' +
      '<p class="helper-note">' + escapeText(lt(
        'No identity numbers are collected in this prototype.',
        'ఈ ప్రోటోటైప్‌లో ఎలాంటి గుర్తింపు నంబర్లు సేకరించబడవు.'
      )) + '</p>' +
      '<form class="card" id="profile-form">' +
        '<div class="form-grid">' + fieldsHtml + '</div>' +
        '<div class="form-actions">' +
          '<button type="submit" class="btn btn-primary">' + escapeText(tr('saveProfile', 'Save')) + '</button>' +
        '</div>' +
        '<div class="notice profile-status" id="profile-status" role="status"></div>' +
      '</form>';

    var form = el.querySelector('#profile-form');
    var status = el.querySelector('#profile-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var values = {};
      PROFILE_FIELDS.forEach(function (f) {
        var input = form.querySelector('[name="' + f.key + '"]');
        values[f.key] = input ? input.value.trim() : '';
      });

      var filled = 0;
      PROFILE_FIELDS.forEach(function (f) {
        if (values[f.key] !== '') filled++;
      });

      var newProfile = {
        name: values.name,
        district: values.district,
        category: values.category,
        annualFamilyIncome: Number(values.annualFamilyIncome) || 0,
        course: values.course,
        year: Number(values.year) || 0,
        documentsReady: values.documentsReady
          ? values.documentsReady.split(',').map(function (d) { return d.trim(); }).filter(function (d) { return d !== ''; })
          : [],
        profileComplete: Math.round((filled / PROFILE_FIELDS.length) * 100)
      };

      window.MH.store.set(function (s) {
        s.profile = newProfile;
        return s;
      });

      status.textContent = tr('profileSaved', 'Profile saved.');
    });
  }

  /* ---------- 4. assistant ---------- */

  var DEMO_DOCS_FALLBACK = 'No demo document list is available yet.';

  function demoDocuments() {
    var names = [];
    scholarships().forEach(function (sc) {
      if (Array.isArray(sc.documents)) {
        sc.documents.forEach(function (d) {
          var text = String(d);
          if (names.indexOf(text) === -1) names.push(text);
        });
      }
    });
    return names.length ? names.join(', ') : DEMO_DOCS_FALLBACK;
  }

  function incomeSummary() {
    var parts = [];
    scholarships().forEach(function (sc) {
      if (sc.incomeLimit != null) {
        parts.push(loc(sc, 'name') + ': ' + window.MH.formatMoney(sc.incomeLimit));
      }
    });
    return parts.length
      ? 'Demo income limits: ' + parts.join('; ') + '. Confirm against the official notification.'
      : 'Demo answer: income limits are not listed in the demo data. Verify them on the official portal.';
  }

  // Rule-based responder. No network, no API key. Replies are canned demo text.
  function respond(message) {
    var m = String(message || '').toLowerCase();

    if (/deadline|due date|last date|closing|gadu|గడువు/.test(m)) {
      return 'Demo answer: check the Deadline column on the Discover page; deadlines shown are placeholders. Confirm dates on the official portal.';
    }
    if (/eligib|qualif|అర్హ/.test(m)) {
      return 'Demo answer: eligibility rules must be verified against the official notification. This prototype does not determine eligibility.';
    }
    if (/document|certificate|proof|పత్ర/.test(m)) {
      return 'Demo documents commonly listed: ' + demoDocuments() + '. Confirm the exact list on the official notification.';
    }
    if (/income|salary|ఆదాయ/.test(m)) {
      return incomeSummary();
    }
    if (/status|track|submitted|approved|rejected/.test(m)) {
      return 'Demo answer: statuses on the Tracker are sample data. Update them yourself as you apply, and check the official portal for the real status.';
    }
    return 'This prototype cannot answer that yet. Try asking about deadlines, documents, eligibility, income or application status.';
  }

  function renderLog(root) {
    var MH = window.MH;
    var log = root.querySelector('.chat-log');
    if (!log) return;
    var messages = Array.isArray(state().assistantLog) ? state().assistantLog : [];

    var html =
      '<div class="chat-msg msg-bot">' +
        escapeText(tr('assistantIntro', 'Hello! Ask me about deadlines, documents or eligibility. I give demo answers only.')) +
      '</div>';

    messages.forEach(function (msg) {
      var cls = msg.role === 'user' ? 'msg-user' : 'msg-bot';
      html += '<div class="chat-msg ' + cls + '">' + escapeText(msg.text) + '</div>';
    });

    log.innerHTML = html;
    log.scrollTop = log.scrollHeight;
  }

  function assistant(el) {
    var MH = window.MH;

    el.innerHTML =
      '<div class="page-header"><h1>' + escapeText(MH.t('assistantTitle')) + '</h1></div>' +
      '<div class="notice">' +
        escapeText(lt(
          'PROTOTYPE: this assistant does not yet call a live AI model and does not claim or determine eligibility.',
          'ప్రోటోటైప్: ఈ సహాయకుడు ఇంకా ప్రత్యక్ష AI మోడల్‌ను ఉపయోగించడు మరియు అర్హతను నిర్ధారించడు.'
        )) +
      '</div>' +
      '<div class="chat">' +
        '<div class="chat-log" aria-live="polite"></div>' +
        '<form class="chat-form" id="chat-form">' +
          '<input class="input" type="text" name="message" autocomplete="off" placeholder="' +
            escapeText(MH.t('assistantPlaceholder')) + '">' +
          '<button type="submit" class="btn btn-primary">' + escapeText(MH.t('assistantSend')) + '</button>' +
        '</form>' +
      '</div>';

    renderLog(el);

    var form = el.querySelector('#chat-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="message"]');
      var text = input.value.trim();
      if (!text) return;

      var answer = respond(text);

      window.MH.store.set(function (s) {
        var log = Array.isArray(s.assistantLog) ? s.assistantLog.slice() : [];
        log.push({ role: 'user', text: text });
        log.push({ role: 'bot', text: answer });
        s.assistantLog = log.slice(-50);
        return s;
      });

      input.value = '';
      renderLog(el);
      input.focus();
    });
  }

  window.MH_PAGES.landing = landing;
  window.MH_PAGES.dashboard = dashboard;
  window.MH_PAGES.profile = profile;
  window.MH_PAGES.assistant = assistant;
})();
