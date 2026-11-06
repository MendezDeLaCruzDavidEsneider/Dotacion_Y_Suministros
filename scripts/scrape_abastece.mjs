// =====================================================================
// SCRIPT DE SCRAPING COMPLETO - ABASTECE.CO
// Extrae TODOS los productos de las 4 categorías con:
//   - Nombre
//   - Descripción (de la página individual del producto)
//   - Precio (con descuento)
//   - Imagen
// Genera archivos SQL para insertar en Supabase
// =====================================================================

import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.abastece.co';

const CATEGORIES = [
  {
    name: 'Ferretería',
    urlSlug: 'ferreteria',
    totalPages: 6,
    categoryId: 'c2222222-2222-2222-2222-222222222222',
  },
  {
    name: 'Dotación',
    urlSlug: 'seguridad-botiquin-dotaciones',
    totalPages: 17,
    categoryId: 'c1111111-1111-1111-1111-111111111111',
  },
  {
    name: 'Aseo',
    urlSlug: 'aseo',
    totalPages: 28,
    categoryId: 'c4444444-4444-4444-4444-444444444444',
  },
  {
    name: 'Papelería',
    urlSlug: 'papeleria',
    totalPages: 43,
    categoryId: 'c3333333-3333-3333-3333-333333333333',
  },
];

const DELAY_BETWEEN_REQUESTS = 500; // ms between requests
const DELAY_BETWEEN_PRODUCT_REQUESTS = 300; // ms between product detail requests
const CONCURRENT_PRODUCT_FETCHES = 5; // concurrent product detail fetches
const MAX_RETRIES = 3;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 210);
}

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        headers: HEADERS,
        signal: controller.signal,
        redirect: 'follow',
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error(`  ⚠ Attempt ${attempt}/${retries} failed for ${url}: ${error.message}`);
      if (attempt < retries) {
        await sleep(2000 * attempt);
      } else {
        console.error(`  ✗ FAILED after ${retries} attempts: ${url}`);
        return null;
      }
    }
  }
  return null;
}

// Step 1: First, discover the actual URL structure by fetching the first page
async function discoverStructure() {
  console.log('🔍 Discovering site structure...');
  
  // Try different URL patterns
  const testPatterns = [
    `${BASE_URL}/categorias/ferreteria/`,
    `${BASE_URL}/categoria/ferreteria/`,
    `${BASE_URL}/ferreteria/`,
    `${BASE_URL}/categorias/ferreteria`,
  ];
  
  for (const url of testPatterns) {
    console.log(`  Testing: ${url}`);
    const html = await fetchWithRetry(url, 1);
    if (html && html.length > 1000) {
      console.log(`  ✓ Found working URL pattern: ${url} (${html.length} bytes)`);
      
      // Save for analysis
      fs.writeFileSync(
        path.join('scripts', 'sample_page.html'),
        html,
        'utf-8'
      );
      
      // Parse and check structure
      const $ = cheerio.load(html);
      
      // Look for product elements - try various selectors
      const selectors = [
        '.product-card', '.product-item', '.product',
        '[class*="product"]', '[class*="Product"]',
        '.card', '.item',
        'article', '.col-md-3', '.col-lg-3',
        '[data-product]', '[data-id]',
      ];
      
      console.log('\n  Checking selectors:');
      for (const sel of selectors) {
        const count = $(sel).length;
        if (count > 0) {
          console.log(`    ${sel}: ${count} elements`);
        }
      }
      
      // Check for links to products
      const productLinks = [];
      $('a[href*="/producto/"]').each((i, el) => {
        productLinks.push($(el).attr('href'));
      });
      console.log(`\n  Product links found: ${productLinks.length}`);
      if (productLinks.length > 0) {
        console.log(`  Sample: ${productLinks.slice(0, 5).join(', ')}`);
      }
      
      // Check for pagination
      const paginationLinks = [];
      $('a[href*="page"], a[href*="pagina"], a[href*="pag"], .pagination a, nav a').each((i, el) => {
        paginationLinks.push($(el).attr('href'));
      });
      console.log(`\n  Pagination links: ${paginationLinks.length}`);
      if (paginationLinks.length > 0) {
        const unique = [...new Set(paginationLinks)];
        console.log(`  Unique: ${unique.slice(0, 10).join(', ')}`);
      }
      
      // Check for prices
      const priceTexts = [];
      $('[class*="price"], [class*="precio"], .precio, .price').each((i, el) => {
        priceTexts.push($(el).text().trim().substring(0, 50));
      });
      console.log(`\n  Price elements: ${priceTexts.length}`);
      if (priceTexts.length > 0) {
        console.log(`  Samples: ${priceTexts.slice(0, 5).join(' | ')}`);
      }
      
      // Try to find the base URL pattern
      const basePattern = url.replace('/ferreteria/', '/').replace('/ferreteria', '/');
      console.log(`\n  Base pattern: ${basePattern}`);
      
      return { baseUrl: url.replace('ferreteria/', '').replace('ferreteria', ''), html, $ };
    }
  }
  
  console.error('✗ Could not discover URL structure');
  return null;
}

