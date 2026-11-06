const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testIngreso() {
  const resp = await fetch(`${BASE_URL}/ingreso_clientes.php`, { headers: HEADERS });
  const html = await resp.text();
  console.log(`Ingreso clientes length: ${html.length}`);
  
  // Find forms, inputs, cookies
  const forms = html.match(/<form[\s\S]*?<\/form>/gi);
  console.log('Forms found:', forms?.length);
  forms?.forEach(f => console.log(f.substring(0, 400)));
}

testIngreso().catch(console.error);
