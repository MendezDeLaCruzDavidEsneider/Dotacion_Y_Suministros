import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');
const $ = cheerio.load(html);

console.log('Total .p-card elements:', $('.p-card').length);

const firstCard = $('.p-card').first();
console.log('\n--- FIRST .p-card HTML ---');
console.log(firstCard.html());

console.log('\n--- ALL TEXT in firstCard ---');
console.log(firstCard.text());

console.log('\n--- Checking second card ---');
console.log($('.p-card').eq(1).html());
