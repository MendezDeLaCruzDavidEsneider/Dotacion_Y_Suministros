import fs from 'fs';
import path from 'path';

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

function splitCategoryIntoParts(catName, jsonFile, catId, partsCount, prefix) {
  const jsonPath = path.join('scripts', jsonFile);
  if (!fs.existsSync(jsonPath)) return;

  const prods = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const chunkSize = Math.ceil(prods.length / partsCount);

  for (let part = 1; part <= partsCount; part++) {
    const startIdx = (part - 1) * chunkSize;
    const endIdx = Math.min(startIdx + chunkSize, prods.length);
    const chunk = prods.slice(startIdx, endIdx);

    const lines = [];
    lines.push(`-- =====================================================================`);
    lines.push(`-- ${catName.toUpperCase()} - PARTE ${part} DE ${partsCount} (${chunk.length} productos: ${startIdx + 1} al ${endIdx})`);
    lines.push(`-- Categoría UUID: ${catId}`);
    lines.push(`-- =====================================================================`);
    lines.push('');
    lines.push('ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount NUMERIC(5, 2) DEFAULT 0;');
    lines.push('');

    const BATCH_SIZE = 50;
    for (let i = 0; i < chunk.length; i += BATCH_SIZE) {
      const batch = chunk.slice(i, i + BATCH_SIZE);
      lines.push('INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES');

      const valueRows = batch.map((p, idx) => {
        const name = escapeSQL(p.name);
        const slug = escapeSQL(slugify(p.name, p.ref));
        const desc = escapeSQL(p.description);
        const price = (p.price || 15000).toFixed(2);
        const discount = p.discount || 0;
        const stock = Math.floor(Math.random() * 40) + 15;
        const featured = (part === 1 && (idx === 0 || idx === 1)) ? 'true' : 'false';
        const image = escapeSQL(p.image);

        return `('${catId}', '${name}', '${slug}', '${desc}', ${price}, ${discount}, ${stock}, true, ${featured}, '${image}')`;
      });

      lines.push(valueRows.join(',\n'));
      lines.push('ON CONFLICT (slug) DO UPDATE SET');
      lines.push('  name = EXCLUDED.name,');
      lines.push('  description = EXCLUDED.description,');
      lines.push('  price = EXCLUDED.price,');
      lines.push('  discount = EXCLUDED.discount,');
      lines.push('  main_image_url = EXCLUDED.main_image_url;');
      lines.push('');
    }

    const outPath = path.join('supabase', `${prefix}_parte_${part}.sql`);
    fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
    const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`Created: ${outPath} -> ${chunk.length} productos (${sizeKB} KB)`);
  }
}

// Aseo (1080 productos) -> 3 partes (~360 productos / ~340 KB c/u)
splitCategoryIntoParts('Aseo', 'products_aseo.json', 'c4444444-4444-4444-4444-444444444444', 3, 'seed_3_aseo');

// Papelería (1680 productos) -> 4 partes (~420 productos / ~370 KB c/u)
splitCategoryIntoParts('Papelería', 'products_papeleria.json', 'c3333333-3333-3333-3333-333333333333', 4, 'seed_4_papeleria');
