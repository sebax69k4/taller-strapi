const sqlite3 = require('better-sqlite3');

const db = new sqlite3('.tmp/data.db');

console.log('\n=== PERMISOS DE USERS-PERMISSIONS ===\n');

// Primero ver la estructura de la tabla
console.log('Estructura de up_permissions:');
const schema = db.prepare('PRAGMA table_info(up_permissions)').all();
console.log(JSON.stringify(schema, null, 2));

const permissions = db.prepare(`
  SELECT * 
  FROM up_permissions 
  ORDER BY id
  LIMIT 5
`).all();

console.log('\nEjemplo de permisos:');
console.log(JSON.stringify(permissions, null, 2));

console.log('\n=== ASIGNACIÓN DE PERMISOS A ROLES ===\n');

const rolePermissions = db.prepare(`
  SELECT 
    r.id as role_id,
    r.name as role_name,
    r.type as role_type,
    COUNT(lnk.permission_id) as num_permissions
  FROM up_roles r
  LEFT JOIN up_permissions_role_lnk lnk ON r.id = lnk.role_id
  GROUP BY r.id
  ORDER BY r.id
`).all();

rolePermissions.forEach(rp => {
  console.log(`Role ID ${rp.role_id}: ${rp.role_name} (${rp.role_type}) - ${rp.num_permissions} permisos`);
});

console.log('\n=== ROLES DETALLADOS ===\n');

const roles = db.prepare('SELECT * FROM up_roles').all();
console.log(JSON.stringify(roles, null, 2));

db.close();
