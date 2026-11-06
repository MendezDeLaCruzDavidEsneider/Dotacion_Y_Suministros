import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'es-CO,es;q=0.9',
};

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200);
}

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url, { headers: HEADERS });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.text();
    } catch (e) {
      if (attempt === retries) return null;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
}

// Extract listing from all pages of Ferreteria
async function scrapeFerreteriaPages() {
  const products = [];
  const totalPages = 6;

  console.log(`Scraping ${totalPages} listing pages for Ferreteria...`);

  for (let page = 1; page <= totalPages; page++) {
    const url = page === 1 
      ? `${BASE_URL}/categoria/ferreteria/` 
      : `${BASE_URL}/categoria/ferreteria/p/${page}/`;

    console.log(`  Page ${page}/${totalPages}: ${url}`);
    const html = await fetchWithRetry(url);
    if (!html) {
      console.error(`  Failed to fetch page ${page}`);
      continue;
    }

    const $ = cheerio.load(html);
    $('.p-card').each((i, el) => {
      const refText = $(el).find('.p-sku').text().trim();
      const refMatch = refText.match(/REF[:\s]*(\d+)/i);
      const ref = refMatch ? refMatch[1] : '';

      const name = $(el).find('.p-title').text().trim() || $(el).find('h3').text().trim();
      const link = $(el).find('a[href*="/producto/"]').first().attr('href') || '';
      
      const img = $(el).find('img.p-image').first();
      let imgSrc = img.attr('src') || '';
      if (imgSrc && !imgSrc.startsWith('http')) {
        imgSrc = `${BASE_URL}${imgSrc}`;
      }

      if (ref && name) {
        products.push({
          ref,
          name,
          link: link.startsWith('http') ? link : `${BASE_URL}${link}`,
          image: imgSrc || `${BASE_URL}/abastece/images/${ref}.jpg`,
        });
      }
    });
  }

  // Deduplicate by ref
  const unique = [];
  const seen = new Set();
  for (const p of products) {
    if (!seen.has(p.ref)) {
      seen.add(p.ref);
      unique.push(p);
    }
  }

  console.log(`Total unique products found in Ferreteria: ${unique.length}`);
  return unique;
}

// Fetch price and description for a product
async function fetchProductDetails(product) {
  // 1. Fetch price from buscar1.php?q=REF
  let priceRegular = 0;
  let priceDiscount = 0;
  try {
    const searchHtml = await fetchWithRetry(`${BASE_URL}/buscar1.php?q=${product.ref}`);
    if (searchHtml) {
      const match = searchHtml.match(/Precio:\s*\$([\d,\.]+)/i);
      if (match) {
        priceRegular = parseInt(match[1].replace(/[^\d]/g, ''), 10);
        priceDiscount = Math.round(priceRegular * 0.8); // 20% discount
      }
    }
  } catch (e) {
    // ignore
  }

  // 2. Fetch description from product page
  let description = '';
  try {
    const prodHtml = await fetchWithRetry(product.link);
    if (prodHtml) {
      const $ = cheerio.load(prodHtml);
      // Try JSON-LD first
      $('script[type="application/ld+json"]').each((i, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Product' && json.description) {
            description = json.description.trim();
          }
        } catch (e) {
          // ignore
        }
      });
      // Fallback description from paragraph
      if (!description) {
        description = $('p').first().text().trim();
      }
    }
  } catch (e) {
    // ignore
  }

  if (!description) {
    description = `${product.name}. Producto de ferretería y mantenimiento para empresas disponible en Dotaciones & Suministros.`;
  }

  return {
    ...product,
    priceRegular,
    priceDiscount,
    price: priceDiscount > 0 ? priceDiscount : priceRegular,
    discount: priceDiscount > 0 ? 20 : 0,
    description,
  };
}

async function runTest() {
  const startTime = Date.now();
  const products = await scrapeFerreteriaPages();

  console.log(`\nFetching details (price + description) for ${products.length} products with concurrency...`);

  const results = [];
  const CONCURRENCY = 8;
  
  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(p => fetchProductDetails(p)));
    results.push(...batchResults);
    
    const progress = Math.min(i + CONCURRENCY, products.length);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`\rProgress: ${progress}/${products.length} (${Math.round(progress/products.length*100)}%) - Elapsed: ${elapsed}s`);
  }

  console.log('\n\nDone! Analyzing results:');
  const withPrice = results.filter(p => p.price > 0);
  const withDesc = results.filter(p => p.description && p.description.length > 50);
  console.log(`Total products: ${results.length}`);
  console.log(`With price: ${withPrice.length}`);
  console.log(`With detailed description: ${withDesc.length}`);

  // Sample results
  console.log('\nFirst 5 products:');
  results.slice(0, 5).forEach((p, idx) => {
    console.log(`[${idx+1}] REF: ${p.ref} | ${p.name}`);
    console.log(`    Regular: $${p.priceRegular} | Final (-20%): $${p.priceDiscount}`);
    console.log(`    Image: ${p.image}`);
    console.log(`    Desc: ${p.description.substring(0, 100)}...`);
  });

  fs.writeFileSync('scripts/ferreteria_sample.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nSaved scripts/ferreteria_sample.json`);
}

runTest().catch(console.error);
