const sqlite3 = require('better-sqlite3');

const db = new sqlite3('.tmp/data.db');

console.log('\n=== VERIFICANDO PERMISO "user.me" ===\n');

// Buscar el permiso de user.me
const mePermission = db.prepare(`
  SELECT * FROM up_permissions 
  WHERE action = 'plugin::users-permissions.user.me'
`).get();

console.log('Permiso encontrado:');
console.log(JSON.stringify(mePermission, null, 2));

// Ver qué roles tienen este permiso
const rolesWithPermission = db.prepare(`
  SELECT 
    r.id as role_id,
    r.name as role_name,
    lnk.permission_id
  FROM up_roles r
  JOIN up_permissions_role_lnk lnk ON r.id = lnk.role_id
  WHERE lnk.permission_id = ?
`).all(mePermission.id);

console.log('\nRoles que tienen el permiso "user.me":');
console.log(JSON.stringify(rolesWithPermission, null, 2));

// Ver todos los permisos del rol Recepcionista (id=3)
console.log('\n=== PERMISOS DEL ROL RECEPCIONISTA (id=3) ===\n');
const recepcionistaPerms = db.prepare(`
  SELECT 
    p.id,
    p.action
  FROM up_permissions p
  JOIN up_permissions_role_lnk lnk ON p.id = lnk.permission_id
  WHERE lnk.role_id = 3
  ORDER BY p.action
`).all();

console.log(JSON.stringify(recepcionistaPerms, null, 2));

db.close();
