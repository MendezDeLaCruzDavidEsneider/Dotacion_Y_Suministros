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

const CATEGORIES = [
  { name: 'Ferretería', file: 'products_ferreteria.json', id: 'c2222222-2222-2222-2222-222222222222' },
  { name: 'Dotación', file: 'products_seguridad-botiquin-dotaciones.json', id: 'c1111111-1111-1111-1111-111111111111' },
  { name: 'Aseo', file: 'products_aseo.json', id: 'c4444444-4444-4444-4444-444444444444' },
  { name: 'Papelería', file: 'products_papeleria.json', id: 'c3333333-3333-3333-3333-333333333333' },
];

async function uploadCategory(cat) {
  const jsonPath = path.join('scripts', cat.file);
  if (!fs.existsSync(jsonPath)) {
    console.error(`No existe el archivo ${jsonPath}`);
    return;
  }

  const prods = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`\n============================================================`);
  console.log(`Subiendo ${prods.length} productos de ${cat.name} a Supabase...`);
  console.log(`============================================================`);

  const BATCH_SIZE = 50; // 50 por lote para evitar timeouts de red
  let totalUploaded = 0;
  let errors = 0;

  for (let i = 0; i < prods.length; i += BATCH_SIZE) {
    const chunk = prods.slice(i, i + BATCH_SIZE);
    const rows = chunk.map((p, idx) => ({
      category_id: cat.id,
      name: p.name.substring(0, 200),
      slug: slugify(p.name, p.ref),
      description: p.description || `${p.name}. Suministro corporativo disponible en Dotaciones & Suministros.`,
      price: p.price || 15000,
      discount: p.discount || 0,
      stock: Math.floor(Math.random() * 40) + 15,
      active: true,
      featured: i === 0 && (idx === 0 || idx === 1),
      main_image_url: p.image,
    }));

    const { error } = await supabase.from('products').upsert(rows, { onConflict: 'slug' });
    if (error) {
      console.error(`\n  Error en lote ${i / BATCH_SIZE + 1}: ${error.message}`);
      errors++;
    } else {
      totalUploaded += rows.length;
      const pct = Math.round((totalUploaded / prods.length) * 100);
      process.stdout.write(`\r  Progreso ${cat.name}: ${totalUploaded}/${prods.length} (${pct}%)`);
    }
  }

  console.log(`\n>> ${cat.name}: ${totalUploaded} productos sincronizados con éxito. (${errors} errores)`);
  return totalUploaded;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║        SINCRONIZACIÓN DIRECTA EN SUPABASE CON SERVICE ROLE         ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log(`URL de Supabase: ${supabaseUrl}`);

  let grandTotal = 0;
  for (const cat of CATEGORIES) {
    const count = await uploadCategory(cat);
    grandTotal += (count || 0);
  }

  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log(`║ ¡FINALIZADO! Total de ${grandTotal} productos cargados en Supabase. ║`);
  console.log('╚════════════════════════════════════════════════════════════════════╝');
}

main().catch(console.error);
