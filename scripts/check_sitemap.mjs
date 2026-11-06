const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testSitemap() {
  const resp = await fetch(`${BASE_URL}/sitemap-productos.xml`, { headers: HEADERS });
  const text = await resp.text();
  console.log(`sitemap-productos length: ${text.length}`);
  
  // Count product URLs
  const urls = text.match(/<loc>(https:\/\/www\.abastece\.co\/producto\/\d+\/)<\/loc>/g);
  console.log(`Product URLs in sitemap: ${urls?.length}`);
  if (urls) {
    console.log('Sample URLs:', urls.slice(0, 5));
  }
}

testSitemap().catch(console.error);
