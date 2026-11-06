// Quick discovery script to understand abastece.co HTML structure
import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
};

async function discover() {
  // Test category page
  const urls = [
    `${BASE_URL}/categorias/ferreteria/`,
    `${BASE_URL}/categorias/ferreteria/?page=2`,
  ];

  for (const url of urls) {
    console.log(`\n=== Fetching: ${url} ===`);
    try {
      const resp = await fetch(url, { headers: HEADERS, redirect: 'follow' });
      console.log(`Status: ${resp.status}, URL: ${resp.url}`);
      
      const html = await resp.text();
      console.log(`HTML length: ${html.length}`);
      
      // Save raw HTML
      const fname = url.includes('page=2') ? 'page2.html' : 'page1.html';
      fs.writeFileSync(`scripts/${fname}`, html, 'utf-8');
      
      const $ = cheerio.load(html);
      
      // Find all elements with class containing "product"
      console.log('\n--- Elements with "product" in class ---');
      $('[class*="product"], [class*="Product"]').each((i, el) => {
        if (i < 20) {
          const tag = el.tagName;
          const cls = $(el).attr('class');
          const text = $(el).text().trim().substring(0, 80);
          console.log(`  <${tag} class="${cls}"> ${text}`);
        }
      });
      
      // Find product links
      console.log('\n--- Product links ---');
      const links = new Set();
      $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        if (href.includes('/producto') || href.includes('/product')) {
          links.add(href);
        }
      });
      console.log(`Found ${links.size} unique product links:`);
      [...links].slice(0, 10).forEach(l => console.log(`  ${l}`));
      
      // Find prices
      console.log('\n--- Price elements ---');
      $('[class*="price"], [class*="precio"], .text-primary, strong').each((i, el) => {
        const text = $(el).text().trim();
        if (text.includes('$') && i < 20) {
          const cls = $(el).attr('class') || 'no-class';
          console.log(`  [${cls}] ${text.substring(0, 60)}`);
        }
      });
      
      // Find images
      console.log('\n--- Product images ---');
      $('img').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || '';
        const alt = $(el).attr('alt') || '';
        if ((src.includes('producto') || src.includes('product') || src.includes('cdn') || src.includes('media')) && i < 10) {
          console.log(`  src="${src.substring(0, 100)}" alt="${alt.substring(0, 50)}"`);
        }
      });
      
      // Find pagination
      console.log('\n--- Pagination ---');
      $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        if (href.includes('page') || href.includes('pagina') || href.includes('pag')) {
          console.log(`  href="${href}" text="${$(el).text().trim()}"`);
        }
      });
      
      // Try to find the card/container structure
      console.log('\n--- Card containers ---');
      $('[class*="card"], [class*="col-"]').each((i, el) => {
        if (i < 5) {
          const cls = $(el).attr('class');
          const hasLink = $(el).find('a[href*="/producto"]').length;
          const hasImg = $(el).find('img').length;
          const hasPrice = $(el).text().includes('$');
          if (hasLink || (hasImg && hasPrice)) {
            console.log(`  <${el.tagName} class="${cls}">`);
            console.log(`    Links: ${hasLink}, Images: ${hasImg}, HasPrice: ${hasPrice}`);
            console.log(`    Inner text (100 chars): ${$(el).text().trim().substring(0, 100)}`);
          }
        }
      });
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  
  // Also try to fetch a single product page
  console.log('\n\n=== Fetching a product page ===');
  try {
    const resp = await fetch(`${BASE_URL}/producto/8250/`, { headers: HEADERS });
    const html = await resp.text();
    fs.writeFileSync('scripts/product_sample.html', html, 'utf-8');
    console.log(`Product page: ${html.length} bytes`);
    
    const $ = cheerio.load(html);
    console.log('Title:', $('h1').first().text().trim());
    console.log('Description selectors:');
    $('[class*="desc"], [itemprop="description"], .product-description, #description').each((i, el) => {
      console.log(`  [${$(el).attr('class')}] ${$(el).text().trim().substring(0, 200)}`);
    });
    console.log('Meta description:', $('meta[name="description"]').attr('content')?.substring(0, 200));
    console.log('OG description:', $('meta[property="og:description"]').attr('content')?.substring(0, 200));
    console.log('OG image:', $('meta[property="og:image"]').attr('content'));
    
    // Find price on product page
    console.log('\nPrices on product page:');
    $('body').find('*').each((i, el) => {
      const text = $(el).text().trim();
      if (text.match(/^\$[\d.,]+$/) && text.length < 20) {
        const cls = $(el).attr('class') || el.tagName;
        console.log(`  [${cls}] ${text}`);
      }
    });
    
  } catch (error) {
    console.error(`Product page error: ${error.message}`);
  }
}

discover().catch(console.error);
