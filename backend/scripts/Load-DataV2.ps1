# Script para cargar datos de prueba - Versión mejorada

Write-Host "Iniciando carga de datos...`n"

# GET existing data
$clientResp = Invoke-WebRequest -Uri "http://localhost:1337/api/clientes" -Method Get
$clientsData = $clientResp.Content | ConvertFrom-Json
$existingClients = $clientsData.data | Where-Object { $_.nombre -in @("Andres","Maria","Roberto","Laura","Francisco") } | Select-Object -ExpandProperty id

$vehicleResp = Invoke-WebRequest -Uri "http://localhost:1337/api/vehiculos" -Method Get
$vehicleData = $vehicleResp.Content | ConvertFrom-Json
$vehicleIds = $vehicleData.data | Select-Object -ExpandProperty id

$zoneResp = Invoke-WebRequest -Uri "http://localhost:1337/api/zonas" -Method Get
$zoneObj = $zoneResp.Content | ConvertFrom-Json
$zones = $zoneObj.data | Select-Object -ExpandProperty id

Write-Host "Clientes disponibles: $($existingClients.Count)"
Write-Host "Zonas: $($zones.Count)"
Write-Host ""

# VEHICULOS (criar apenas se exista referencia de cliente)
if ($existingClients.Count -ge 5) {
    Write-Host "Cargando vehiculos..."
    $timestamp = (Get-Date).Ticks.ToString().Substring(0, 6)
    $vehicles = @(
        @("Toyota","Corolla",2020,"ABC1$timestamp",[System.Guid]::NewGuid().ToString().Substring(0,8),$existingClients[0]),
        @("Ford","Focus",2019,"DEF2$timestamp",[System.Guid]::NewGuid().ToString().Substring(0,8),$existingClients[1]),
        @("Volkswagen","Golf",2021,"GHI3$timestamp",[System.Guid]::NewGuid().ToString().Substring(0,8),$existingClients[2]),
        @("BMW","320i",2018,"JKL4$timestamp",[System.Guid]::NewGuid().ToString().Substring(0,8),$existingClients[3]),
        @("Mercedes","C200",2022,"MNO5$timestamp",[System.Guid]::NewGuid().ToString().Substring(0,8),$existingClients[4])
    )
    
    $vehicleIds = @()
    foreach ($v in $vehicles) {
        $body = @{
            data = @{
                marca = $v[0]
                modelo = $v[1]
                ano = $v[2]
                patente = $v[3]
                numero_de_chasis = $v[4]
                cliente = $v[5]
            }
        } | ConvertTo-Json -Depth 10
        
        try {
            $resp = Invoke-WebRequest -Uri "http://localhost:1337/api/vehiculos" -Method Post -Body $body -ContentType "application/json"
            $obj = $resp.Content | ConvertFrom-Json
            if ($obj.data.id) {
                $vehicleIds += $obj.data.id
                Write-Host "  OK: $($v[0])"
            }
        } catch {
            Write-Host "  ERR: $($v[0]): $($_.Exception.Message)"
        }
    }
    Write-Host "Vehiculos cargados: $($vehicleIds.Count)`n"
}

# MECANICOS
if ($zones.Count -ge 4) {
    Write-Host "Cargando mecanicos..."
    $rand = [System.Guid]::NewGuid().ToString().Substring(0, 8)
    $mechanics = @(
        @("Juan","Garcia","juan+$rand@taller.com","Motor",$zones[1]),
        @("Carlos","Lopez","carlos+$rand@taller.com","Suspension",$zones[2]),
        @("Miguel","Rodriguez","miguel+$rand@taller.com","Electricidad",$zones[3]),
        @("Pedro","Martinez","pedro+$rand@taller.com","Diagnostico",$zones[0])
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
                estado = "disponible"
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
    Write-Host "Mecanicos cargados: $($mechanicIds.Count)`n"
}

# ORDENES DE TRABAJO
if ($existingClients.Count -ge 5 -and $vehicleIds.Count -ge 5 -and $mechanicIds.Count -ge 4) {
    Write-Host "Cargando ordenes de trabajo..."
    $now = Get-Date
    $orders = @(
        @("Cambio de aceite y filtros","ingresado",$existingClients[0],$vehicleIds[0],$mechanicIds[3],$zones[0],($now.AddHours(1)).ToUniversalTime().ToString("o"),($now.AddHours(3)).ToUniversalTime().ToString("o")),
        @("Revision de frenos","en_diagnostico",$existingClients[1],$vehicleIds[1],$mechanicIds[0],$zones[1],($now.AddHours(2)).ToUniversalTime().ToString("o"),($now.AddHours(5)).ToUniversalTime().ToString("o")),
        @("Reparacion suspension","en_reparacion",$existingClients[2],$vehicleIds[2],$mechanicIds[1],$zones[2],($now.AddHours(3)).ToUniversalTime().ToString("o"),($now.AddHours(6)).ToUniversalTime().ToString("o")),
        @("Reparacion electrica","en_reparacion",$existingClients[3],$vehicleIds[3],$mechanicIds[2],$zones[3],($now.AddHours(4)).ToUniversalTime().ToString("o"),($now.AddHours(7)).ToUniversalTime().ToString("o")),
        @("Diagnostico general","ingresado",$existingClients[4],$vehicleIds[4],$null,$null,$null,$null)
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
    Write-Host "Ordenes cargadas: $orderCount`n"
}

Write-Host "===== DATOS CARGADOS ====="
Write-Host "Clientes: $($existingClients.Count)"
Write-Host "Vehiculos: $($vehicleIds.Count)"
Write-Host "Mecanicos: $($mechanicIds.Count)"
Write-Host "Zonas: $($zones.Count)"
Write-Host ""
Write-Host "Accede a http://localhost:1337/admin para ver los datos"
