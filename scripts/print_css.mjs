import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('.p-price') || l.includes('p-discount') || l.includes('p-stock') || l.includes('.badge-') || l.includes('-20%')) {
    console.log(`L${i+1}: ${l}`);
  }
});
