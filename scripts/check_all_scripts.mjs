import fs from 'fs';

const html = fs.readFileSync('scripts/cat_ferreteria.html', 'utf-8');

// Find all script tags
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
console.log(`Found ${scripts?.length} script tags`);

scripts?.forEach((s, i) => {
  if (s.includes('src=')) {
    const src = s.match(/src=["']([^"']+)["']/i);
    console.log(`Script [${i}] src: ${src ? src[1] : 'unknown'}`);
  } else {
    console.log(`Script [${i}] inline length: ${s.length}`);
    if (s.includes('precio') || s.includes('price') || s.includes('stock') || s.includes('b2b') || s.includes('premium')) {
      console.log(`  -> mentions keywords!`);
    }
  }
});
