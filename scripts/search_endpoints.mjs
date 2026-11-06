import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');

// Search for AJAX endpoints or API calls in the HTML
const matches = html.match(/[\w\/\.-]+\.(?:php|json|api)[\w\?\=\&-]*|fetch\s*\([^)]+\)|\$\.ajax\s*\([^)]+\)|\$\.get\s*\([^)]+\)|\$\.post\s*\([^)]+\)/gi);
console.log('Endpoints/AJAX calls found:');
if (matches) {
  [...new Set(matches)].forEach(m => console.log(' ', m));
}

// Search for anything related to "p-price" or "Venta B2B"
const lines = html.split('\n');
console.log('\nLines with "p-price" or "Venta B2B":');
lines.forEach((line, idx) => {
  if (line.includes('p-price') || line.includes('Venta B2B') || line.includes('btn-quick-add')) {
    console.log(`L${idx+1}: ${line.trim()}`);
  }
});
