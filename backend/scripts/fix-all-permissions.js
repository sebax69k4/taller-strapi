// @ts-nocheck
const sqlite3 = require('better-sqlite3');

const db = new sqlite3('.tmp/data.db');

console.log('\n=== AGREGANDO PERMISOS FALTANTES ===\n');

// Roles: Recepcionista(3), Encargado(4), Mecanico(5)
const rolesIds = [3, 4, 5];

// Obtener todos los permisos existentes
const allPermissions = db.prepare(`SELECT id, action FROM up_permissions`).all();
console.log(`Total permisos en sistema: ${allPermissions.length}`);

// Permisos que necesitamos (buscar por acción)
const requiredActions = [
  'api::factura.factura.create',
  'api::factura.factura.find',
  'api::factura.factura.findOne',
  'api::factura.factura.update',
  'api::orden-de-trabajo.orden-de-trabajo.create',
  'api::orden-de-trabajo.orden-de-trabajo.find',
  'api::orden-de-trabajo.orden-de-trabajo.findOne',
  'api::orden-de-trabajo.orden-de-trabajo.update',
  'api::orden-de-trabajo.orden-de-trabajo.delete',
  'api::bitacora.bitacora.create',
  'api::bitacora.bitacora.find',
  'api::bitacora.bitacora.findOne',
  'api::bitacora.bitacora.update',
  'api::repuesto.repuesto.find',
  'api::repuesto.repuesto.findOne',
  'api::repuesto.repuesto.update',
  'api::mecenico.mecenico.find',
  'api::mecenico.mecenico.findOne',
  'api::mecenico.mecenico.update',
  'api::vehiculo.vehiculo.find',
  'api::vehiculo.vehiculo.findOne',
  'api::cliente.cliente.find',
  'api::cliente.cliente.findOne',
];

// Crear permisos que no existen
for (const action of requiredActions) {
  const existing = allPermissions.find(p => p.action === action);
  if (!existing) {
    const insert = db.prepare(`INSERT INTO up_permissions (action, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))`);
    insert.run(action);
    console.log(`✅ Permiso creado: ${action}`);
  }
}

// Recargar permisos
const updatedPermissions = db.prepare(`SELECT id, action FROM up_permissions`).all();

// Asignar permisos a roles
for (const roleId of rolesIds) {
  console.log(`\n--- Asignando permisos al rol ${roleId} ---`);
  
  for (const action of requiredActions) {
    const permission = updatedPermissions.find(p => p.action === action);
    if (!permission) {
      console.log(`⚠️ Permiso no encontrado: ${action}`);
      continue;
    }
    
    // Verificar si ya existe la asignación
    const existing = db.prepare(`
      SELECT * FROM up_permissions_role_lnk 
      WHERE permission_id = ? AND role_id = ?
    `).get(permission.id, roleId);
    
    if (existing) {
      // Ya existe
    } else {
      // Obtener el último ord
      const lastOrd = db.prepare(`
        SELECT MAX(permission_ord) as max_ord 
        FROM up_permissions_role_lnk 
        WHERE role_id = ?
      `).get(roleId);
      
      const nextOrd = (lastOrd && lastOrd.max_ord ? lastOrd.max_ord : 0) + 1;
      
      const insert = db.prepare(`
        INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
        VALUES (?, ?, ?)
      `);
      
      insert.run(permission.id, roleId, nextOrd);
      console.log(`✅ ${action} -> rol ${roleId}`);
    }
  }
}

console.log('\n=== VERIFICACIÓN FINAL ===\n');

// Verificar permisos del rol Mecanico (5)
const mecanicoPerms = db.prepare(`
  SELECT p.action 
  FROM up_permissions p
  JOIN up_permissions_role_lnk lnk ON p.id = lnk.permission_id
  WHERE lnk.role_id = 5
  ORDER BY p.action
`).all();

console.log(`Permisos del Mecánico (${mecanicoPerms.length}):`);
mecanicoPerms.forEach(p => console.log(`  - ${p.action}`));

db.close();

console.log('\n✅ PROCESO COMPLETADO - REINICIA EL SERVIDOR DE STRAPI\n');
