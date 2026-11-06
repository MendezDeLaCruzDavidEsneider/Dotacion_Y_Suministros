const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testBuscar1() {
  const resp = await fetch(`${BASE_URL}/buscar1.php?q=1293`, { headers: HEADERS });
  const text = await resp.text();
  console.log('--- BUSCAR1.PHP?Q=1293 ---');
  console.log(text);
}

testBuscar1().catch(console.error);
