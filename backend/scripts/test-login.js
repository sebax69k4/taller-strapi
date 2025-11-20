async function testLogin(email, password) {
  try {
    console.log(`\n=== Probando login para: ${email} ===`);
    
    const postData = JSON.stringify({
      identifier: email,
      password: password
    });
    
    const response = await new Promise((resolve, reject) => {
      const req = require('http').request({
        hostname: 'localhost',
        port: 1337,
        path: '/api/auth/local',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: { error: data } });
          }
        });
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.jwt) {
      console.log('✅ Login exitoso!');
      console.log('JWT recibido:', response.data.jwt.substring(0, 20) + '...');
      
      // Ahora probamos obtener el usuario con rol
      const userResponse = await new Promise((resolve, reject) => {
        const req = require('http').request({
          hostname: 'localhost',
          port: 1337,
          path: '/api/users/me?populate=role',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${response.data.jwt}`
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ error: data });
            }
          });
        });
        
        req.on('error', reject);
        req.end();
      });
      
      console.log('\nDatos del usuario:');
      console.log(JSON.stringify(userResponse, null, 2));
    } else {
      console.log('❌ Login fallido');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testAllUsers() {
  await testLogin('recepcionista@taller.com', 'Recepcion123');
  await testLogin('mecanico@taller.com', 'Mecanico123');
  await testLogin('enc@enc.com', 'Encargado123');
}

testAllUsers();
