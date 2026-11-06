const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testRobots() {
  const r1 = await fetch(`${BASE_URL}/robots.txt`, { headers: HEADERS });
  console.log('--- ROBOTS.TXT ---');
  console.log(await r1.text());

  const r2 = await fetch(`${BASE_URL}/sitemap.xml`, { headers: HEADERS });
  console.log('--- SITEMAP.XML ---');
  console.log(await r2.text());
}

testRobots().catch(console.error);
