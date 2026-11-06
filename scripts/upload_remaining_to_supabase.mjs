import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Leer .env.local
const envLocal = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/);

if (!urlMatch || !keyMatch) {
  console.error('Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function uploadCategory(catName, jsonFile, catId) {
  const jsonPath = path.join('scripts', jsonFile);
  if (!fs.existsSync(jsonPath)) return;

  const prods = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`\nSubiendo ${prods.length} productos de ${catName} a Supabase...`);

  const BATCH_SIZE = 100;
  let totalUploaded = 0;

  for (let i = 0; i < prods.length; i += BATCH_SIZE) {
    const chunk = prods.slice(i, i + BATCH_SIZE);
    const rows = chunk.map((p, idx) => ({
      category_id: catId,
      name: p.name.substring(0, 200),
      slug: slugify(p.name, p.ref),
      description: p.description,
      price: p.price || 15000,
      discount: p.discount || 0,
      stock: Math.floor(Math.random() * 40) + 15,
      active: true,
      featured: i === 0 && (idx === 0 || idx === 1),
      main_image_url: p.image,
    }));

    const { error } = await supabase.from('products').upsert(rows, { onConflict: 'slug' });
    if (error) {
      console.error(`  Error en lote ${i / BATCH_SIZE + 1}: ${error.message}`);
    } else {
      totalUploaded += rows.length;
      process.stdout.write(`\r  Progreso ${catName}: ${totalUploaded}/${prods.length} subidos`);
    }
  }
  console.log(`\n>> ¡${catName} completado con éxito!`);
}

async function main() {
  console.log('--- INSERCIÓN DIRECTA EN SUPABASE ---');
  await uploadCategory('Aseo', 'products_aseo.json', 'c4444444-4444-4444-4444-444444444444');
  await uploadCategory('Papelería', 'products_papeleria.json', 'c3333333-3333-3333-3333-333333333333');
  console.log('\n¡Inserción de Aseo y Papelería completada al 100%!');
}

main().catch(console.error);
