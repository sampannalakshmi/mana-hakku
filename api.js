window.MH_API = (function () {
  var BASE_URL = 'http://127.0.0.1:8002';
  var TIMEOUT_MS = 8000;

  function fetchJson(path) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;
    return fetch(BASE_URL + path, {
      headers: { Accept: 'application/json' },
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (res.status === 404) { var nf = new Error('NOT_FOUND'); nf.status = 404; throw nf; }
      if (!res.ok) { var he = new Error('HTTP_' + res.status); he.status = res.status; throw he; }
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  // Maps a backend ScholarshipResponse to the shape the frontend pages use.
  // Fields the backend does not provide are null (never invented).
  function mapScholarship(r) {
    return {
      id: String(r.id),
      name: r.name,
      nameTe: null,
      provider: r.provider || null,
      level: null,
      category: null,
      amountLabel: null,
      deadline: r.deadline || '',
      eligibility: r.eligibility ? [r.eligibility] : [],
      eligibilityTe: [],
      documents: [],
      documentsTe: [],
      description: r.description || '',
      descriptionTe: null,
      verified: !!r.is_verified,
      source: 'Backend record - unverified',
      officialUrl: r.official_url || null
    };
  }

  function listScholarships() {
    return fetchJson('/api/scholarships').then(function (rows) {
      return rows.map(mapScholarship);
    });
  }

  function getScholarship(id) {
    return fetchJson('/api/scholarships/' + encodeURIComponent(id)).then(mapScholarship);
  }

  return {
    baseUrl: BASE_URL,
    listScholarships: listScholarships,
    getScholarship: getScholarship
  };
})();
