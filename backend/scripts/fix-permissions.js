const sqlite3 = require('better-sqlite3');

const db = new sqlite3('.tmp/data.db');

console.log('\n=== ASIGNANDO PERMISO "user.me" A ROLES PERSONALIZADOS ===\n');

// ID del permiso user.me
const mePermissionId = 1;

// Roles que necesitan el permiso: Recepcionista(3), Encargado(4), Mecanico(5)
const rolesIds = [3, 4, 5];

rolesIds.forEach(roleId => {
  // Verificar si ya existe la asignación
  const existing = db.prepare(`
    SELECT * FROM up_permissions_role_lnk 
    WHERE permission_id = ? AND role_id = ?
  `).get(mePermissionId, roleId);
  
  if (existing) {
    console.log(`✓ El rol ${roleId} ya tiene el permiso user.me`);
  } else {
    // Obtener el último permission_ord para este rol
    const lastOrd = db.prepare(`
      SELECT MAX(permission_ord) as max_ord 
      FROM up_permissions_role_lnk 
      WHERE role_id = ?
    `).get(roleId);
    
    const nextOrd = (lastOrd.max_ord || 0) + 1;
    
    // Insertar la nueva relación
    const insert = db.prepare(`
      INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
      VALUES (?, ?, ?)
    `);
    
    insert.run(mePermissionId, roleId, nextOrd);
    console.log(`✅ Permiso user.me asignado al rol ${roleId} (ord: ${nextOrd})`);
  }
});

console.log('\n=== VERIFICACIÓN FINAL ===\n');

const verification = db.prepare(`
  SELECT 
    r.id as role_id,
    r.name as role_name,
    r.type as role_type,
    CASE WHEN lnk.permission_id IS NOT NULL THEN 'SI' ELSE 'NO' END as tiene_permiso_me
  FROM up_roles r
  LEFT JOIN up_permissions_role_lnk lnk 
    ON r.id = lnk.role_id AND lnk.permission_id = 1
  WHERE r.id IN (1, 3, 4, 5)
  ORDER BY r.id
`).all();

console.log('Estado de permiso "user.me" por rol:');
console.log(JSON.stringify(verification, null, 2));

db.close();

console.log('\n✅ PROCESO COMPLETADO\n');
