const sqlite3 = require('better-sqlite3');

try {
  const db = new sqlite3('.tmp/data.db');
  
  console.log('\n=== Tablas relacionadas con roles ===');
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND (name LIKE '%role%' OR name LIKE '%user%')
  `).all();
  console.log(JSON.stringify(tables, null, 2));
  
  console.log('\n=== Roles disponibles ===');
  const roles = db.prepare('SELECT * FROM up_roles').all();
  console.log(JSON.stringify(roles, null, 2));
  
  console.log('\n=== Usuarios ===');
  const users = db.prepare('SELECT id, username, email FROM up_users').all();
  console.log(JSON.stringify(users, null, 2));
  
  // Intentar encontrar la tabla de relación
  const linkTables = tables.filter(t => t.name.includes('link') || t.name.includes('lnk'));
  if (linkTables.length > 0) {
    console.log('\n=== Tablas de relación encontradas ===');
    linkTables.forEach(table => {
      console.log(`\n--- Contenido de ${table.name} ---`);
      const content = db.prepare(`SELECT * FROM ${table.name}`).all();
      console.log(JSON.stringify(content, null, 2));
    });
  }
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
}
