const BASE_URL = 'https://www.abastece.co';

async function testCookiesAndParams() {
  const tests = [
    { name: 'b2b cookie', cookie: 'b2b=1' },
    { name: 'precios cookie', cookie: 'precios=1; mostrar_precios=1' },
    { name: 'cliente cookie', cookie: 'cliente=1; rol=cliente' },
    { name: 'param b2b', url: `${BASE_URL}/categoria/ferreteria/?b2b=1` },
    { name: 'param precios', url: `${BASE_URL}/categoria/ferreteria/?precios=1` },
    { name: 'param ver_precios', url: `${BASE_URL}/categoria/ferreteria/?ver_precios=1` },
    { name: 'param premium', url: `${BASE_URL}/categoria/ferreteria/?premium=1` },
  ];

  for (const t of tests) {
    const url = t.url || `${BASE_URL}/categoria/ferreteria/`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    if (t.cookie) headers['Cookie'] = t.cookie;

    const resp = await fetch(url, { headers });
    const html = await resp.text();
    const hasPrice = html.includes('p-price-final') || html.includes('7.610') || html.includes('-20%');
    console.log(`Test: ${t.name} -> hasPrice: ${hasPrice}`);
  }
}

testCookiesAndParams().catch(console.error);
