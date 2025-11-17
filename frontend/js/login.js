document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('message');
  const remember = document.getElementById('remember');

  // Restore remembered email
  try{
    const saved = localStorage.getItem('login_email');
    if(saved){ email.value = saved; remember.checked = true }
  }catch(e){}

  toggle.addEventListener('click', ()=>{
    const t = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', t);
    toggle.textContent = t === 'password' ? 'Mostrar' : 'Ocultar';
  });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    message.textContent = '';

    if(!email.checkValidity()){ message.textContent = 'Introduce un correo válido.'; return }
    if(password.value.length < 6){ message.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return }

    // Remember email if requested
    try{
      if(remember.checked) localStorage.setItem('login_email', email.value);
      else localStorage.removeItem('login_email');
    }catch(e){}

    message.textContent = 'Iniciando sesión...';

    // Envío al backend. Ajusta la URL según tu API (Strapi por defecto usa /api/auth/local o /auth/local dependiendo de la versión)
    const url = '/auth/local';
    const payload = { identifier: email.value, password: password.value };

    try{
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if(res.ok){
        message.style.color = 'green';
        message.textContent = 'Inicio de sesión correcto. Redirigiendo...';
        // Guarda token si tu backend lo devuelve
        if(data.jwt) localStorage.setItem('auth_token', data.jwt);
        setTimeout(()=>{ window.location.href = '/'; }, 800);
      }else{
        message.style.color = 'crimson';
        // Mostrar mensaje de error del servidor si existe
        message.textContent = data.message || data.error || JSON.stringify(data);
      }
    }catch(err){
      message.style.color = 'crimson';
      message.textContent = 'Error de red. Comprueba tu conexión y la URL del backend.';
      console.error(err);
    }
  });
});
