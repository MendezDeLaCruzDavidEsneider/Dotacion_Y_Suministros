const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testCategorySearch() {
  const resp = await fetch(`${BASE_URL}/buscar1.php?q=ferreteria`, { headers: HEADERS });
  const text = await resp.text();
  console.log('Search for ferreteria, length:', text.length);
  
  // Count matches
  const refs = text.match(/Ref:\s*\d+\s*\|\s*Precio:\s*\$[\d,\.]+/gi);
  console.log(`Matches in ferreteria: ${refs?.length}`);
  if (refs) {
    console.log('Sample refs:', refs.slice(0, 10));
  }
}

testCategorySearch().catch(console.error);
