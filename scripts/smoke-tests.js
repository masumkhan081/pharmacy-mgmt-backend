const BASE = process.env.BASE_URL || process.env.VITE_BASE_URL || 'http://localhost:3000/api';
const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

async function safeFetch(path, opts = {}) {
  const url = `${BASE.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let body = text;
    try { body = JSON.parse(text); } catch {};
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

async function run() {
  console.log('Smoke tests will run against:', BASE);

  console.log('\n1) Root health check: GET /');
  console.log(await safeFetch('/'));

  console.log('\n2) Create/get test accounts and tokens: GET /auth/get-role-wise-test-account-credentials-and-token');
  const tokensResp = await safeFetch('/auth/get-role-wise-test-account-credentials-and-token');
  console.log(tokensResp);
  const adminToken = tokensResp?.body?.accounts?.[0]?.token;

  if (!adminToken) {
    console.log('No token received — many subsequent tests will fail until DB/seed are ready. Exiting early.');
    return;
  }

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };

  console.log('\n3) Drug list (GET /drugs)');
  console.log(await safeFetch('/drugs', { headers }));

  console.log('\n4) Purchases list (GET /purchases)');
  console.log(await safeFetch('/purchases', { headers }));

  console.log('\n5) Sales list (GET /sales)');
  console.log(await safeFetch('/sales', { headers }));

  console.log('\n6) Dashboard stats (GET /dashboard/stats)');
  console.log(await safeFetch('/dashboard/stats', { headers }));

  console.log('\nNote: create/update flows require seeded entities (drugs, batches, invoices).');
}

if (require.main === module) run().catch((e)=>{ console.error('Smoke script error', e); process.exit(1); });
