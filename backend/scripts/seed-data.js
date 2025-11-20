/**
 * Script para cargar datos de prueba en la base de datos de Strapi
 * Uso: node scripts/seed-data.js
 */

const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, STRAPI_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          resolve({ statusCode: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify({ data }));
    req.end();
  });
}

async function seedData() {
  console.log('🌱 Iniciando carga de datos de prueba...\n');

  try {
    // 1. Crear Zonas
    console.log('📍 Creando zonas...');
    const zones = [
      { nombre: 'Zona A - Revisión' },
      { nombre: 'Zona B - Reparación Motor' },
      { nombre: 'Zona C - Suspensión' },
      { nombre: 'Zona D - Electricidad' },
    ];

    const zoneIds = [];
    for (const zone of zones) {
      const res = await makeRequest('POST', '/api/zonas', zone);
      const id = res.data?.documentId || res.data?.id || res.id;
      zoneIds.push(id);
      console.log(`  ✓ ${zone.nombre} (ID: ${id})`);
    }

    // 2. Crear Mecánicos
    console.log('\n👨‍🔧 Creando mecánicos...');
    const mechanics = [
      {
        nombre: 'Juan',
        apellido: 'García',
        email: 'juan@taller.com',
        especialidad: 'Motor y Transmisión',
        estado: 'disponible',
        zona: zoneIds[1]
      },
      {
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos@taller.com',
        especialidad: 'Suspensión y Dirección',
        estado: 'disponible',
        zona: zoneIds[2]
      },
      {
        nombre: 'Miguel',
        apellido: 'Rodríguez',
        email: 'miguel@taller.com',
        especialidad: 'Electricidad',
        estado: 'disponible',
        zona: zoneIds[3]
      },
      {
        nombre: 'Pedro',
        apellido: 'Martínez',
        email: 'pedro@taller.com',
        especialidad: 'Diagnóstico',
        estado: 'disponible',
        zona: zoneIds[0]
      },
    ];

    const mechanicIds = [];
    for (const mechanic of mechanics) {
      const res = await makeRequest('POST', '/api/mecanicos', mechanic);
      const id = res.data?.documentId || res.data?.id || res.id;
      mechanicIds.push(id);
      console.log(`  ✓ ${mechanic.nombre} ${mechanic.apellido} - ${mechanic.especialidad}`);
    }

    // 3. Crear Clientes
    console.log('\n👤 Creando clientes...');
    const clients = [
      {
        nombre: 'Andrés',
        apellido: 'Fernández',
        email: 'andres@email.com',
        telefono: '555-0101',
        ciudad: 'Barcelona'
      },
      {
        nombre: 'María',
        apellido: 'González',
        email: 'maria@email.com',
        telefono: '555-0102',
        ciudad: 'Madrid'
      },
      {
        nombre: 'Roberto',
        apellido: 'Sánchez',
        email: 'roberto@email.com',
        telefono: '555-0103',
        ciudad: 'Valencia'
      },
      {
        nombre: 'Laura',
        apellido: 'Díaz',
        email: 'laura@email.com',
        telefono: '555-0104',
        ciudad: 'Sevilla'
      },
      {
        nombre: 'Francisco',
        apellido: 'Moreno',
        email: 'francisco@email.com',
        telefono: '555-0105',
        ciudad: 'Bilbao'
      },
    ];

    const clientIds = [];
    for (const client of clients) {
      const res = await makeRequest('POST', '/api/clientes', client);
      const id = res.data?.documentId || res.data?.id || res.id;
      clientIds.push(id);
      console.log(`  ✓ ${client.nombre} ${client.apellido}`);
    }

    // 4. Crear Vehículos
    console.log('\n🚗 Creando vehículos...');
    const vehicles = [
      { marca: 'Toyota', modelo: 'Corolla', ano: 2020, patente: 'ABC123', vin: 'VIN001', cliente: clientIds[0] },
      { marca: 'Ford', modelo: 'Focus', ano: 2019, patente: 'DEF456', vin: 'VIN002', cliente: clientIds[1] },
      { marca: 'Volkswagen', modelo: 'Golf', ano: 2021, patente: 'GHI789', vin: 'VIN003', cliente: clientIds[2] },
      { marca: 'BMW', modelo: '320i', ano: 2018, patente: 'JKL012', vin: 'VIN004', cliente: clientIds[3] },
      { marca: 'Mercedes', modelo: 'C200', ano: 2022, patente: 'MNO345', vin: 'VIN005', cliente: clientIds[4] },
      { marca: 'Audi', modelo: 'A3', ano: 2020, patente: 'PQR678', vin: 'VIN006', cliente: clientIds[0] },
    ];

    const vehicleIds = [];
    for (const vehicle of vehicles) {
      const res = await makeRequest('POST', '/api/vehiculos', vehicle);
      const id = res.data?.documentId || res.data?.id || res.id;
      vehicleIds.push(id);
      console.log(`  ✓ ${vehicle.marca} ${vehicle.modelo} (${vehicle.patente})`);
    }

    // 5. Crear Repuestos
    console.log('\n🔧 Creando repuestos...');
    const parts = [
      { nombre: 'Filtro de Aire', sku: 'FA001', precio: 25.50, stock: 45, stock_minimo: 10, proveedor: 'AutoParts SA', ubicacion: 'Pasillo A-1' },
      { nombre: 'Filtro de Aceite', sku: 'FO001', precio: 18.75, stock: 60, stock_minimo: 15, proveedor: 'AutoParts SA', ubicacion: 'Pasillo A-2' },
      { nombre: 'Pastillas de Freno', sku: 'PF001', precio: 85.00, stock: 30, stock_minimo: 8, proveedor: 'Brembo', ubicacion: 'Pasillo B-1' },
      { nombre: 'Discos de Freno', sku: 'DF001', precio: 120.00, stock: 22, stock_minimo: 5, proveedor: 'Brembo', ubicacion: 'Pasillo B-2' },
      { nombre: 'Amortiguador Delantero', sku: 'AD001', precio: 250.00, stock: 12, stock_minimo: 4, proveedor: 'Suspension Pro', ubicacion: 'Pasillo C-1' },
      { nombre: 'Batería 12V', sku: 'BA001', precio: 95.00, stock: 8, stock_minimo: 3, proveedor: 'Energizer', ubicacion: 'Pasillo D-1' },
      { nombre: 'Alternador', sku: 'AL001', precio: 350.00, stock: 4, stock_minimo: 2, proveedor: 'Bosch', ubicacion: 'Pasillo D-2' },
      { nombre: 'Motor de Arranque', sku: 'MA001', precio: 320.00, stock: 5, stock_minimo: 2, proveedor: 'Bosch', ubicacion: 'Pasillo D-3' },
      { nombre: 'Bomba de Agua', sku: 'BM001', precio: 180.00, stock: 6, stock_minimo: 3, proveedor: 'Cooling Systems', ubicacion: 'Pasillo E-1' },
      { nombre: 'Correa de Distribución', sku: 'CD001', precio: 220.00, stock: 3, stock_minimo: 2, proveedor: 'Gates', ubicacion: 'Pasillo E-2' },
    ];

    const partIds = [];
    for (const part of parts) {
      const res = await makeRequest('POST', '/api/repuestos', part);
      const id = res.data?.documentId || res.data?.id || res.id;
      partIds.push(id);
      console.log(`  ✓ ${part.nombre} (Stock: ${part.stock})`);
    }

    // 6. Crear Órdenes de Trabajo
    console.log('\n📋 Creando órdenes de trabajo...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const orders = [
      {
        descripcion: 'Cambio de aceite y filtros',
        estado: 'ingresado',
        fecha_ingreso: today.toISOString().split('T')[0],
        fecha_estimada: tomorrow.toISOString().split('T')[0],
        cliente: clientIds[0],
        vehiculo: vehicleIds[0],
        mecanico: mechanicIds[3],
        zona: zoneIds[0],
        fecha_inicio_planificada: new Date(today.getTime() + 1*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(today.getTime() + 3*60*60*1000).toISOString(),
      },
      {
        descripcion: 'Revisión de frenos y cambio de pastillas',
        estado: 'en_diagnostico',
        fecha_ingreso: today.toISOString().split('T')[0],
        fecha_estimada: tomorrow.toISOString().split('T')[0],
        cliente: clientIds[1],
        vehiculo: vehicleIds[1],
        mecanico: mechanicIds[0],
        zona: zoneIds[1],
        fecha_inicio_planificada: new Date(today.getTime() + 2*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(today.getTime() + 5*60*60*1000).toISOString(),
      },
      {
        descripcion: 'Reparación de suspensión',
        estado: 'en_reparacion',
        fecha_ingreso: new Date(today.getTime() - 2*24*60*60*1000).toISOString().split('T')[0],
        fecha_estimada: tomorrow.toISOString().split('T')[0],
        cliente: clientIds[2],
        vehiculo: vehicleIds[2],
        mecanico: mechanicIds[1],
        zona: zoneIds[2],
        fecha_inicio_planificada: new Date(today.getTime() + 3*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(today.getTime() + 6*60*60*1000).toISOString(),
      },
      {
        descripcion: 'Reparación de sistema eléctrico',
        estado: 'en_reparacion',
        fecha_ingreso: new Date(today.getTime() - 1*24*60*60*1000).toISOString().split('T')[0],
        fecha_estimada: new Date(tomorrow.getTime() + 1*24*60*60*1000).toISOString().split('T')[0],
        cliente: clientIds[3],
        vehiculo: vehicleIds[3],
        mecanico: mechanicIds[2],
        zona: zoneIds[3],
        fecha_inicio_planificada: new Date(today.getTime() + 4*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(today.getTime() + 7*60*60*1000).toISOString(),
      },
      {
        descripcion: 'Diagnóstico general y afinamiento',
        estado: 'ingresado',
        fecha_ingreso: today.toISOString().split('T')[0],
        fecha_estimada: tomorrow.toISOString().split('T')[0],
        cliente: clientIds[4],
        vehiculo: vehicleIds[4],
        mecanico: null,
        zona: null,
        fecha_inicio_planificada: null,
        fecha_fin_planificada: null,
      },
    ];

    for (const order of orders) {
      const res = await makeRequest('POST', '/api/orden-de-trabajos', order);
      console.log(`  ✓ Orden para ${order.descripcion}`);
    }

    console.log('\n✅ ¡Datos de prueba cargados exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${zones.length} zonas de trabajo`);
    console.log(`   - ${mechanics.length} mecánicos`);
    console.log(`   - ${clients.length} clientes`);
    console.log(`   - ${vehicles.length} vehículos`);
    console.log(`   - ${parts.length} repuestos`);
    console.log(`   - ${orders.length} órdenes de trabajo`);
    console.log('\n🌐 Accede a http://localhost:1337/admin para ver los datos\n');

  } catch (error) {
    console.error('❌ Error cargando datos:', error.message);
    process.exit(1);
  }
}

seedData();
