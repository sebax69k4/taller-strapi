Write-Host "Cargando ordenes de trabajo...`n"

# Get existing data
$clientResp = Invoke-WebRequest -Uri "http://localhost:1337/api/clientes" -Method Get
$clientsData = $clientResp.Content | ConvertFrom-Json
$clients = $clientsData.data | Select-Object -First 5 -ExpandProperty id

$vehicleResp = Invoke-WebRequest -Uri "http://localhost:1337/api/vehiculos" -Method Get
$vehicleData = $vehicleResp.Content | ConvertFrom-Json
$vehicles = $vehicleData.data | Select-Object -First 5 -ExpandProperty id

$zoneResp = Invoke-WebRequest -Uri "http://localhost:1337/api/zonas" -Method Get
$zoneObj = $zoneResp.Content | ConvertFrom-Json
$zones = $zoneObj.data | Select-Object -ExpandProperty id

Write-Host "Disponibles:"
Write-Host "  Clientes: $($clients.Count)"
Write-Host "  Vehiculos: $($vehicles.Count)"
Write-Host "  Zonas: $($zones.Count)`n"

# Create orders
if ($clients.Count -ge 5 -and $vehicles.Count -ge 5 -and $zones.Count -ge 4) {
    Write-Host "Creando ordenes..."
    $now = Get-Date
    $orders = @(
        @("Cambio de aceite y filtros","ingresado",$clients[0],$vehicles[0],$zones[0],$now.ToString("yyyy-MM-dd"),($now.AddHours(1)).ToUniversalTime().ToString("o"),($now.AddHours(3)).ToUniversalTime().ToString("o")),
        @("Revision de frenos","en_diagnostico",$clients[1],$vehicles[1],$zones[1],$now.ToString("yyyy-MM-dd"),($now.AddHours(2)).ToUniversalTime().ToString("o"),($now.AddHours(5)).ToUniversalTime().ToString("o")),
        @("Reparacion suspension","en_reparacion",$clients[2],$vehicles[2],$zones[2],$now.ToString("yyyy-MM-dd"),($now.AddHours(3)).ToUniversalTime().ToString("o"),($now.AddHours(6)).ToUniversalTime().ToString("o")),
        @("Reparacion electrica","en_reparacion",$clients[3],$vehicles[3],$zones[3],$now.ToString("yyyy-MM-dd"),($now.AddHours(4)).ToUniversalTime().ToString("o"),($now.AddHours(7)).ToUniversalTime().ToString("o")),
        @("Diagnostico general","ingresado",$clients[4],$vehicles[4],$null,$now.ToString("yyyy-MM-dd"),$null,$null)
    )
    
    $orderCount = 0
    foreach ($o in $orders) {
        $data = @{
            descripcion = $o[0]
            estado = $o[1]
            cliente = $o[2]
            vehiculo = $o[3]
            fecha_ingreso = $o[5]
        }
        if ($o[4]) { $data.zona = $o[4] }
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
            Write-Host "  ERR: $($o[0]): $($_.Exception.Message)"
        }
    }
    Write-Host "`nOrdenes cargadas: $orderCount`n"
    Write-Host "✅ Base de datos lista para usar!"
} else {
    Write-Host "ERROR: No hay suficientes datos base`n"
}
