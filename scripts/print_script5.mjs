import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);

console.log('--- SCRIPT [5] FULL CONTENT ---');
console.log(scripts[5]);