// Step 2: Parse a listing page to extract product links and basic info
function parseListingPage(html) {
  const $ = cheerio.load(html);
  const products = [];
  
  // Based on typical e-commerce sites, try multiple approaches
  // Look for product cards/links
  $('a[href*="/producto/"]').each((i, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    
    // Avoid duplicate product links (same product may have image + text link)
    if (href && !products.some(p => p.url === href)) {
      const $card = $el.closest('[class*="card"], [class*="product"], [class*="col-"], article, .item');
      
      let name = '';
      let price = '';
      let originalPrice = '';
      let imageUrl = '';
      let ref = '';
      
      // Try to extract from the card container
      if ($card.length) {
        name = $card.find('h2, h3, h4, h5, [class*="title"], [class*="name"], [class*="nombre"]').first().text().trim();
        
        // Price - look for the discounted price (usually the prominent one)
        const priceElements = $card.find('[class*="price"], [class*="precio"], .precio, .price');
        priceElements.each((j, priceEl) => {
          const text = $(priceEl).text().trim();
          if (text.includes('$')) {
            if (!price) price = text;
          }
        });
        
        // Image
        const img = $card.find('img').first();
        imageUrl = img.attr('src') || img.attr('data-src') || img.attr('data-lazy') || '';
        
        // Ref
        const refText = $card.text();
        const refMatch = refText.match(/REF[:\s]*(\d+)/i);
        if (refMatch) ref = refMatch[1];
      }
      
      // Fallback: try to get name from the link text itself
      if (!name) {
        name = $el.text().trim() || $el.find('img').attr('alt') || '';
      }
      
      if (name || href) {
        products.push({
          url: href.startsWith('http') ? href : `${BASE_URL}${href}`,
          name: name,
          price: price,
          originalPrice: originalPrice,
          imageUrl: imageUrl,
          ref: ref,
        });
      }
    }
  });
  
  return products;
}

// Step 3: Parse individual product page for full details
function parseProductPage(html, basicInfo) {
  const $ = cheerio.load(html);
  
  let name = basicInfo.name;
  let description = '';
  let price = 0;
  let originalPrice = 0;
  let imageUrl = basicInfo.imageUrl;
  let stock = 0;
  
  // Name - try various selectors
  if (!name) {
    name = $('h1').first().text().trim() ||
           $('[class*="product-title"], [class*="product-name"]').first().text().trim() ||
           $('meta[property="og:title"]').attr('content') || '';
  }
  
  // Description
  description = $('[class*="description"], [class*="descripcion"], #description, .product-description, [itemprop="description"]').first().text().trim();
  if (!description) {
    description = $('meta[property="og:description"]').attr('content') || '';
  }
  if (!description) {
    description = $('meta[name="description"]').attr('content') || '';
  }
  
  // Price - extract numeric value
  const allText = $('body').text();
  
  // Look for price in specific elements
  $('[class*="price"], [class*="precio"], .precio, .price, [itemprop="price"]').each((i, el) => {
    const text = $(el).text().trim();
    const priceMatch = text.replace(/\./g, '').replace(/,/g, '.').match(/\$?\s*([\d]+(?:\.\d{1,2})?)/);
    if (priceMatch && !price) {
      const val = parseFloat(priceMatch[1]);
      if (val > 0) price = val;
    }
  });
  
  // Fallback: try itemprop
  if (!price) {
    const priceAttr = $('[itemprop="price"]').attr('content');
    if (priceAttr) price = parseFloat(priceAttr);
  }
  
  // Image
  if (!imageUrl) {
    imageUrl = $('[class*="product"] img, .product-image img, [itemprop="image"]').first().attr('src') ||
               $('meta[property="og:image"]').attr('content') || '';
  }
  
  // Stock
  const stockMatch = $('body').text().match(/Stock:\s*(\d+)/i);
  if (stockMatch) stock = parseInt(stockMatch[1]);
  
  return {
    name: name.trim(),
    description: description.trim(),
    price,
    originalPrice,
    imageUrl,
    stock: stock || 10, // default stock
  };
}

