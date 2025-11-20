import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/pages/recepcion/dash_recep.astro',
  'src/pages/recepcion/crear_vehiculo.astro',
  'src/pages/recepcion/crear_orden.astro',
  'src/pages/mecanico/detalle_orden_trabajo.astro',
  'src/pages/mecanico/desc_stock.astro',
  'src/pages/mecanico/dash_mec.astro',
  'src/pages/mecanico/bitacora_repuestos.astro',
  'src/pages/encargado/marc_orden.astro',
  'src/pages/encargado/trabajos_en_curso.astro',
  'src/pages/encargado/gen_factura.astro',
  'src/pages/encargado/disp_mec_zonas.astro',
  'src/pages/encargado/disp_mec.astro',
  'src/pages/encargado/detalles_de_orden.astro',
  'src/pages/encargado/dash_enc.astro',
  'src/pages/encargado/asig_orden.astro',
  'src/pages/encargado/asignar_orden_zona.astro',
  'src/pages/encargado/alert_stock.astro',
  'src/pages/logout.astro',
  'src/pages/acceso-denegado.astro'
];

let updated = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  No existe: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar si ya tiene prerender
  if (content.includes('export const prerender')) {
    console.log(`✓ Ya tiene prerender: ${file}`);
    return;
  }
  
  // Agregar después de la primera línea ---
  const lines = content.split('\n');
  if (lines[0] === '---') {
    lines.splice(1, 0, 'export const prerender = false;');
    content = lines.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Actualizado: ${file}`);
    updated++;
  } else {
    console.log(`⚠️  No tiene formato correcto: ${file}`);
  }
});

console.log(`\n✅ Total de archivos actualizados: ${updated}`);
