const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testEndpoints() {
  const endpoints = [
    '/api/productos',
    '/api/precios',
    '/api/productos.php',
    '/precios.php',
    '/get_precio.php?id=1293',
    '/get_producto.php?id=1293',
    '/ajax_precio.php?id=1293',
    '/agregar_carrito.php?id=1293',
    '/cart.php',
    '/ver_carrito.php',
    '/sarita/05_chat.php',
    '/sitemap.xml',
    '/robots.txt',
  ];

  for (const ep of endpoints) {
    try {
      const resp = await fetch(`${BASE_URL}${ep}`, { headers: HEADERS });
      console.log(`${ep} -> Status: ${resp.status}`);
      if (resp.status === 200) {
        const text = await resp.text();
        console.log(`  Length: ${text.length}, Preview: ${text.substring(0, 100).replace(/\s+/g, ' ')}`);
      }
    } catch (e) {
      console.log(`${ep} -> Error: ${e.message}`);
    }
  }
}

testEndpoints().catch(console.error);
