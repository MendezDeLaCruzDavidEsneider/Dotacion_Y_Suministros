import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'es-CO,es;q=0.9',
};

// Configuración de las 4 categorías con sus UUIDs exactos de Supabase
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

function slugify(text, ref) {
  let s = text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
  
  if (ref && !s.includes(ref)) {
    s = `${s}-${ref}`;
  }
  return s.substring(0, 215);
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
      await new Promise(r => setTimeout(r, 600 * attempt));
    }
  }
  return null;
}

// Scrape listing pages for a category
async function scrapeCategoryListings(cat) {
  const products = [];
  console.log(`\n============================================================`);
  console.log(`[1/2] Extrayendo listado de páginas para ${cat.name} (${cat.totalPages} páginas)...`);
  console.log(`============================================================`);

  for (let page = 1; page <= cat.totalPages; page++) {
    const url = page === 1 
      ? `${BASE_URL}/categoria/${cat.urlSlug}/` 
      : `${BASE_URL}/categoria/${cat.urlSlug}/p/${page}/`;

    const html = await fetchWithRetry(url);
    if (!html) {
      console.error(`  Error cargando página ${page}/${cat.totalPages}`);
      continue;
    }

    const $ = cheerio.load(html);
    let pageCount = 0;

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
        pageCount++;
      }
    });

    console.log(`  Pág ${page}/${cat.totalPages}: ${pageCount} productos encontrados`);
  }

  // Deduplicar por REF
  const unique = [];
  const seen = new Set();
  for (const p of products) {
    if (!seen.has(p.ref)) {
      seen.add(p.ref);
      unique.push(p);
    }
  }

  console.log(`>> Total productos únicos detectados en ${cat.name}: ${unique.length}`);
  return unique;
}

// Fetch price and description for a single product
async function fetchProductDetails(product, catName) {
  // 1. Obtener precio desde buscar1.php?q=REF
  let priceRegular = 0;
  let priceDiscount = 0;
  try {
    const searchHtml = await fetchWithRetry(`${BASE_URL}/buscar1.php?q=${product.ref}`);
    if (searchHtml) {
      const match = searchHtml.match(/Precio:\s*\$([\d,\.]+)/i);
      if (match) {
        priceRegular = parseInt(match[1].replace(/[^\d]/g, ''), 10);
        priceDiscount = Math.round(priceRegular * 0.8); // 20% de descuento corporativo
      }
    }
  } catch (e) {
    // ignore
  }

  // 2. Obtener descripción desde la página del producto
  let description = '';
  try {
    const prodHtml = await fetchWithRetry(product.link);
    if (prodHtml) {
      const $ = cheerio.load(prodHtml);
      // Extraer desde JSON-LD
      $('script[type="application/ld+json"]').each((i, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Product' && json.description) {
            description = json.description.trim();
          }
        } catch (e) {}
      });
      // Fallback
      if (!description) {
        const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
        if (metaDesc) description = metaDesc.trim();
      }
    }
  } catch (e) {
    // ignore
  }

  if (!description) {
    description = `${product.name}. Referencia REF: ${product.ref}. Suministro corporativo de alta calidad para empresas y oficinas disponible en Dotaciones & Suministros.`;
  }

  return {
    ...product,
    priceRegular,
    priceDiscount,
    price: priceDiscount > 0 ? priceDiscount : (priceRegular > 0 ? priceRegular : 15000),
    discount: priceDiscount > 0 ? 20 : 0,
    description,
  };
}

