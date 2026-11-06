import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
};

async function testCategory() {
  const url = `${BASE_URL}/categoria/ferreteria/`;
  console.log(`Fetching: ${url}`);
  const resp = await fetch(url, { headers: HEADERS });
  const html = await resp.text();
  fs.writeFileSync('scripts/cat_ferreteria.html', html, 'utf-8');
  console.log(`Length: ${html.length}`);

  const $ = cheerio.load(html);

  // Pagination links
  console.log('\n--- Pagination links ---');
  $('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (href.includes('page') || href.includes('pag') || href.includes('ferreteria')) {
      if (text.match(/^\d+$/) || text.includes('Sig') || text.includes('Ant') || text.includes('»') || text.includes('>')) {
        console.log(`Text: "${text}" -> Href: "${href}"`);
      }
    }
  });

  // Product cards / items
  console.log('\n--- Product links & cards ---');
  const cards = [];
  $('a[href*="/producto/"]').each((i, el) => {
    const href = $(el).attr('href');
    // Get parent card
    const parent = $(el).closest('div');
    const grandParent = parent.parent();
    // Let's print the first 3 links and their context
    if (i < 5) {
      console.log(`\nCard ${i}:`);
      console.log(`  Href: ${href}`);
      console.log(`  Link text: "${$(el).text().trim()}"`);
      console.log(`  Parent HTML preview: ${parent.html()?.substring(0, 300)}`);
      console.log(`  Grandparent HTML preview: ${grandParent.html()?.substring(0, 400)}`);
    }
  });

  // Check how many /producto/ links exist
  const prodLinks = new Set();
  $('a[href*="/producto/"]').each((i, el) => {
    prodLinks.add($(el).attr('href'));
  });
  console.log(`\nTotal unique product links on page 1: ${prodLinks.size}`);
}

testCategory().catch(console.error);
