import fs from 'fs';

let code = fs.readFileSync('src/app/page.tsx', 'utf-8');

const regex = /const \[categories, allProducts\] = await Promise\.all\(\[\s*getCategories\(\),\s*getProducts\(\),\s*\]\);/;

const addition = `const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // Extraer las primeras 6 imágenes reales de productos para el carrusel de cada categoría
  const categoryPreviewsMap = categories.reduce((acc, cat) => {
    acc[cat.id] = allProducts
      .filter((p) => p.category_id === cat.id && p.main_image_url)
      .slice(0, 6)
      .map((p) => ({ image: p.main_image_url || '', name: p.name }));
    return acc;
  }, {} as Record<string, { image: string; name: string }[]>);`;

code = code.replace(regex, addition);
code = code.replace(
  '<CategoryCard key={category.id} category={category} />',
  '<CategoryCard key={category.id} category={category} previewImages={categoryPreviewsMap[category.id]} />'
);

fs.writeFileSync('src/app/page.tsx', code, 'utf-8');
console.log('src/app/page.tsx updated successfully');
