# Script para cargar datos de prueba usando Invoke-WebRequest

Write-Host "Iniciando carga de datos...`n"

# CLIENTES
Write-Host "Cargando clientes..."
$clients = @(
    @("Andres","Fernandez","andres@email.com","555-0101","44444444-4"),
    @("Maria","Gonzalez","maria@email.com","555-0102","55555555-5"),
    @("Roberto","Sanchez","roberto@email.com","555-0103","66666666-6"),
    @("Laura","Diaz","laura@email.com","555-0104","77777777-7"),
    @("Francisco","Moreno","francisco@email.com","555-0105","88888888-8")
)

$clientIds = @()
foreach ($c in $clients) {
    $body = @{
        data = @{
            nombre = $c[0]
            apellido = $c[1]
            email = $c[2]
            telefono = $c[3]
            rut = $c[4]
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:1337/api/clientes" -Method Post -Body $body -ContentType "application/json"
        $obj = $resp.Content | ConvertFrom-Json
        if ($obj.data.id) {
            $clientIds += $obj.data.id
            Write-Host "  OK: $($c[0])"
        }
    } catch {
        Write-Host "  ERR: $($c[0]): $($_.Exception.Message)"
    }
}
Write-Host "Clientes: $($clientIds.Count)`n"

# VEHICULOS
Write-Host "Cargando vehiculos..."
$vehicles = @(
    @("Toyota","Corolla",2020,"ABC123","VIN001",$clientIds[0]),
    @("Ford","Focus",2019,"DEF456","VIN002",$clientIds[1]),
    @("Volkswagen","Golf",2021,"GHI789","VIN003",$clientIds[2]),
    @("BMW","320i",2018,"JKL012","VIN004",$clientIds[3]),
    @("Mercedes","C200",2022,"MNO345","VIN005",$clientIds[4])
)

$vehicleIds = @()
foreach ($v in $vehicles) {
    $body = @{
        data = @{
            marca = $v[0]
            modelo = $v[1]
            ano = $v[2]
            patente = $v[3]
            vin = $v[4]
            cliente = $v[5]
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:1337/api/vehiculos" -Method Post -Body $body -ContentType "application/json"
        $obj = $resp.Content | ConvertFrom-Json
        if ($obj.data.id) {
            $vehicleIds += $obj.data.id
            Write-Host "  OK: $($v[0]) $($v[1])"
        }
    } catch {
        Write-Host "  ERR: $($v[0])"
    }
}
Write-Host "Vehiculos: $($vehicleIds.Count)`n"

# ZONAS
Write-Host "Obteniendo zonas..."
$zoneResp = Invoke-WebRequest -Uri "http://localhost:1337/api/zonas" -Method Get
$zoneObj = $zoneResp.Content | ConvertFrom-Json
$zones = $zoneObj.data | Select-Object -ExpandProperty id
Write-Host "Zonas: $($zones.Count)`n"

# MECANICOS
Write-Host "Cargando mecanicos..."
$mechanics = @(
    @("Juan","Garcia","juan@taller.com","Motor",$zones[1]),
    @("Carlos","Lopez","carlos@taller.com","Suspension",$zones[2]),
    @("Miguel","Rodriguez","miguel@taller.com","Electricidad",$zones[3]),
    @("Pedro","Martinez","pedro@taller.com","Diagnostico",$zones[0])
)

$mechanicIds = @()
foreach ($m in $mechanics) {
    $body = @{
        data = @{
            nombre = $m[0]
            apellido = $m[1]
            email = $m[2]
            especialidad = $m[3]
            zona = $m[4]
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:1337/api/mecanicos" -Method Post -Body $body -ContentType "application/json"
        $obj = $resp.Content | ConvertFrom-Json
        if ($obj.data.id) {
            $mechanicIds += $obj.data.id
            Write-Host "  OK: $($m[0])"
        }
    } catch {
        Write-Host "  ERR: $($m[0])"
    }
}
Write-Host "Mecanicos: $($mechanicIds.Count)`n"

# REPUESTOS
Write-Host "Cargando repuestos..."
$parts = @(
    @("Filtro de Aire","FA001",25.50,45,10),
    @("Filtro de Aceite","FO001",18.75,60,15),
    @("Pastillas de Freno","PF001",85.00,30,8),
    @("Discos de Freno","DF001",120.00,22,5),
    @("Amortiguador","AD001",250.00,12,4),
    @("Bateria 12V","BA001",95.00,8,3),
    @("Alternador","AL001",350.00,4,2),
    @("Motor de Arranque","MA001",320.00,5,2),
    @("Bomba de Agua","BM001",180.00,6,3),
    @("Correa de Distribucion","CD001",220.00,3,2)
)

$partCount = 0
foreach ($p in $parts) {
    $body = @{
        data = @{
            nombre = $p[0]
            sku = $p[1]
            precio = $p[2]
            stock = $p[3]
            stock_minimo = $p[4]
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:1337/api/repuestos" -Method Post -Body $body -ContentType "application/json"
        $obj = $resp.Content | ConvertFrom-Json
        if ($obj.data.id) {
            $partCount++
            Write-Host "  OK: $($p[0])"
        }
    } catch {
        Write-Host "  ERR: $($p[0])"
    }
}
Write-Host "Repuestos: $partCount`n"

# ORDENES
Write-Host "Cargando ordenes de trabajo..."
$now = Get-Date
$orders = @(
    @("Cambio de aceite y filtros","ingresado",$clientIds[0],$vehicleIds[0],$mechanicIds[3],$zones[0],($now.AddHours(1)).ToUniversalTime().ToString("o"),($now.AddHours(3)).ToUniversalTime().ToString("o")),
    @("Revision de frenos","en_diagnostico",$clientIds[1],$vehicleIds[1],$mechanicIds[0],$zones[1],($now.AddHours(2)).ToUniversalTime().ToString("o"),($now.AddHours(5)).ToUniversalTime().ToString("o")),
    @("Reparacion suspension","en_reparacion",$clientIds[2],$vehicleIds[2],$mechanicIds[1],$zones[2],($now.AddHours(3)).ToUniversalTime().ToString("o"),($now.AddHours(6)).ToUniversalTime().ToString("o")),
    @("Reparacion electrica","en_reparacion",$clientIds[3],$vehicleIds[3],$mechanicIds[2],$zones[3],($now.AddHours(4)).ToUniversalTime().ToString("o"),($now.AddHours(7)).ToUniversalTime().ToString("o")),
    @("Diagnostico general","ingresado",$clientIds[4],$vehicleIds[4],$null,$null,$null,$null)
)

$orderCount = 0
foreach ($o in $orders) {
    $data = @{
        descripcion = $o[0]
        estado = $o[1]
        cliente = $o[2]
        vehiculo = $o[3]
    }
    if ($o[4]) { $data.mecanico = $o[4] }
    if ($o[5]) { $data.zona = $o[5] }
    if ($o[6]) { $data.fecha_inicio_planificada = $o[6] }
    if ($o[7]) { $data.fecha_fin_planificada = $o[7] }
    
    $body = @{ data = $data } | ConvertTo-Json -Depth 10
    
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:1337/api/orden-de-trabajos" -Method Post -Body $body -ContentType "application/json"
        $obj = $resp.Content | ConvertFrom-Json
        if ($obj.data.id) {
            $orderCount++
            Write-Host "  OK: $($o[0])"
        }
    } catch {
        Write-Host "  ERR: $($o[0])"
    }
}
Write-Host "Ordenes: $orderCount`n"

Write-Host "Datos cargados!`n"
Write-Host "Resumen:"
Write-Host "  - $($clientIds.Count) clientes"
Write-Host "  - $($vehicleIds.Count) vehiculos"
Write-Host "  - $($mechanicIds.Count) mecanicos"
Write-Host "  - $partCount repuestos"
Write-Host "  - $orderCount ordenes`n"
