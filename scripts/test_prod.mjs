import fs from 'fs';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
};

async function testProduct() {
  const resp = await fetch(`${BASE_URL}/producto/1293/`, { headers: HEADERS });
  const html = await resp.text();
  fs.writeFileSync('scripts/prod_1293.html', html, 'utf-8');
  console.log(`Product 1293 HTML length: ${html.length}`);

  // Search for prices in product page
  const matches = html.match(/\$\s*[\d\.,]+/g);
  console.log('Prices found in 1293:', matches);

  // Search for stock
  const stock = html.match(/stock[:\s]*\d+/gi);
  console.log('Stock found:', stock);

  // Search for description
  const desc = html.match(/<div[^>]*class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  console.log('Desc elements found:', desc?.length);
}

testProduct().catch(console.error);
