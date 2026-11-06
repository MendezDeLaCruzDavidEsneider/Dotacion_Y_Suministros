const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testLetterSearch() {
  const letters = ['a', 'e', 'i', 'o', 'u', 'de', 'el', 'la'];
  for (const q of letters) {
    const resp = await fetch(`${BASE_URL}/buscar1.php?q=${q}`, { headers: HEADERS });
    const text = await resp.text();
    const refs = text.match(/Ref:\s*(\d+)\s*\|\s*Precio:\s*\$([\d,\.]+)/gi);
    console.log(`q="${q}" -> ${refs?.length || 0} items`);
  }
}

testLetterSearch().catch(console.error);