async function processCategory(cat) {
  const startTime = Date.now();
  const listings = await scrapeCategoryListings(cat);

  console.log(`\n[2/2] Obteniendo precios y descripciones para ${listings.length} productos de ${cat.name}...`);

  const detailed = [];
  const CONCURRENCY = 12; // 12 peticiones paralelas para máxima velocidad y seguridad

  for (let i = 0; i < listings.length; i += CONCURRENCY) {
    const batch = listings.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(p => fetchProductDetails(p, cat.name)));
    detailed.push(...batchResults);

    const progress = Math.min(i + CONCURRENCY, listings.length);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const pct = Math.round((progress / listings.length) * 100);
    process.stdout.write(`\r  Progreso ${cat.name}: ${progress}/${listings.length} (${pct}%) - Tiempo: ${elapsed}s`);
  }

  console.log(`\n>> ¡${cat.name} completado en ${Math.round((Date.now() - startTime) / 1000)}s!`);

  // Guardar JSON intermedio de respaldo
  const jsonPath = path.join('scripts', `products_${cat.urlSlug}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(detailed, null, 2), 'utf-8');
  console.log(`  Archivo JSON guardado: ${jsonPath}`);

  return detailed;
}

async function main() {
  const globalStartTime = Date.now();
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║       EXTRACCIÓN MASIVA COMPLETA DE ABASTECE.CO (4 CATEGORÍAS)     ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log(`Inicio: ${new Date().toLocaleString()}`);

  const allCategoryResults = {};
  let totalAllProducts = 0;

  for (const cat of CATEGORIES) {
    const prods = await processCategory(cat);
    allCategoryResults[cat.name] = prods;
    totalAllProducts += prods.length;
  }

  console.log('\n============================================================');
  console.log('GENERANDO ARCHIVO SQL FINAL PARA SUPABASE...');
  console.log('============================================================');

  const sqlLines = [];
  sqlLines.push('-- =====================================================================');
  sqlLines.push('-- SEED DEFINITIVO Y COMPLETO: CATÁLOGO TOTAL DE ABASTECE.CO');
  sqlLines.push(`-- Generado el: ${new Date().toISOString()}`);
  sqlLines.push(`-- Total productos extraídos: ${totalAllProducts}`);
  sqlLines.push('-- PROYECTO: DOTACIONES & SUMINISTROS');
  sqlLines.push('-- =====================================================================');
  sqlLines.push('');
  sqlLines.push('-- 1. Limpieza de productos anteriores (descomenta si deseas vaciar antes):');
  sqlLines.push('-- TRUNCATE TABLE product_features, product_images, order_items, products CASCADE;');
  sqlLines.push('');

  for (const cat of CATEGORIES) {
    const prods = allCategoryResults[cat.name] || [];
    sqlLines.push(`-- ───────────────────────────────────────────────────────────────────`);
    sqlLines.push(`-- CATEGORÍA: ${cat.name.toUpperCase()} (${prods.length} PRODUCTOS)`);
    sqlLines.push(`-- UUID: ${cat.categoryId}`);
    sqlLines.push(`-- ───────────────────────────────────────────────────────────────────`);
    sqlLines.push('');

    // Escribir en bloques de INSERT múltiple para máxima velocidad de ejecución en PostgreSQL/Supabase
    const BATCH_SIZE = 50;
    for (let i = 0; i < prods.length; i += BATCH_SIZE) {
      const batch = prods.slice(i, i + BATCH_SIZE);
      sqlLines.push('INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES');

      const valueRows = batch.map((p, idx) => {
        const name = escapeSQL(p.name);
        const slug = escapeSQL(slugify(p.name, p.ref));
        const desc = escapeSQL(p.description);
        const price = (p.price || 15000).toFixed(2);
        const discount = p.discount || 0;
        const stock = Math.floor(Math.random() * 40) + 15; // stock disponible realista
        const featured = (idx === 0 || idx === 1) ? 'true' : 'false';
        const image = escapeSQL(p.image);

        return `('${cat.categoryId}', '${name}', '${slug}', '${desc}', ${price}, ${discount}, ${stock}, true, ${featured}, '${image}')`;
      });

      sqlLines.push(valueRows.join(',\n'));
      sqlLines.push('ON CONFLICT (slug) DO UPDATE SET');
      sqlLines.push('  name = EXCLUDED.name,');
      sqlLines.push('  description = EXCLUDED.description,');
      sqlLines.push('  price = EXCLUDED.price,');
      sqlLines.push('  discount = EXCLUDED.discount,');
      sqlLines.push('  main_image_url = EXCLUDED.main_image_url;');
      sqlLines.push('');
    }
  }

  const finalSqlPath = path.join('supabase', 'seed_abastece_total.sql');
  fs.writeFileSync(finalSqlPath, sqlLines.join('\n'), 'utf-8');

  const totalMinutes = Math.round((Date.now() - globalStartTime) / 1000 / 60);
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                   ¡EXTRACCIÓN 100% COMPLETADA!                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  for (const cat of CATEGORIES) {
    console.log(`  ✓ ${cat.name}: ${allCategoryResults[cat.name]?.length || 0} productos`);
  }
  console.log(`  ✓ TOTAL GENERAL: ${totalAllProducts} productos`);
  console.log(`  ✓ Tiempo total: ~${totalMinutes} minutos`);
  console.log(`  ✓ Archivo SQL generado: ${finalSqlPath}`);
}

main().catch(console.error);
