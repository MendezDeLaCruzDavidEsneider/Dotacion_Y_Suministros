import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const $ = cheerio.load(html);

console.log('Elements with "Premium":');
$('a:contains("Premium"), button:contains("Premium"), [class*="premium"], [id*="premium"]').each((i, el) => {
  console.log('Tag:', el.tagName, 'Attrs:', $(el).attr(), 'Text:', $(el).text().trim());
});
