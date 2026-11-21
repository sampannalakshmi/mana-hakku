window.MH_API = (function () {
  var BASE_URL = 'http://127.0.0.1:8002';
  var TIMEOUT_MS = 8000;
  var ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

  function fetchJson(path) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;
    return fetch(BASE_URL + path, {
      headers: { Accept: 'application/json' },
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) { var he = new Error('HTTP_' + res.status); he.status = res.status; throw he; }
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  function notFoundError() {
    var e = new Error('NOT_FOUND');
    e.status = 404;
    return e;
  }

  function getLocalScholarships() {
    return (window.MH_DATA && Array.isArray(window.MH_DATA.scholarships))
      ? window.MH_DATA.scholarships
      : [];
  }

  // Maps a backend ScholarshipResponse to the shape the frontend pages use.
  // Fields the backend does not provide are null (never invented).
  function mapScholarship(r) {
    if (!r) return null;
    return {
      id: String(r.id),
      name: r.name || '',
      nameTe: r.name_te || null,
      provider: r.provider || null,
      level: r.level || null,
      category: r.category || null,
      amount: r.amount != null ? r.amount : null,
      amountLabel: r.amount_label || (r.amount != null ? '₹ ' + r.amount : null),
      deadline: r.deadline || '',
      eligibility: Array.isArray(r.eligibility) ? r.eligibility : (r.eligibility ? [r.eligibility] : []),
      eligibilityTe: Array.isArray(r.eligibility_te) ? r.eligibility_te : (r.eligibility_te ? [r.eligibility_te] : []),
      documents: Array.isArray(r.documents) ? r.documents : (r.documents ? [r.documents] : []),
      documentsTe: Array.isArray(r.documents_te) ? r.documents_te : (r.documents_te ? [r.documents_te] : []),
      description: r.description || '',
      descriptionTe: r.description_te || null,
      verified: !!r.is_verified,
      source: r.source || (r.is_verified ? 'Verified official source' : 'Backend record - unverified'),
      officialUrl: r.official_url || null
    };
  }

  // Returns { items, source, reason }.
  //   source 'live'  : backend answered with one or more records
  //   source 'empty' : backend answered and the live database has zero records
  //   source 'demo'  : backend could not be reached or failed; labelled demo data is returned
  function listScholarshipsStatus() {
    return fetchJson('/api/scholarships').then(function (rows) {
      if (!Array.isArray(rows)) throw new Error('BAD_RESPONSE');
      if (rows.length === 0) return { items: [], source: 'empty', reason: null };
      return { items: rows.map(mapScholarship).filter(Boolean), source: 'live', reason: null };
    }).catch(function (err) {
      if (window.console) {
        console.warn('Mana Hakku API: live data unavailable; showing labelled demo data.', err && err.message);
      }
      return {
        items: getLocalScholarships(),
        source: 'demo',
        reason: err && err.status ? 'HTTP_' + err.status : 'UNAVAILABLE'
      };
    });
  }

  function listScholarships() {
    return listScholarshipsStatus().then(function (r) { return r.items; });
  }

  // Returns { item, source, reason }. Rejects with a status-404 error for invalid or unknown IDs.
  // Rejects with the original error when the backend is unreachable and no demo record matches.
  function getScholarshipStatus(id) {
    var sid = String(id || '');
    if (!ID_PATTERN.test(sid)) return Promise.reject(notFoundError());
    var localItem = getLocalScholarships().filter(function (s) { return String(s.id) === sid; })[0];
    return fetchJson('/api/scholarships/' + encodeURIComponent(sid)).then(function (r) {
      return { item: mapScholarship(r), source: 'live', reason: null };
    }).catch(function (err) {
      if (localItem) {
        return { item: localItem, source: 'demo', reason: err && err.status ? 'HTTP_' + err.status : 'UNAVAILABLE' };
      }
      if (err && (err.status === 404 || err.status === 422)) throw notFoundError();
      throw err;
    });
  }

  function getScholarship(id) {
    return getScholarshipStatus(id).then(function (r) { return r.item; });
  }

  return {
    baseUrl: BASE_URL,
    listScholarships: listScholarships,
    listScholarshipsStatus: listScholarshipsStatus,
    getScholarship: getScholarship,
    getScholarshipStatus: getScholarshipStatus
  };
})();
