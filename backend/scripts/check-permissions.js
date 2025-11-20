const sqlite3 = require('better-sqlite3');

try {
  const db = new sqlite3('.tmp/data.db');
  
  console.log('\n=== Permisos de users-permissions ===');
  const permissions = db.prepare(`
    SELECT 
      p.id,
      p.action,
      p.enabled,
      r.name as role_name,
      r.id as role_id
    FROM up_permissions p
    JOIN up_roles r ON r.id IN (
      SELECT role_id FROM up_permissions_role_lnk WHERE permission_id = p.id
    )
    WHERE p.action LIKE '%user%' OR p.action LIKE '%me%'
    ORDER BY r.name, p.action
  `).all();
  
  console.log(JSON.stringify(permissions, null, 2));
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
}
