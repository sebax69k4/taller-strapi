import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/pages/recepcion/crear_vehiculo.astro',
  'src/pages/mecanico/dash_mec.astro',
  'src/pages/mecanico/bitacora_repuestos.astro',
  'src/pages/mecanico/desc_stock.astro',
  'src/pages/mecanico/detalle_orden_trabajo.astro',
  'src/pages/encargado/detalles_de_orden.astro',
  'src/pages/encargado/trabajos_en_curso.astro',
  'src/pages/encargado/marc_orden.astro',
  'src/pages/encargado/gen_factura.astro',
  'src/pages/encargado/disp_mec_zonas.astro',
  'src/pages/encargado/disp_mec.astro',
  'src/pages/encargado/dash_enc.astro',
  'src/pages/encargado/asig_orden.astro',
  'src/pages/encargado/asignar_orden_zona.astro',
  'src/pages/encargado/alert_stock.astro'
];

let updated = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  No existe: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar import incorrecto
  const before = content;
  content = content.replace("from '../lib/strapi'", "from '../../lib/strapi'");
  
  if (content !== before) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Actualizado: ${file}`);
    updated++;
  } else {
    console.log(`- Sin cambios: ${file}`);
  }
});

console.log(`\n✅ Total de archivos actualizados: ${updated}`);
