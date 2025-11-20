const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/mecanico/bitacora_repuestos.astro',
  'src/pages/mecanico/detalle_orden_trabajo.astro',
  'src/pages/encargado/detalles_de_orden.astro',
  'src/pages/encargado/gen_factura.astro',
  'src/pages/encargado/marc_orden.astro',
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace anio with ano (for database field)
    content = content.replace(/\.anio/g, '.ano');
    content = content.replace(/anio:/g, 'ano:');
    content = content.replace(/\banio\s*=/g, 'ano =');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${file}`);
  }
});

console.log('\\n✅ All files corrected!');
