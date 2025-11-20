# Script para cargar datos de prueba usando curl

Write-Host "🌱 Iniciando carga de datos de prueba...`n"

# CLIENTES
Write-Host "👤 Cargando clientes..."
$clients = @(
  @{ nombre = "Andrés"; apellido = "Fernández"; email = "andres@email.com"; telefono = "555-0101"; rut = "12345678-9" },
  @{ nombre = "María"; apellido = "González"; email = "maria@email.com"; telefono = "555-0102"; rut = "98765432-1" },
  @{ nombre = "Roberto"; apellido = "Sánchez"; email = "roberto@email.com"; telefono = "555-0103"; rut = "11111111-1" },
  @{ nombre = "Laura"; apellido = "Díaz"; email = "laura@email.com"; telefono = "555-0104"; rut = "22222222-2" },
  @{ nombre = "Francisco"; apellido = "Moreno"; email = "francisco@email.com"; telefono = "555-0105"; rut = "33333333-3" }
)

$clientIds = @()
foreach ($client in $clients) {
  $body = @{ data = $client } | ConvertTo-Json
  $resp = curl -s -X POST "http://localhost:1337/api/clientes" `
    -H "Content-Type: application/json" `
    -d $body
  $json = $resp | ConvertFrom-Json
  if ($json.data.id) {
    $clientIds += $json.data.id
    Write-Host "  ✓ $($client.nombre) $($client.apellido)"
  } else {
    Write-Host "  ✗ $($client.nombre): $($json.error.message)"
  }
}

# VEHÍCULOS
Write-Host "`n🚗 Cargando vehículos..."
$vehicles = @(
  @{ marca = "Toyota"; modelo = "Corolla"; ano = 2020; patente = "ABC123"; vin = "VIN001"; cliente = $clientIds[0] },
  @{ marca = "Ford"; modelo = "Focus"; ano = 2019; patente = "DEF456"; vin = "VIN002"; cliente = $clientIds[1] },
  @{ marca = "Volkswagen"; modelo = "Golf"; ano = 2021; patente = "GHI789"; vin = "VIN003"; cliente = $clientIds[2] },
  @{ marca = "BMW"; modelo = "320i"; ano = 2018; patente = "JKL012"; vin = "VIN004"; cliente = $clientIds[3] },
  @{ marca = "Mercedes"; modelo = "C200"; ano = 2022; patente = "MNO345"; vin = "VIN005"; cliente = $clientIds[4] }
)

$vehicleIds = @()
foreach ($vehicle in $vehicles) {
  $body = @{ data = $vehicle } | ConvertTo-Json
  $resp = curl -s -X POST "http://localhost:1337/api/vehiculos" `
    -H "Content-Type: application/json" `
    -d $body
  $json = $resp | ConvertFrom-Json
  if ($json.data.id) {
    $vehicleIds += $json.data.id
    Write-Host "  ✓ $($vehicle.marca) $($vehicle.modelo)"
  } else {
    Write-Host "  ✗ $($vehicle.marca): $($json.error.message)"
  }
}

# ZONAS (Get existing)
Write-Host "`n📍 Obteniendo zonas..."
$zoneResp = curl -s "http://localhost:1337/api/zonas" | ConvertFrom-Json
$zones = $zoneResp.data | Select-Object -ExpandProperty id
Write-Host "  ✓ $($zones.Count) zonas encontradas"

# MECÁNICOS
Write-Host "`n👨‍🔧 Cargando mecánicos..."
$mechanics = @(
  @{ nombre = "Juan"; apellido = "García"; email = "juan@taller.com"; especialidad = "Motor"; zona = $zones[1] },
  @{ nombre = "Carlos"; apellido = "López"; email = "carlos@taller.com"; especialidad = "Suspensión"; zona = $zones[2] },
  @{ nombre = "Miguel"; apellido = "Rodríguez"; email = "miguel@taller.com"; especialidad = "Electricidad"; zona = $zones[3] },
  @{ nombre = "Pedro"; apellido = "Martínez"; email = "pedro@taller.com"; especialidad = "Diagnóstico"; zona = $zones[0] }
)

$mechanicIds = @()
foreach ($mech in $mechanics) {
  $body = @{ data = $mech } | ConvertTo-Json
  $resp = curl -s -X POST "http://localhost:1337/api/mecanicos" `
    -H "Content-Type: application/json" `
    -d $body
  $json = $resp | ConvertFrom-Json
  if ($json.data.id) {
    $mechanicIds += $json.data.id
    Write-Host "  ✓ $($mech.nombre) $($mech.apellido)"
  } else {
    Write-Host "  ✗ $($mech.nombre): $($json.error.message)"
  }
}

