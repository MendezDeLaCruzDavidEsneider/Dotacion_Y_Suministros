const BASE_URL = 'https://www.abastece.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function testInternal() {
  const eps = [
    '/buscar_producto.php?q=1293',
    '/buscar_producto.php?ref=1293',
    '/buscar1.php?q=1293',
    '/ia_carrito.php',
    '/carrito_clientes.php',
  ];

  for (const ep of eps) {
    try {
      const resp = await fetch(`${BASE_URL}${ep}`, { headers: HEADERS });
      console.log(`${ep} -> Status: ${resp.status}`);
      if (resp.status === 200) {
        const text = await resp.text();
        console.log(`  Length: ${text.length}`);
        if (text.includes('7.610') || text.includes('9.512') || text.includes('precio')) {
          console.log('  -> CONTAINS PRICES!');
        }
      }
    } catch (e) {
      console.log(`${ep} -> Error: ${e.message}`);
    }
  }
}

testInternal().catch(console.error);
