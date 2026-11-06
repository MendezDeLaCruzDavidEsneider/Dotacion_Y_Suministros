import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('scripts/prod_1293.html', 'utf-8');
const $ = cheerio.load(html);

console.log('Title (h1):', $('h1').text().trim());
console.log('p-price-container:', $('.p-price-container').html()?.trim());
console.log('price class:', $('[class*="price"]').map((i, el) => $(el).text().trim()).get());

// Check JSON-LD
$('script[type="application/ld+json"]').each((i, el) => {
  console.log(`\nJSON-LD ${i}:`, $(el).html()?.trim());
});

// Look for description
console.log('\n--- Checking potential description containers ---');
$('p').each((i, el) => {
  const t = $(el).text().trim();
  if (t.length > 50 && i < 10) {
    console.log(`P[${i}]: ${t.substring(0, 150)}...`);
  }
});
