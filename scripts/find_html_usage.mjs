import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('discount-badge') || l.includes('p-old-price') || l.includes('p-new-price')) {
    if (i > 800) { // beyond the style tag
      console.log(`L${i+1}: ${l}`);
    }
  }
});
