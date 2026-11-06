import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const lines = html.split('\n');

console.log(lines.slice(480, 520).join('\n'));