# REPUESTOS
Write-Host "`n🔧 Cargando repuestos..."
$parts = @(
  @{ nombre = "Filtro de Aire"; sku = "FA001"; precio = 25.50; stock = 45; stock_minimo = 10 },
  @{ nombre = "Filtro de Aceite"; sku = "FO001"; precio = 18.75; stock = 60; stock_minimo = 15 },
  @{ nombre = "Pastillas de Freno"; sku = "PF001"; precio = 85.00; stock = 30; stock_minimo = 8 },
  @{ nombre = "Discos de Freno"; sku = "DF001"; precio = 120.00; stock = 22; stock_minimo = 5 },
  @{ nombre = "Amortiguador Delantero"; sku = "AD001"; precio = 250.00; stock = 12; stock_minimo = 4 },
  @{ nombre = "Batería 12V"; sku = "BA001"; precio = 95.00; stock = 8; stock_minimo = 3 },
  @{ nombre = "Alternador"; sku = "AL001"; precio = 350.00; stock = 4; stock_minimo = 2 },
  @{ nombre = "Motor de Arranque"; sku = "MA001"; precio = 320.00; stock = 5; stock_minimo = 2 },
  @{ nombre = "Bomba de Agua"; sku = "BM001"; precio = 180.00; stock = 6; stock_minimo = 3 },
  @{ nombre = "Correa de Distribución"; sku = "CD001"; precio = 220.00; stock = 3; stock_minimo = 2 }
)

foreach ($part in $parts) {
  $body = @{ data = $part } | ConvertTo-Json
  $resp = curl -s -X POST "http://localhost:1337/api/repuestos" `
    -H "Content-Type: application/json" `
    -d $body
  $json = $resp | ConvertFrom-Json
  if ($json.data.id) {
    Write-Host "  ✓ $($part.nombre)"
  } else {
    Write-Host "  ✗ $($part.nombre): $($json.error.message)"
  }
}

# ÓRDENES DE TRABAJO
Write-Host "`n📋 Cargando órdenes de trabajo..."
$now = Get-Date
$orders = @(
  @{
    descripcion = "Cambio de aceite y filtros"
    estado = "ingresado"
    cliente = $clientIds[0]
    vehiculo = $vehicleIds[0]
    mecanico = $mechanicIds[3]
    zona = $zones[0]
    fecha_inicio_planificada = ($now.AddHours(1)).ToUniversalTime().ToString("o")
    fecha_fin_planificada = ($now.AddHours(3)).ToUniversalTime().ToString("o")
  },
  @{
    descripcion = "Revisión de frenos y cambio de pastillas"
    estado = "en_diagnostico"
    cliente = $clientIds[1]
    vehiculo = $vehicleIds[1]
    mecanico = $mechanicIds[0]
    zona = $zones[1]
    fecha_inicio_planificada = ($now.AddHours(2)).ToUniversalTime().ToString("o")
    fecha_fin_planificada = ($now.AddHours(5)).ToUniversalTime().ToString("o")
  },
  @{
    descripcion = "Reparación de suspensión"
    estado = "en_reparacion"
    cliente = $clientIds[2]
    vehiculo = $vehicleIds[2]
    mecanico = $mechanicIds[1]
    zona = $zones[2]
    fecha_inicio_planificada = ($now.AddHours(3)).ToUniversalTime().ToString("o")
    fecha_fin_planificada = ($now.AddHours(6)).ToUniversalTime().ToString("o")
  },
  @{
    descripcion = "Reparación de sistema eléctrico"
    estado = "en_reparacion"
    cliente = $clientIds[3]
    vehiculo = $vehicleIds[3]
    mecanico = $mechanicIds[2]
    zona = $zones[3]
    fecha_inicio_planificada = ($now.AddHours(4)).ToUniversalTime().ToString("o")
    fecha_fin_planificada = ($now.AddHours(7)).ToUniversalTime().ToString("o")
  },
  @{
    descripcion = "Diagnóstico general y afinamiento"
    estado = "ingresado"
    cliente = $clientIds[4]
    vehiculo = $vehicleIds[4]
  }
)

foreach ($order in $orders) {
  $body = @{ data = $order } | ConvertTo-Json -Depth 10
  $resp = curl -s -X POST "http://localhost:1337/api/orden-de-trabajos" `
    -H "Content-Type: application/json" `
    -d $body
  $json = $resp | ConvertFrom-Json
  if ($json.data.id) {
    Write-Host "  ✓ $($order.descripcion)"
  } else {
    Write-Host "  ✗ $($order.descripcion): $($json.error.message)"
  }
}

Write-Host "`n✅ ¡Datos de prueba cargados exitosamente!`n"
Write-Host "📊 Resumen cargado:"
Write-Host "   • $($clients.Count) clientes"
Write-Host "   • $($vehicles.Count) vehículos"
Write-Host "   • $($mechanics.Count) mecánicos"
Write-Host "   • $($parts.Count) repuestos"
Write-Host "   • $($orders.Count) órdenes de trabajo"
Write-Host "`n🌐 Accede a http://localhost:1337/admin para ver los datos`n"
