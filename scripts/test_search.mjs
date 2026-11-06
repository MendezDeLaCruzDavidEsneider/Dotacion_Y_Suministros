const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'es-CO,es;q=0.9',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
};

async function testSearch() {
  const resp = await fetch(`${BASE_URL}/buscar.php`, {
    method: 'POST',
    headers: HEADERS,
    body: 'ajax_predictivo=1&termino=1293',
  });
  const text = await resp.text();
  console.log('Search response for 1293:');
  console.log(text.substring(0, 1000));

  const resp2 = await fetch(`${BASE_URL}/buscar.php?busqueda=1293`, {
    headers: { 'User-Agent': HEADERS['User-Agent'] }
  });
  const html2 = await resp2.text();
  console.log('\nGET buscar.php?busqueda=1293 response length:', html2.length);
  if (html2.includes('$') || html2.includes('precio') || html2.includes('7.610') || html2.includes('9.512')) {
    console.log('CONTAINS PRICES/TARGET NUMBERS!');
    const matches = html2.match(/.{0,50}(?:7\.610|9\.512|p-price|precio).{0,50}/gi);
    console.log(matches?.slice(0, 5));
  }
}

testSearch().catch(console.error);
