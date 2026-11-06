const BASE_URL = 'https://www.abastece.co';

async function testColombiaIP() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Forwarded-For': '181.129.53.1',
    'X-Real-IP': '181.129.53.1',
    'Client-IP': '181.129.53.1',
    'CF-IPCountry': 'CO',
    'Accept-Language': 'es-CO,es;q=0.9',
  };

  const resp = await fetch(`${BASE_URL}/categoria/ferreteria/`, { headers });
  const html = await resp.text();
  console.log('Has 7.610:', html.includes('7.610') || html.includes('7,610'));
  console.log('Has p-price-final:', html.includes('p-price-final'));
  console.log('Has Venta B2B:', html.includes('Venta B2B'));
}

testColombiaIP().catch(console.error);
