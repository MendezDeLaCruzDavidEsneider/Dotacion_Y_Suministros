import fs from 'fs';
import path from 'path';

const CATEGORIES = [
  { name: 'Ferretería', file: 'products_ferreteria.json', sql: 'seed_1_ferreteria.sql', id: 'c2222222-2222-2222-2222-222222222222' },
  { name: 'Dotación', file: 'products_seguridad-botiquin-dotaciones.json', sql: 'seed_2_dotacion.sql', id: 'c1111111-1111-1111-1111-111111111111' },
  { name: 'Aseo', file: 'products_aseo.json', sql: 'seed_3_aseo.sql', id: 'c4444444-4444-4444-4444-444444444444' },
  { name: 'Papelería', file: 'products_papeleria.json', sql: 'seed_4_papeleria.sql', id: 'c3333333-3333-3333-3333-333333333333' },
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

for (const cat of CATEGORIES) {
  const jsonPath = path.join('scripts', cat.file);
  if (!fs.existsSync(jsonPath)) continue;

  const prods = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const lines = [];

  lines.push(`-- =====================================================================`);
  lines.push(`-- MÓDULO: ${cat.name.toUpperCase()} (${prods.length} PRODUCTOS)`);
  lines.push(`-- Categoría UUID: ${cat.id}`);
  lines.push(`-- =====================================================================`);
  lines.push('');

  const BATCH_SIZE = 50;
  for (let i = 0; i < prods.length; i += BATCH_SIZE) {
    const batch = prods.slice(i, i + BATCH_SIZE);
    lines.push('INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES');

    const valueRows = batch.map((p, idx) => {
      const name = escapeSQL(p.name);
      const slug = escapeSQL(slugify(p.name, p.ref));
      const desc = escapeSQL(p.description);
      const price = (p.price || 15000).toFixed(2);
      const discount = p.discount || 0;
      const stock = Math.floor(Math.random() * 40) + 15;
      const featured = (idx === 0 || idx === 1) ? 'true' : 'false';
      const image = escapeSQL(p.image);

      return `('${cat.id}', '${name}', '${slug}', '${desc}', ${price}, ${discount}, ${stock}, true, ${featured}, '${image}')`;
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

  const outPath = path.join('supabase', cat.sql);
  fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
  console.log(`Generated: ${outPath} (${prods.length} productos)`);
}
