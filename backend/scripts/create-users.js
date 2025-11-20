/**
 * Script para crear usuarios con roles específicos en Strapi
 * Ejecutar con: node scripts/create-users.js
 */

const users = [
  {
    username: 'recepcionista',
    email: 'recepcionista@taller.com',
    password: 'Recepcion123',
    roleName: 'Recepcionista'
  },
  {
    username: 'encargado',
    email: 'encargado@taller.com',
    password: 'Encargado123',
    roleName: 'Encargado'
  },
  {
    username: 'mecanico',
    email: 'mecanico@taller.com',
    password: 'Mecanico123',
    roleName: 'Mecanico'
  }
];

async function createUsers() {
  const BASE_URL = 'http://localhost:1337';
  
  console.log('🚀 Iniciando creación de usuarios...\n');

  // Primero, obtener el token de admin (si existe)
  // Para este script, vamos a usar el endpoint público de registro
  
  for (const userData of users) {
    try {
      console.log(`📝 Creando usuario: ${userData.username}...`);
      
      // Registrar usuario
      const registerResponse = await fetch(`${BASE_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        if (errorData.error?.message?.includes('already taken')) {
          console.log(`⚠️  Usuario ${userData.username} ya existe, saltando...`);
          continue;
        }
        throw new Error(errorData.error?.message || 'Error al crear usuario');
      }

      const { jwt, user } = await registerResponse.json();
      console.log(`✅ Usuario ${userData.username} creado con ID: ${user.id}`);

      // Nota: Para asignar roles específicos, necesitas acceso al panel de administración
      // o usar la API de admin con un token de administrador
      console.log(`ℹ️  Debes asignar el rol "${userData.roleName}" manualmente en el panel de administración`);
      console.log(`   URL: ${BASE_URL}/admin`);
      console.log(`   Email: ${userData.email}\n`);

    } catch (error) {
      console.error(`❌ Error al crear ${userData.username}:`, error.message, '\n');
    }
  }

  console.log('✨ Proceso completado!');
  console.log('\n📋 RESUMEN DE CREDENCIALES:');
  console.log('=' .repeat(50));
  users.forEach(u => {
    console.log(`\n👤 ${u.roleName}:`);
    console.log(`   Email: ${u.email}`);
    console.log(`   Password: ${u.password}`);
  });
  console.log('\n' + '='.repeat(50));
  console.log('\n⚠️  IMPORTANTE: Asigna los roles correspondientes en:');
  console.log(`   ${BASE_URL}/admin/settings/users`);
}

// Ejecutar script
createUsers().catch(console.error);
