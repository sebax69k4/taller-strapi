const sqlite3 = require('better-sqlite3');

const db = new sqlite3('.tmp/data.db');

console.log('\n=== HABILITANDO ACCESO PÚBLICO A TODAS LAS COLECCIONES ===\n');

try {
  // Obtener el ID del rol "Public" (id=2)
  const publicRole = db.prepare('SELECT * FROM up_roles WHERE type = ?').get('public');
  
  if (!publicRole) {
    console.error('❌ No se encontró el rol Public');
    process.exit(1);
  }

  console.log(`✓ Rol Public encontrado (ID: ${publicRole.id})`);

  // Obtener todos los permisos de las APIs
  const apiPermissions = db.prepare(`
    SELECT id, action 
    FROM up_permissions 
    WHERE action NOT LIKE 'plugin::users-permissions%'
    AND action NOT LIKE 'plugin::upload%'
  `).all();

  console.log(`\n📋 Permisos de API encontrados: ${apiPermissions.length}\n`);

  // Asignar todos los permisos al rol Public
  let assigned = 0;
  let skipped = 0;

  apiPermissions.forEach((perm, index) => {
    // Verificar si ya existe
    const existing = db.prepare(`
      SELECT * FROM up_permissions_role_lnk 
      WHERE permission_id = ? AND role_id = ?
    `).get(perm.id, publicRole.id);

    if (existing) {
      skipped++;
      return;
    }

    // Obtener el siguiente orden
    const lastOrd = db.prepare(`
      SELECT MAX(permission_ord) as max_ord 
      FROM up_permissions_role_lnk 
      WHERE role_id = ?
    `).get(publicRole.id);

    const nextOrd = (lastOrd.max_ord || 0) + 1;

    // Insertar
    db.prepare(`
      INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
      VALUES (?, ?, ?)
    `).run(perm.id, publicRole.id, nextOrd);

    assigned++;
    console.log(`  ✅ ${assigned}. ${perm.action}`);
  });

  console.log(`\n📊 Resumen:`);
  console.log(`   - Permisos asignados: ${assigned}`);
  console.log(`   - Permisos ya existentes: ${skipped}`);
  console.log(`   - Total: ${apiPermissions.length}`);

  console.log(`\n✅ PROCESO COMPLETADO - Todas las APIs son ahora públicas\n`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
