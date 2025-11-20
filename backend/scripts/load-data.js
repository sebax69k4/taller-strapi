#!/usr/bin/env node
const http = require('http');
const querystring = require('querystring');

function httpRequest(hostname, port, path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      });
      res.on('end', () => {
        try {
          if (!body) {
            reject(new Error(`Empty response. Status: ${res.statusCode}`));
            return;
          }
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}. Body: ${body.substring(0, 200)}`));
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

async function main() {
  console.log('🌱 Iniciando carga de datos...\n');
  
  try {
    // CLIENTES
    console.log('👤 Cargando clientes...');
    const clients = [
      { nombre: 'Andrés', apellido: 'Fernández', email: 'andres@email.com', telefono: '555-0101', rut: '12345678-9' },
      { nombre: 'María', apellido: 'González', email: 'maria@email.com', telefono: '555-0102', rut: '98765432-1' },
      { nombre: 'Roberto', apellido: 'Sánchez', email: 'roberto@email.com', telefono: '555-0103', rut: '11111111-1' },
      { nombre: 'Laura', apellido: 'Díaz', email: 'laura@email.com', telefono: '555-0104', rut: '22222222-2' },
      { nombre: 'Francisco', apellido: 'Moreno', email: 'francisco@email.com', telefono: '555-0105', rut: '33333333-3' }
    ];
    
    const clientIds = [];
    for (const client of clients) {
      try {
        const res = await httpRequest('localhost', 1337, '/api/clientes', 'POST', { data: client });
        if (res.body.data && res.body.data.id) {
          clientIds.push(res.body.data.id);
          console.log(`  ✓ ${client.nombre}`);
        } else {
          console.log(`  ✗ ${client.nombre}: ${res.body.error?.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(`  ✗ ${client.nombre}: ${err.message}`);
      }
    }
    console.log(`  Total: ${clientIds.length}\n`);

    // VEHÍCULOS
    console.log('🚗 Cargando vehículos...');
    const vehicles = [
      { marca: 'Toyota', modelo: 'Corolla', ano: 2020, patente: 'ABC123', vin: 'VIN001', cliente: clientIds[0] },
      { marca: 'Ford', modelo: 'Focus', ano: 2019, patente: 'DEF456', vin: 'VIN002', cliente: clientIds[1] },
      { marca: 'Volkswagen', modelo: 'Golf', ano: 2021, patente: 'GHI789', vin: 'VIN003', cliente: clientIds[2] },
      { marca: 'BMW', modelo: '320i', ano: 2018, patente: 'JKL012', vin: 'VIN004', cliente: clientIds[3] },
      { marca: 'Mercedes', modelo: 'C200', ano: 2022, patente: 'MNO345', vin: 'VIN005', cliente: clientIds[4] }
    ];
    
    const vehicleIds = [];
    for (const vehicle of vehicles) {
      try {
        const res = await httpRequest('localhost', 1337, '/api/vehiculos', 'POST', { data: vehicle });
        if (res.body.data && res.body.data.id) {
          vehicleIds.push(res.body.data.id);
          console.log(`  ✓ ${vehicle.marca} ${vehicle.modelo}`);
        }
      } catch (err) {
        console.error(`  ✗ ${vehicle.marca}: ${err.message}`);
      }
    }
    console.log(`  Total: ${vehicleIds.length}\n`);

    // ZONAS (Get existing)
    console.log('📍 Obteniendo zonas...');
    const zonesRes = await httpRequest('localhost', 1337, '/api/zonas', 'GET');
    const zones = zonesRes.body.data.map(z => z.id);
    console.log(`  ✓ ${zones.length} zonas\n`);

    // MECÁNICOS
    console.log('👨‍🔧 Cargando mecánicos...');
    const mechanics = [
      { nombre: 'Juan', apellido: 'García', email: 'juan@taller.com', especialidad: 'Motor', zona: zones[1] },
      { nombre: 'Carlos', apellido: 'López', email: 'carlos@taller.com', especialidad: 'Suspensión', zona: zones[2] },
      { nombre: 'Miguel', apellido: 'Rodríguez', email: 'miguel@taller.com', especialidad: 'Electricidad', zona: zones[3] },
      { nombre: 'Pedro', apellido: 'Martínez', email: 'pedro@taller.com', especialidad: 'Diagnóstico', zona: zones[0] }
    ];
    
    const mechanicIds = [];
    for (const mech of mechanics) {
      try {
        const res = await httpRequest('localhost', 1337, '/api/mecanicos', 'POST', { data: mech });
        if (res.body.data && res.body.data.id) {
          mechanicIds.push(res.body.data.id);
          console.log(`  ✓ ${mech.nombre}`);
        }
      } catch (err) {
        console.error(`  ✗ ${mech.nombre}: ${err.message}`);
      }
    }
    console.log(`  Total: ${mechanicIds.length}\n`);

    // REPUESTOS
    console.log('🔧 Cargando repuestos...');
    const parts = [
      { nombre: 'Filtro de Aire', sku: 'FA001', precio: 25.50, stock: 45, stock_minimo: 10 },
      { nombre: 'Filtro de Aceite', sku: 'FO001', precio: 18.75, stock: 60, stock_minimo: 15 },
      { nombre: 'Pastillas de Freno', sku: 'PF001', precio: 85.00, stock: 30, stock_minimo: 8 },
      { nombre: 'Discos de Freno', sku: 'DF001', precio: 120.00, stock: 22, stock_minimo: 5 },
      { nombre: 'Amortiguador', sku: 'AD001', precio: 250.00, stock: 12, stock_minimo: 4 },
      { nombre: 'Batería 12V', sku: 'BA001', precio: 95.00, stock: 8, stock_minimo: 3 },
      { nombre: 'Alternador', sku: 'AL001', precio: 350.00, stock: 4, stock_minimo: 2 },
      { nombre: 'Motor de Arranque', sku: 'MA001', precio: 320.00, stock: 5, stock_minimo: 2 },
      { nombre: 'Bomba de Agua', sku: 'BM001', precio: 180.00, stock: 6, stock_minimo: 3 },
      { nombre: 'Correa de Distribución', sku: 'CD001', precio: 220.00, stock: 3, stock_minimo: 2 }
    ];
    
    let partCount = 0;
    for (const part of parts) {
      try {
        await httpRequest('localhost', 1337, '/api/repuestos', 'POST', { data: part });
        console.log(`  ✓ ${part.nombre}`);
        partCount++;
      } catch (err) {
        console.error(`  ✗ ${part.nombre}`);
      }
    }
    console.log(`  Total: ${partCount}\n`);

    // ÓRDENES
    console.log('📋 Cargando órdenes de trabajo...');
    const now = new Date();
    const orders = [
      {
        descripcion: 'Cambio de aceite y filtros',
        estado: 'ingresado',
        cliente: clientIds[0],
        vehiculo: vehicleIds[0],
        mecanico: mechanicIds[3],
        zona: zones[0],
        fecha_inicio_planificada: new Date(now.getTime() + 1*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString()
      },
      {
        descripcion: 'Revisión de frenos',
        estado: 'en_diagnostico',
        cliente: clientIds[1],
        vehiculo: vehicleIds[1],
        mecanico: mechanicIds[0],
        zona: zones[1],
        fecha_inicio_planificada: new Date(now.getTime() + 2*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(now.getTime() + 5*60*60*1000).toISOString()
      },
      {
        descripcion: 'Reparación suspensión',
        estado: 'en_reparacion',
        cliente: clientIds[2],
        vehiculo: vehicleIds[2],
        mecanico: mechanicIds[1],
        zona: zones[2],
        fecha_inicio_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(now.getTime() + 6*60*60*1000).toISOString()
      },
      {
        descripcion: 'Reparación eléctrica',
        estado: 'en_reparacion',
        cliente: clientIds[3],
        vehiculo: vehicleIds[3],
        mecanico: mechanicIds[2],
        zona: zones[3],
        fecha_inicio_planificada: new Date(now.getTime() + 4*60*60*1000).toISOString(),
        fecha_fin_planificada: new Date(now.getTime() + 7*60*60*1000).toISOString()
      },
      {
        descripcion: 'Diagnóstico general',
        estado: 'ingresado',
        cliente: clientIds[4],
        vehiculo: vehicleIds[4]
      }
    ];
    
    let orderCount = 0;
    for (const order of orders) {
      try {
        await httpRequest('localhost', 1337, '/api/orden-de-trabajos', 'POST', { data: order });
        console.log(`  ✓ ${order.descripcion}`);
        orderCount++;
      } catch (err) {
        console.error(`  ✗ ${order.descripcion}`);
      }
    }
    console.log(`  Total: ${orderCount}\n`);

    console.log('✅ ¡Datos de prueba cargados!\n');
    console.log('📊 Resumen:');
    console.log(`   • ${clientIds.length} clientes`);
    console.log(`   • ${vehicleIds.length} vehículos`);
    console.log(`   • ${mechanicIds.length} mecánicos`);
    console.log(`   • ${partCount} repuestos`);
    console.log(`   • ${orderCount} órdenes de trabajo\n`);
    console.log('🌐 Accede a http://localhost:1337/admin para ver los datos\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
