import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const $ = cheerio.load(html);

console.log('Scripts found:');
$('script').each((i, el) => {
  const src = $(el).attr('src') || '';
  const inline = $(el).html() || '';
  if (src) {
    console.log(`Script src: ${src}`);
  } else if (inline.length > 0) {
    console.log(`\nInline script ${i} (length ${inline.length}):`);
    console.log(inline.substring(0, 500));
    // Check if it mentions price or b2b or auth or stock
    if (inline.includes('price') || inline.includes('precio') || inline.includes('b2b') || inline.includes('fetch') || inline.includes('api')) {
      console.log('>>> CONTAINS KEYWORDS');
    }
  }
});
