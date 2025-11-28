/**
 * Script para configurar permisos públicos en Strapi
 * Ejecutar con: node scripts/setup-permissions.js
 */

const http = require('http');

// Configuración de permisos a habilitar para el rol Public
const PERMISSIONS_CONFIG = {
  // Content Types del sistema
  'api::cliente.cliente': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::vehiculo.vehiculo': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::mecenico.mecenico': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::orden-de-trabajo.orden-de-trabajo': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::repuesto.repuesto': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::factura.factura': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::bitacora.bitacora': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::presupuesto.presupuesto': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::servicio.servicio': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::zona.zona': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::solicitud-de-repuesto.solicitud-de-repuesto': ['find', 'findOne', 'create', 'update', 'delete'],
};

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function setupPermissions() {
  console.log('🔧 Configurando permisos públicos en Strapi...\n');

  try {
    // Este endpoint no está disponible sin autenticación admin
    // Strapi requiere un token de admin para modificar permisos
    
    console.log('⚠️  Los permisos de Strapi deben configurarse manualmente desde el Admin Panel.');
    console.log('\n📋 Instrucciones:\n');
    console.log('1. Abre http://localhost:1337/admin');
    console.log('2. Ve a Settings → Users & Permissions Plugin → Roles → Public');
    console.log('3. Habilita los siguientes permisos:\n');
    
    for (const [contentType, actions] of Object.entries(PERMISSIONS_CONFIG)) {
      const name = contentType.split('.').pop();
      console.log(`   ✅ ${name}: ${actions.join(', ')}`);
    }
    
    console.log('\n4. Click en "Save" para guardar los cambios.');
    console.log('\n💡 Tip: Puedes seleccionar "Select all" para cada content-type.\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Verificar permisos actuales
async function checkPermissions() {
  console.log('🔍 Verificando permisos actuales...\n');
  
  const endpoints = [
    '/api/servicios',
    '/api/facturas', 
    '/api/presupuestos',
    '/api/solicitud-de-repuestos',
    '/api/bitacoras',
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(endpoint);
      if (result.error) {
        console.log(`❌ ${endpoint}: ${result.error.message}`);
      } else {
        console.log(`✅ ${endpoint}: OK (${result.data?.length || 0} registros)`);
      }
    } catch (e) {
      console.log(`❌ ${endpoint}: Error de conexión`);
    }
  }
}

async function main() {
  await checkPermissions();
  console.log('\n---\n');
  await setupPermissions();
}

main();
