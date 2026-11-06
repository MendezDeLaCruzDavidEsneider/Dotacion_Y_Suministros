const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testNumbers() {
  const nums = ['1293', '2521', '71557', '72605', '73109'];
  for (const q of nums) {
    const resp = await fetch(`${BASE_URL}/buscar1.php?q=${q}`, { headers: HEADERS });
    const text = await resp.text();
    const match = text.match(/Ref:\s*(\d+)\s*\|\s*Precio:\s*\$([\d,\.]+)/i);
    if (match) {
      console.log(`Ref: ${match[1]} -> Precio: $${match[2]}`);
    } else {
      console.log(`Ref: ${q} -> No match`);
    }
  }
}

testNumbers().catch(console.error);
