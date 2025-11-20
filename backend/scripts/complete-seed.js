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

    const payload = JSON.stringify({ data });
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          if (!body) {
            reject(new Error('Empty response'));
            return;
          }
          const json = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`${res.statusCode}: ${JSON.stringify(json)}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message} - Body: ${body.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function seedData() {
  console.log('🌱 Iniciando carga de datos de prueba...\n');
  
  try {
    // Get existing zones
    console.log('📍 Obteniendo zonas...');
    const zoneResp = await fetch('http://localhost:1337/api/zonas');
    const zonesData = await zoneResp.json();
    const zones = zonesData.data.map(z => z.id);
    console.log(`  ✓ ${zones.length} zonas encontradas`);

    // Get existing clients
    console.log('\n👤 Verificando clientes...');
    const clientResp = await fetch('http://localhost:1337/api/clientes');
    const clientsData = await clientResp.json();
    let clientIds = clientsData.data.map(c => c.id);
    
    if (clientIds.length < 5) {
      console.log(`  Creando clientes faltantes (${5 - clientIds.length})...`);
      const newClients = [
        { nombre: 'Andrés', apellido: 'Fernández', email: 'andres@email.com', telefono: '555-0101' },
        { nombre: 'María', apellido: 'González', email: 'maria@email.com', telefono: '555-0102' },
        { nombre: 'Roberto', apellido: 'Sánchez', email: 'roberto@email.com', telefono: '555-0103' },
        { nombre: 'Laura', apellido: 'Díaz', email: 'laura@email.com', telefono: '555-0104' },
        { nombre: 'Francisco', apellido: 'Moreno', email: 'francisco@email.com', telefono: '555-0105' },
      ];
      for (let i = clientIds.length; i < 5; i++) {
        try {
          const res = await post('clientes', newClients[i]);
          clientIds.push(res.data.id);
          console.log(`  ✓ ${newClients[i].nombre}`);
        } catch (err) {
          console.error(`  ✗ Error: ${err.message}`);
        }
      }
    }
    console.log(`  Total: ${clientIds.length} clientes`);

    // Create vehicles
    console.log('\n🚗 Verificando vehículos...');
    const vehicleResp = await fetch('http://localhost:1337/api/vehiculos');
    const vehiclesData = await vehicleResp.json();
    let vehicleIds = vehiclesData.data.map(v => v.id);
    
    if (vehicleIds.length < 5) {
      console.log(`  Creando vehículos faltantes (${5 - vehicleIds.length})...`);
      const vehicles = [
        { marca: 'Toyota', modelo: 'Corolla', ano: 2020, patente: 'ABC123', cliente: clientIds[0] },
        { marca: 'Ford', modelo: 'Focus', ano: 2019, patente: 'DEF456', cliente: clientIds[1] },
        { marca: 'Volkswagen', modelo: 'Golf', ano: 2021, patente: 'GHI789', cliente: clientIds[2] },
        { marca: 'BMW', modelo: '320i', ano: 2018, patente: 'JKL012', cliente: clientIds[3] },
        { marca: 'Mercedes', modelo: 'C200', ano: 2022, patente: 'MNO345', cliente: clientIds[4] },
      ];
      for (let i = vehicleIds.length; i < 5; i++) {
        try {
          const res = await post('vehiculos', vehicles[i]);
          vehicleIds.push(res.data.id);
          console.log(`  ✓ ${vehicles[i].marca} ${vehicles[i].modelo}`);
        } catch (err) {
          console.error(`  ✗ Error: ${err.message}`);
        }
      }
    }
    console.log(`  Total: ${vehicleIds.length} vehículos`);

    // Create mechanics
    console.log('\n👨‍🔧 Verificando mecánicos...');
    const mechResp = await fetch('http://localhost:1337/api/mecanicos');
    const mechData = await mechResp.json();
    let mechanicIds = mechData.data.map(m => m.id);
    
    if (mechanicIds.length < 4) {
      console.log(`  Creando mecánicos faltantes (${4 - mechanicIds.length})...`);
      const mechanics = [
        { nombre: 'Juan', apellido: 'García', email: 'juan@taller.com', especialidad: 'Motor', zona: zones[1] },
        { nombre: 'Carlos', apellido: 'López', email: 'carlos@taller.com', especialidad: 'Suspensión', zona: zones[2] },
        { nombre: 'Miguel', apellido: 'Rodríguez', email: 'miguel@taller.com', especialidad: 'Electricidad', zona: zones[3] },
        { nombre: 'Pedro', apellido: 'Martínez', email: 'pedro@taller.com', especialidad: 'Diagnóstico', zona: zones[0] },
      ];
      for (let i = mechanicIds.length; i < 4; i++) {
        try {
          const res = await post('mecanicos', mechanics[i]);
          mechanicIds.push(res.data.id);
          console.log(`  ✓ ${mechanics[i].nombre}`);
        } catch (err) {
          console.error(`  ✗ Error: ${err.message}`);
        }
      }
    }
    console.log(`  Total: ${mechanicIds.length} mecánicos`);

    // Create repuestos
    console.log('\n🔧 Verificando repuestos...');
    const repResp = await fetch('http://localhost:1337/api/repuestos');
    const repData = await repResp.json();
    let repIds = repData.data.map(r => r.id);
    
    if (repIds.length < 6) {
      console.log(`  Creando repuestos faltantes (${6 - repIds.length})...`);
      const parts = [
        { nombre: 'Filtro Aire', sku: 'FA001', precio: 25.50, stock: 45, stock_minimo: 10 },
        { nombre: 'Filtro Aceite', sku: 'FO001', precio: 18.75, stock: 60, stock_minimo: 15 },
        { nombre: 'Pastillas Freno', sku: 'PF001', precio: 85.00, stock: 30, stock_minimo: 8 },
        { nombre: 'Discos Freno', sku: 'DF001', precio: 120.00, stock: 22, stock_minimo: 5 },
        { nombre: 'Amortiguador', sku: 'AD001', precio: 250.00, stock: 12, stock_minimo: 4 },
        { nombre: 'Batería 12V', sku: 'BA001', precio: 95.00, stock: 8, stock_minimo: 3 },
      ];
      for (let i = repIds.length; i < 6; i++) {
        try {
          await post('repuestos', parts[i]);
          console.log(`  ✓ ${parts[i].nombre}`);
        } catch (err) {
          console.error(`  ✗ Error: ${err.message}`);
        }
      }
    }
    console.log(`  Total: 6+ repuestos`);

    // Create work orders
    console.log('\n📋 Verificando órdenes de trabajo...');
    const orderResp = await fetch('http://localhost:1337/api/orden-de-trabajos');
    const orderData = await orderResp.json();
    
    if (orderData.data.length < 5) {
      console.log(`  Creando órdenes faltantes (${5 - orderData.data.length})...`);
      const now = new Date();
      const orders = [
        { descripcion: 'Cambio aceite y filtros', estado: 'ingresado', cliente: clientIds[0], vehiculo: vehicleIds[0], mecanico: mechanicIds[3], zona: zones[0], fecha_inicio_planificada: new Date(now.getTime() + 1*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString() },
        { descripcion: 'Revisión de frenos y cambio de pastillas', estado: 'en_diagnostico', cliente: clientIds[1], vehiculo: vehicleIds[1], mecanico: mechanicIds[0], zona: zones[1], fecha_inicio_planificada: new Date(now.getTime() + 2*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 5*60*60*1000).toISOString() },
        { descripcion: 'Reparación de suspensión', estado: 'en_reparacion', cliente: clientIds[2], vehiculo: vehicleIds[2], mecanico: mechanicIds[1], zona: zones[2], fecha_inicio_planificada: new Date(now.getTime() + 3*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 6*60*60*1000).toISOString() },
        { descripcion: 'Reparación de sistema eléctrico', estado: 'en_reparacion', cliente: clientIds[3], vehiculo: vehicleIds[3], mecanico: mechanicIds[2], zona: zones[3], fecha_inicio_planificada: new Date(now.getTime() + 4*60*60*1000).toISOString(), fecha_fin_planificada: new Date(now.getTime() + 7*60*60*1000).toISOString() },
        { descripcion: 'Diagnóstico general y afinamiento', estado: 'ingresado', cliente: clientIds[4], vehiculo: vehicleIds[4] },
      ];
      for (let i = orderData.data.length; i < 5; i++) {
        try {
          await post('orden-de-trabajos', orders[i]);
          console.log(`  ✓ ${orders[i].descripcion}`);
        } catch (err) {
          console.error(`  ✗ Error: ${err.message}`);
        }
      }
    }
    console.log(`  Total: 5+ órdenes`);

    console.log('\n✅ ¡Base de datos completada!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
