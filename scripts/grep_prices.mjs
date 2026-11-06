import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('p-price-final') || l.includes('p-price-old') || l.includes('Venta B2B')) {
    console.log(`L${i+1}: ${l}`);
  }
});
