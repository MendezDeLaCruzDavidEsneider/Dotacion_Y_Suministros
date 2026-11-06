import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
};

async function testHome() {
  const resp = await fetch(BASE_URL, { headers: HEADERS });
  const html = await resp.text();
  fs.writeFileSync('scripts/home.html', html, 'utf-8');
  console.log(`Home fetched, length: ${html.length}`);

  const $ = cheerio.load(html);
  console.log('\n--- Category links in menu ---');
  $('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text.toLowerCase().includes('aseo') || 
        text.toLowerCase().includes('ferreter') || 
        text.toLowerCase().includes('papeler') || 
        text.toLowerCase().includes('dotaci') || 
        text.toLowerCase().includes('seguridad') ||
        href.includes('categor') ||
        href.includes('aseo') ||
        href.includes('ferreteria')) {
      console.log(`Text: "${text}" -> Href: "${href}"`);
    }
  });
}

testHome().catch(console.error);
