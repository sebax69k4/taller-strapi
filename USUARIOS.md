# Usuarios del Sistema Taller Veloz

## 📋 Resumen de Usuarios Creados

Se han creado 3 usuarios para el sistema con diferentes roles.

---

## 👥 Credenciales de Usuarios

### 1. 👨‍💼 Recepcionista
- **Email:** `recepcionista@taller.com`
- **Password:** `Recepcion123`
- **Rol:** Recepcionista
- **Dashboard:** `/recepcion/dash_recep`

### 2. 👨‍💼 Encargado
- **Email:** `encargado@taller.com`
- **Password:** `Encargado123`
- **Rol:** Encargado
- **Dashboard:** `/encargado/dash_enc`

### 3. 🔧 Mecánico
- **Email:** `mecanico@taller.com`
- **Password:** `Mecanico123`
- **Rol:** Mecanico
- **Dashboard:** `/mecanico/dash_mec`

---

## 🔧 Configuración de Roles

### Pasos para asignar roles (si no se hizo automáticamente):

1. Accede al panel de administración de Strapi:
   ```
   http://localhost:1337/admin
   ```

2. Ve a **Settings** → **Users & Permissions plugin** → **Roles**

3. Asegúrate de tener creados los siguientes roles:
   - `Recepcionista`
   - `Encargado`
   - `Mecanico`

4. Ve a **Settings** → **Users & Permissions plugin** → **Users**

5. Para cada usuario:
   - Haz clic en el usuario
   - En el campo **Role**, selecciona el rol correspondiente
   - Haz clic en **Save**

---

## 🚀 Scripts Disponibles

### Crear usuarios:
```bash
node scripts/create-users.js
```

### Asignar roles (requiere credenciales de admin):
```bash
node scripts/assign-roles.js
```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:** 
- Estas son credenciales de desarrollo
- Cambia las contraseñas en producción
- Usa contraseñas fuertes y únicas
- Considera implementar autenticación de dos factores

---

## 📝 Notas

- Los usuarios ya están creados en el sistema
- Si necesitas recrearlos, elimina primero los usuarios existentes desde el panel de admin
- Los roles deben existir en Strapi antes de asignarlos a los usuarios
- Cada rol tiene acceso a diferentes dashboards del frontend

---

## 🧪 Prueba de Login

Para probar el login:

1. Inicia el frontend:
   ```bash
   cd frontend
   pnpm dev
   ```

2. Accede a:
   ```
   http://localhost:4321/login
   ```

3. Usa cualquiera de las credenciales listadas arriba

4. Serás redirigido automáticamente al dashboard correspondiente según tu rol

---

## ❓ Solución de Problemas

### El usuario no puede iniciar sesión
- Verifica que el rol esté correctamente asignado en el panel de admin
- Asegúrate de que el rol tenga permisos configurados en Strapi
- Verifica que el backend esté corriendo en `http://localhost:1337`

### El usuario es redirigido incorrectamente
- Verifica que el nombre del rol coincida exactamente (case-sensitive):
  - `Recepcionista`
  - `Encargado`
  - `Mecanico`

### Error de autenticación
- Verifica que las credenciales sean correctas
- Asegúrate de que el usuario esté activado (confirmed: true)
- Revisa los logs del backend para más detalles

---

## 📞 Contacto

Si tienes problemas o necesitas ayuda adicional, revisa los logs de Strapi o el frontend para más información.
