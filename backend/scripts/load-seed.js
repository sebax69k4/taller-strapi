const http = require('http');

const BASE_URL = 'http://localhost:1337/api';

async function post(endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`${res.statusCode}: ${body}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ data }));
    req.end();
  });
}

async function seedData() {
  console.log('🌱 Iniciando carga de datos...\n');
  
  try {
    // Zonas
    console.log('📍 Creando zonas...');
    const zones = [];
    for (const nombre of ['Zona A - Revisión', 'Zona B - Motor', 'Zona C - Suspensión', 'Zona D - Electricidad']) {
      const res = await post('zonas', { nombre });
      zones.push(res.data.id);
      console.log(`  ✓ ${nombre}`);
    }

    // Clientes
    console.log('\n👤 Creando clientes...');
    const clients = [
      { nombre: 'Andrés', apellido: 'Fernández', email: 'andres@email.com', telefono: '555-0101' },
      { nombre: 'María', apellido: 'González', email: 'maria@email.com', telefono: '555-0102' },
      { nombre: 'Roberto', apellido: 'Sánchez', email: 'roberto@email.com', telefono: '555-0103' },
      { nombre: 'Laura', apellido: 'Díaz', email: 'laura@email.com', telefono: '555-0104' },
      { nombre: 'Francisco', apellido: 'Moreno', email: 'francisco@email.com', telefono: '555-0105' },
    ];
    const clientIds = [];
    for (const client of clients) {
      const res = await post('clientes', client);
      clientIds.push(res.data.id);
      console.log(`  ✓ ${client.nombre}`);
    }

    // Vehículos
    console.log('\n🚗 Creando vehículos...');
    const vehicles = [
      { marca: 'Toyota', modelo: 'Corolla', ano: 2020, patente: 'ABC123', cliente: clientIds[0] },
      { marca: 'Ford', modelo: 'Focus', ano: 2019, patente: 'DEF456', cliente: clientIds[1] },
      { marca: 'Volkswagen', modelo: 'Golf', ano: 2021, patente: 'GHI789', cliente: clientIds[2] },
      { marca: 'BMW', modelo: '320i', ano: 2018, patente: 'JKL012', cliente: clientIds[3] },
      { marca: 'Mercedes', modelo: 'C200', ano: 2022, patente: 'MNO345', cliente: clientIds[4] },
    ];
    const vehicleIds = [];
    for (const vehicle of vehicles) {
      const res = await post('vehiculos', vehicle);
      vehicleIds.push(res.data.id);
      console.log(`  ✓ ${vehicle.marca} ${vehicle.modelo}`);
    }

    // Mecánicos
    console.log('\n👨‍🔧 Creando mecánicos...');
    const mechanics = [
      { nombre: 'Juan', apellido: 'García', email: 'juan@taller.com', especialidad: 'Motor', zona: zones[1] },
      { nombre: 'Carlos', apellido: 'López', email: 'carlos@taller.com', especialidad: 'Suspensión', zona: zones[2] },
      { nombre: 'Miguel', apellido: 'Rodríguez', email: 'miguel@taller.com', especialidad: 'Electricidad', zona: zones[3] },
      { nombre: 'Pedro', apellido: 'Martínez', email: 'pedro@taller.com', especialidad: 'Diagnóstico', zona: zones[0] },
    ];
    const mechanicIds = [];
    for (const mech of mechanics) {
      const res = await post('mecanicos', mech);
      mechanicIds.push(res.data.id);
      console.log(`  ✓ ${mech.nombre}`);
    }

    // Repuestos
    console.log('\n🔧 Creando repuestos...');
    const parts = [
      { nombre: 'Filtro Aire', sku: 'FA001', precio: 25.50, stock: 45, stock_minimo: 10 },
      { nombre: 'Filtro Aceite', sku: 'FO001', precio: 18.75, stock: 60, stock_minimo: 15 },
      { nombre: 'Pastillas Freno', sku: 'PF001', precio: 85.00, stock: 30, stock_minimo: 8 },
      { nombre: 'Discos Freno', sku: 'DF001', precio: 120.00, stock: 22, stock_minimo: 5 },
      { nombre: 'Amortiguador', sku: 'AD001', precio: 250.00, stock: 12, stock_minimo: 4 },
      { nombre: 'Batería 12V', sku: 'BA001', precio: 95.00, stock: 8, stock_minimo: 3 },
    ];
    for (const part of parts) {
      await post('repuestos', part);
      console.log(`  ✓ ${part.nombre}`);
    }

    // Órdenes de Trabajo
    console.log('\n📋 Creando órdenes de trabajo...');
    const now = new Date();
    const orders = [
      { descripcion: 'Cambio aceite', estado: 'ingresado', cliente: clientIds[0], vehiculo: vehicleIds[0], mecanico: mechanicIds[3], zona: zones[0], fecha_inicio_planificada: new Date(now.getTime() + 1*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString() },
      { descripcion: 'Revisión frenos', estado: 'en_diagnostico', cliente: clientIds[1], vehiculo: vehicleIds[1], mecanico: mechanicIds[0], zona: zones[1], fecha_inicio_planificada: new Date(now.getTime() + 2*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 5*60*60*1000).toISOString() },
      { descripcion: 'Reparación suspensión', estado: 'en_reparacion', cliente: clientIds[2], vehiculo: vehicleIds[2], mecanico: mechanicIds[1], zona: zones[2], fecha_inicio_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 6*60*60*1000).toISOString() },
      { descripcion: 'Reparación eléctrica', estado: 'en_reparacion', cliente: clientIds[3], vehiculo: vehicleIds[3], mecanico: mechanicIds[2], zona: zones[3], fecha_inicio_planificada: new Date(now.getTime() + 4*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 7*60*60*1000).toISOString() },
      { descripcion: 'Diagnóstico general', estado: 'ingresado', cliente: clientIds[4], vehiculo: vehicleIds[4] },
    ];
    for (const order of orders) {
      await post('orden-de-trabajos', order);
      console.log(`  ✓ ${order.descripcion}`);
    }

    console.log('\n✅ ¡Datos cargados!\n');
    console.log('📊 Resumen: 4 zonas, 5 clientes, 5 vehículos, 4 mecánicos, 6 repuestos, 5 órdenes');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