// Step 4: Parse price from text
function parsePrice(text) {
  if (!text) return 0;
  // Remove dots (thousand separators) and handle comma as decimal
  const cleaned = text.replace(/\./g, '').replace(/,/g, '.');
  const match = cleaned.match(/(\d+(?:\.\d{1,2})?)/);
  if (match) return parseFloat(match[1]);
  return 0;
}

// Step 5: Scrape all products from listing pages
async function scrapeListingPages(category) {
  const allProducts = [];
  
  console.log(`\n📦 Scraping listing pages for: ${category.name}`);
  console.log(`   URL slug: ${category.urlSlug}, Expected pages: ${category.totalPages}`);
  
  for (let page = 1; page <= category.totalPages + 2; page++) { // +2 for safety
    const url = page === 1
      ? `${BASE_URL}/categorias/${category.urlSlug}/`
      : `${BASE_URL}/categorias/${category.urlSlug}/?page=${page}`;
    
    console.log(`   Page ${page}/${category.totalPages}: ${url}`);
    
    const html = await fetchWithRetry(url);
    if (!html) {
      // Try alternate pagination patterns
      const altUrl = `${BASE_URL}/categorias/${category.urlSlug}/page/${page}/`;
      console.log(`   Trying alternate: ${altUrl}`);
      const altHtml = await fetchWithRetry(altUrl, 1);
      if (!altHtml) {
        console.log(`   ⚠ No more pages after page ${page - 1}`);
        break;
      }
    }
    
    const htmlContent = html;
    if (!htmlContent) continue;
    
    const products = parseListingPage(htmlContent);
    console.log(`   Found ${products.length} products on page ${page}`);
    
    if (products.length === 0 && page > 1) {
      console.log(`   ⚠ Empty page, stopping`);
      break;
    }
    
    allProducts.push(...products);
    await sleep(DELAY_BETWEEN_REQUESTS);
  }
  
  // Deduplicate by URL
  const unique = [];
  const seen = new Set();
  for (const p of allProducts) {
    if (!seen.has(p.url)) {
      seen.add(p.url);
      unique.push(p);
    }
  }
  
  console.log(`   ✓ Total unique products for ${category.name}: ${unique.length}`);
  return unique;
}

// Step 6: Fetch product details in batches
async function fetchProductDetails(products, batchSize = CONCURRENT_PRODUCT_FETCHES) {
  const detailed = [];
  
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const progress = Math.min(i + batchSize, products.length);
    
    process.stdout.write(`\r   Fetching details: ${progress}/${products.length} (${Math.round(progress/products.length*100)}%)`);
    
    const promises = batch.map(async (product) => {
      const html = await fetchWithRetry(product.url);
      if (html) {
        return { ...product, ...parseProductPage(html, product) };
      }
      return product;
    });
    
    const results = await Promise.all(promises);
    detailed.push(...results);
    
    await sleep(DELAY_BETWEEN_PRODUCT_REQUESTS);
  }
  
  console.log(''); // newline after progress
  return detailed;
}

