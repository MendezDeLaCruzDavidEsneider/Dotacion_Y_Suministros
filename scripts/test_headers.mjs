const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
};

async function testCookies() {
  const resp = await fetch(`${BASE_URL}/categoria/ferreteria/`, { headers: HEADERS });
  console.log('Status:', resp.status);
  console.log('Headers:');
  for (const [k, v] of resp.headers.entries()) {
    console.log(`  ${k}: ${v}`);
  }
}

testCookies().catch(console.error);
