import fs from 'fs';
import path from 'path';

const src = 'C:\\Users\\USUARIO\\.gemini\\antigravity\\brain\\045e1b68-ae7f-4d63-b856-c6b46e3c1a0b\\media__1791258512437.png';
const dest = path.join(process.cwd(), 'public', 'logo.png');

try {
  fs.copyFileSync(src, dest);
  console.log('Logo copiado con éxito a public/logo.png');
} catch (err) {
  console.error('Error al copiar logo:', err);
}