// Step 7: Generate SQL for a category
function generateSQL(products, category) {
  const lines = [];
  
  lines.push(`-- ═══════════════════════════════════════════════════════════════════════`);
  lines.push(`-- CATEGORÍA: ${category.name.toUpperCase()}`);
  lines.push(`-- Total productos: ${products.length}`);
  lines.push(`-- Category ID: ${category.categoryId}`);
  lines.push(`-- Fuente: abastece.co/categorias/${category.urlSlug}/`);
  lines.push(`-- ═══════════════════════════════════════════════════════════════════════`);
  lines.push('');
  
  for (const product of products) {
    if (!product.name) continue;
    
    const name = escapeSQL(product.name.substring(0, 200));
    const slug = slugify(product.name);
    const desc = escapeSQL(
      product.description || `${product.name}. Producto de ${category.name.toLowerCase()} para empresas y operación corporativa. Disponible en Dotaciones & Suministros.`
    ).substring(0, 2000);
    const price = product.price || 0;
    const stock = product.stock || 10;
    const imageUrl = escapeSQL(product.imageUrl || '');
    
    if (price <= 0) continue; // Skip products without price
    
    lines.push(`INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url)`);
    lines.push(`VALUES ('${category.categoryId}', '${name}', '${slug}', '${desc}', ${price}.00, 0, ${stock}, true, false, '${imageUrl}')`);
    lines.push(`ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, main_image_url = EXCLUDED.main_image_url;`);
    lines.push('');
  }
  
  return lines.join('\n');
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SCRAPING COMPLETO DE ABASTECE.CO');
  console.log('  Categorías: Aseo, Ferretería, Papelería, Dotación');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Start time: ${new Date().toISOString()}`);
  console.log('');
  
  // Step 1: Discover structure
  const structure = await discoverStructure();
  if (!structure) {
    console.error('Cannot proceed without understanding site structure');
    process.exit(1);
  }
  
  // Save discovery info
  fs.writeFileSync(
    path.join('scripts', 'site_structure.json'),
    JSON.stringify({ discovered: true, timestamp: new Date().toISOString() }, null, 2)
  );
  
  // Step 2: Process each category
  const allSQL = [];
  allSQL.push('-- =====================================================================');
  allSQL.push('-- SEED COMPLETO DE PRODUCTOS - ABASTECE.CO');
  allSQL.push('-- Generado automáticamente el: ' + new Date().toISOString());
  allSQL.push('-- PROYECTO: DOTACIONES & SUMINISTROS');
  allSQL.push('-- Ejecutar en: Supabase Dashboard -> SQL Editor -> Run');
  allSQL.push('-- =====================================================================');
  allSQL.push('');
  allSQL.push('-- Limpiar productos existentes antes de insertar los nuevos');
  allSQL.push('DELETE FROM product_features;');
  allSQL.push('DELETE FROM product_images;');
  allSQL.push('DELETE FROM products;');
  allSQL.push('');
  
  const stats = {};
  
  for (const category of CATEGORIES) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  Processing: ${category.name}`);
    console.log(`${'='.repeat(60)}`);
    
    // Scrape listing pages
    const listings = await scrapeListingPages(category);
    
    // Fetch individual product details
    console.log(`\n   📄 Fetching individual product details for ${listings.length} products...`);
    const detailed = await fetchProductDetails(listings);
    
    // Filter valid products
    const valid = detailed.filter(p => p.name && p.price > 0);
    console.log(`   ✓ Valid products with price: ${valid.length}`);
    
    stats[category.name] = {
      listed: listings.length,
      detailed: detailed.length,
      valid: valid.length,
    };
    
    // Generate SQL
    const sql = generateSQL(valid, category);
    allSQL.push(sql);
    
    // Save intermediate results as JSON
    fs.writeFileSync(
      path.join('scripts', `products_${category.urlSlug}.json`),
      JSON.stringify(valid, null, 2),
      'utf-8'
    );
    
    console.log(`   💾 Saved JSON: scripts/products_${category.urlSlug}.json`);
  }
  
  // Write final SQL file
  allSQL.push('');
  allSQL.push('-- ═══════════════════════════════════════════════════════════════');
  allSQL.push('-- RESUMEN FINAL');
  allSQL.push('-- ═══════════════════════════════════════════════════════════════');
  for (const [cat, st] of Object.entries(stats)) {
    allSQL.push(`-- ${cat}: ${st.valid} productos insertados (de ${st.listed} encontrados)`);
  }
  allSQL.push(`-- Total: ${Object.values(stats).reduce((sum, s) => sum + s.valid, 0)} productos`);
  allSQL.push(`-- Generado: ${new Date().toISOString()}`);
  allSQL.push('-- ═══════════════════════════════════════════════════════════════');
  
  const sqlContent = allSQL.join('\n');
  fs.writeFileSync(
    path.join('supabase', 'seed_abastece_complete.sql'),
    sqlContent,
    'utf-8'
  );
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  SCRAPING COMPLETADO');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  End time: ${new Date().toISOString()}`);
  console.log('\n  📊 Estadísticas:');
  for (const [cat, st] of Object.entries(stats)) {
    console.log(`    ${cat}: ${st.valid} productos válidos`);
  }
  console.log(`\n  📄 Archivo SQL: supabase/seed_abastece_complete.sql`);
  console.log('  📋 Archivos JSON en: scripts/products_*.json');
  console.log('\n  Para insertar en Supabase:');
  console.log('  1. Ve a Supabase Dashboard -> SQL Editor');
  console.log('  2. Pega el contenido de seed_abastece_complete.sql');
  console.log('  3. Haz clic en Run');
}

main().catch(console.error);
