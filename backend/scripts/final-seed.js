#!/usr/bin/env node
/**
 * Script para cargar datos de prueba en Strapi
 */

async function seedData() {
  console.log('🌱 Iniciando carga de datos de prueba...\n');
  
  try {
    // Clientes - necesitan RUT único
    console.log('👤 Cargando clientes...');
    const clients = [
      { nombre: 'Andrés', apellido: 'Fernández', email: 'andres@email.com', telefono: '555-0101', rut: '12345678-9' },
      { nombre: 'María', apellido: 'González', email: 'maria@email.com', telefono: '555-0102', rut: '98765432-1' },
      { nombre: 'Roberto', apellido: 'Sánchez', email: 'roberto@email.com', telefono: '555-0103', rut: '11111111-1' },
      { nombre: 'Laura', apellido: 'Díaz', email: 'laura@email.com', telefono: '555-0104', rut: '22222222-2' },
      { nombre: 'Francisco', apellido: 'Moreno', email: 'francisco@email.com', telefono: '555-0105', rut: '33333333-3' },
    ];
    
    let clientIds = [];
    for (const client of clients) {
      try {
        const response = await fetch('http://localhost:1337/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: client })
        });
        if (response.ok) {
          const json = await response.json();
          clientIds.push(json.data.id);
          console.log(`  ✓ ${client.nombre} ${client.apellido}`);
        } else {
          const err = await response.text();
          console.log(`  ! ${client.nombre}: ${err.substring(0, 100)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${client.nombre}: ${err.message}`);
      }
    }

    // Vehículos
    console.log('\n🚗 Cargando vehículos...');
    const vehicles = [
      { marca: 'Toyota', modelo: 'Corolla', ano: 2020, patente: 'ABC123', vin: 'VIN001', cliente: clientIds[0] },
      { marca: 'Ford', modelo: 'Focus', ano: 2019, patente: 'DEF456', vin: 'VIN002', cliente: clientIds[1] },
      { marca: 'Volkswagen', modelo: 'Golf', ano: 2021, patente: 'GHI789', vin: 'VIN003', cliente: clientIds[2] },
      { marca: 'BMW', modelo: '320i', ano: 2018, patente: 'JKL012', vin: 'VIN004', cliente: clientIds[3] },
      { marca: 'Mercedes', modelo: 'C200', ano: 2022, patente: 'MNO345', vin: 'VIN005', cliente: clientIds[4] },
    ];
    
    let vehicleIds = [];
    for (const vehicle of vehicles) {
      try {
        const response = await fetch('http://localhost:1337/api/vehiculos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: vehicle })
        });
        if (response.ok) {
          const json = await response.json();
          vehicleIds.push(json.data.id);
          console.log(`  ✓ ${vehicle.marca} ${vehicle.modelo}`);
        } else {
          const err = await response.text();
          console.log(`  ! ${vehicle.marca}: ${err.substring(0, 100)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${vehicle.marca}: ${err.message}`);
      }
    }

    // Zonas (get existing)
    console.log('\n📍 Obteniendo zonas...');
    const zoneResp = await fetch('http://localhost:1337/api/zonas');
    const zonesData = await zoneResp.json();
    const zones = zonesData.data.map(z => z.id);
    console.log(`  ✓ ${zones.length} zonas encontradas`);

    // Mecánicos
    console.log('\n👨‍🔧 Cargando mecánicos...');
    const mechanics = [
      { nombre: 'Juan', apellido: 'García', email: 'juan@taller.com', especialidad: 'Motor', zona: zones[1] },
      { nombre: 'Carlos', apellido: 'López', email: 'carlos@taller.com', especialidad: 'Suspensión', zona: zones[2] },
      { nombre: 'Miguel', apellido: 'Rodríguez', email: 'miguel@taller.com', especialidad: 'Electricidad', zona: zones[3] },
      { nombre: 'Pedro', apellido: 'Martínez', email: 'pedro@taller.com', especialidad: 'Diagnóstico', zona: zones[0] },
    ];
    
    let mechanicIds = [];
    for (const mech of mechanics) {
      try {
        const response = await fetch('http://localhost:1337/api/mecanicos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: mech })
        });
        if (response.ok) {
          const json = await response.json();
          mechanicIds.push(json.data.id);
          console.log(`  ✓ ${mech.nombre} ${mech.apellido}`);
        } else {
          const err = await response.text();
          console.log(`  ! ${mech.nombre}: ${err.substring(0, 100)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${mech.nombre}: ${err.message}`);
      }
    }

    // Repuestos
    console.log('\n🔧 Cargando repuestos...');
    const parts = [
      { nombre: 'Filtro de Aire', sku: 'FA001', precio: 25.50, stock: 45, stock_minimo: 10 },
      { nombre: 'Filtro de Aceite', sku: 'FO001', precio: 18.75, stock: 60, stock_minimo: 15 },
      { nombre: 'Pastillas de Freno', sku: 'PF001', precio: 85.00, stock: 30, stock_minimo: 8 },
      { nombre: 'Discos de Freno', sku: 'DF001', precio: 120.00, stock: 22, stock_minimo: 5 },
      { nombre: 'Amortiguador Delantero', sku: 'AD001', precio: 250.00, stock: 12, stock_minimo: 4 },
      { nombre: 'Batería 12V', sku: 'BA001', precio: 95.00, stock: 8, stock_minimo: 3 },
      { nombre: 'Alternador', sku: 'AL001', precio: 350.00, stock: 4, stock_minimo: 2 },
      { nombre: 'Motor de Arranque', sku: 'MA001', precio: 320.00, stock: 5, stock_minimo: 2 },
      { nombre: 'Bomba de Agua', sku: 'BM001', precio: 180.00, stock: 6, stock_minimo: 3 },
      { nombre: 'Correa de Distribución', sku: 'CD001', precio: 220.00, stock: 3, stock_minimo: 2 },
    ];
    
    for (const part of parts) {
      try {
        const response = await fetch('http://localhost:1337/api/repuestos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: part })
        });
        if (response.ok) {
          console.log(`  ✓ ${part.nombre}`);
        } else {
          const err = await response.text();
          console.log(`  ! ${part.nombre}: ${err.substring(0, 80)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${part.nombre}: ${err.message}`);
      }
    }

    // Órdenes de Trabajo
    console.log('\n📋 Cargando órdenes de trabajo...');
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
        descripcion: 'Revisión de frenos y cambio de pastillas', 
        estado: 'en_diagnostico', 
        cliente: clientIds[1], 
        vehiculo: vehicleIds[1], 
        mecanico: mechanicIds[0], 
        zona: zones[1],
        fecha_inicio_planificada: new Date(now.getTime() + 2*60*60*1000).toISOString(), 
        fecha_fin_planificada: new Date(now.getTime() + 5*60*60*1000).toISOString() 
      },
      { 
        descripcion: 'Reparación de suspensión', 
        estado: 'en_reparacion', 
        cliente: clientIds[2], 
        vehiculo: vehicleIds[2], 
        mecanico: mechanicIds[1], 
        zona: zones[2],
        fecha_inicio_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString(), 
        fecha_fin_planificada: new Date(now.getTime() + 6*60*60*1000).toISOString() 
      },
      { 
        descripcion: 'Reparación de sistema eléctrico', 
        estado: 'en_reparacion', 
        cliente: clientIds[3], 
        vehiculo: vehicleIds[3], 
        mecanico: mechanicIds[2], 
        zona: zones[3],
        fecha_inicio_planificada: new Date(now.getTime() + 4*60*60*1000).toISOString(), 
        fecha_fin_planificada: new Date(now.getTime() + 7*60*60*1000).toISOString() 
      },
      { 
        descripcion: 'Diagnóstico general y afinamiento', 
        estado: 'ingresado', 
        cliente: clientIds[4], 
        vehiculo: vehicleIds[4] 
      },
    ];
    
    for (const order of orders) {
      try {
        const response = await fetch('http://localhost:1337/api/orden-de-trabajos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: order })
        });
        if (response.ok) {
          console.log(`  ✓ ${order.descripcion}`);
        } else {
          const err = await response.text();
          console.log(`  ! ${order.descripcion}: ${err.substring(0, 100)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${order.descripcion}: ${err.message}`);
      }
    }

    console.log('\n✅ ¡Datos de prueba cargados exitosamente!\n');
    console.log('📊 Resumen cargado:');
    console.log(`   • ${clients.length} clientes`);
    console.log(`   • ${vehicles.length} vehículos`);
    console.log(`   • ${mechanics.length} mecánicos`);
    console.log(`   • ${parts.length} repuestos`);
    console.log(`   • ${orders.length} órdenes de trabajo`);
    console.log(`\n🌐 Accede a http://localhost:1337/admin para ver los datos\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
