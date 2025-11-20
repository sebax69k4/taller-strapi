const sqlite3 = require('better-sqlite3');

const db = new sqlite3('.tmp/data.db');

console.log('\n=== DATOS COMPLETOS DEL USUARIO recepcionista ===\n');

const user = db.prepare(`
  SELECT 
    u.*,
    r.id as role_id,
    r.name as role_name,
    r.type as role_type
  FROM up_users u
  LEFT JOIN up_users_role_lnk lnk ON u.id = lnk.user_id
  LEFT JOIN up_roles r ON lnk.role_id = r.id
  WHERE u.email = 'recepcionista@taller.com'
`).get();

console.log(JSON.stringify(user, null, 2));

db.close();
