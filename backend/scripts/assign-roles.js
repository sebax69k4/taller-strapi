/**
 * Script para asignar roles a los usuarios en Strapi
 * Ejecutar DESPUÉS de crear los roles en el panel de administración
 * Uso: node scripts/assign-roles.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function assignRoles() {
  const BASE_URL = 'http://localhost:1337';
  
  console.log('\n🔐 ASIGNACIÓN DE ROLES - Strapi\n');
  console.log('Para asignar roles necesitas autenticarte como administrador.\n');
  
  const adminEmail = await question('Email de administrador: ');
  const adminPassword = await question('Password de administrador: ');
  
  console.log('\n🔄 Autenticando...');
  
  try {
    // Autenticar como admin
    const loginResponse = await fetch(`${BASE_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: adminEmail,
        password: adminPassword,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Credenciales de administrador incorrectas');
    }

    const { jwt } = await loginResponse.json();
    console.log('✅ Autenticación exitosa\n');

    // Obtener todos los roles
    console.log('📋 Obteniendo roles disponibles...');
    const rolesResponse = await fetch(`${BASE_URL}/api/users-permissions/roles`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!rolesResponse.ok) {
      throw new Error('No se pudieron obtener los roles');
    }

    const { roles } = await rolesResponse.json();
    console.log(`✅ Se encontraron ${roles.length} roles\n`);

    // Mapear nombres de roles a IDs
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
      console.log(`   - ${role.name} (ID: ${role.id})`);
    });

    // Obtener todos los usuarios
    console.log('\n👥 Obteniendo usuarios...');
    const usersResponse = await fetch(`${BASE_URL}/api/users?populate=role`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!usersResponse.ok) {
      throw new Error('No se pudieron obtener los usuarios');
    }

    const users = await usersResponse.json();
    console.log(`✅ Se encontraron ${users.length} usuarios\n`);

    // Asignaciones de rol basadas en el email
    const assignments = [
      { email: 'recepcionista@taller.com', roleName: 'Recepcionista' },
      { email: 'encargado@taller.com', roleName: 'Encargado' },
      { email: 'mecanico@taller.com', roleName: 'Mecanico' },
    ];

    console.log('🔄 Asignando roles...\n');

    for (const assignment of assignments) {
      const user = users.find(u => u.email === assignment.email);
      
      if (!user) {
        console.log(`⚠️  Usuario ${assignment.email} no encontrado, saltando...`);
        continue;
      }

      const roleId = roleMap[assignment.roleName];
      
      if (!roleId) {
        console.log(`⚠️  Rol "${assignment.roleName}" no encontrado, saltando...`);
        console.log(`   Asegúrate de crear el rol en: ${BASE_URL}/admin/settings/users-permissions/roles`);
        continue;
      }

      // Actualizar el rol del usuario
      const updateResponse = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: roleId,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.log(`❌ Error al asignar rol a ${user.username}:`, errorData.error?.message);
        continue;
      }

      console.log(`✅ Rol "${assignment.roleName}" asignado a ${user.username} (${user.email})`);
    }

    console.log('\n✨ Proceso completado!\n');
    console.log('Ahora los usuarios pueden iniciar sesión con sus credenciales:');
    console.log('=' .repeat(60));
    assignments.forEach(a => {
      console.log(`\n${a.roleName}:`);
      console.log(`   Email: ${a.email}`);
      console.log(`   Ver password en scripts/create-users.js`);
    });
    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

assignRoles();
