import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function test() {
  const resp = await fetch(`${BASE_URL}/buscar.php?busqueda=1293`, { headers: HEADERS });
  const html = await resp.text();
  const $ = cheerio.load(html);

  console.log('Cards found:', $('.p-card').length);
  $('.p-card').each((i, el) => {
    console.log(`\nCard ${i}:`);
    console.log('Title:', $(el).find('.p-title').text().trim());
    console.log('Price container:', $(el).find('.p-price-container').html()?.trim());
    console.log('Actions container:', $(el).find('.p-actions-container').html()?.trim());
    console.log('Full card text:', $(el).text().replace(/\s+/g, ' ').trim());
  });
}

test().catch(console.error);
