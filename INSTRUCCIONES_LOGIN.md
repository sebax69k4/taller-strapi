# 🔧 Solución al Error de Login

## ❌ Problema
Los usuarios están creados pero **NO tienen roles asignados**, por eso el login falla.

## ✅ Solución - Asignar Roles Manualmente

### Paso 1: Acceder al Panel de Admin
1. Abre tu navegador en: **http://localhost:1337/admin**
2. Si no tienes cuenta admin, créala ahora (solo la primera vez)

### Paso 2: Crear los Roles (si no existen)
1. Ve a **Settings** (⚙️ en la barra lateral izquierda)
2. Click en **USERS & PERMISSIONS PLUGIN** → **Roles**
3. Crea estos tres roles si no existen:
   - **Recepcionista**
   - **Encargado**
   - **Mecanico**

### Paso 3: Asignar Roles a los Usuarios
1. En Settings, ve a **USERS & PERMISSIONS PLUGIN** → **Users**
2. Verás 3 usuarios listados
3. Para cada usuario:

   **Usuario: recepcionista@taller.com**
   - Click en el usuario
   - En el campo **Role**, selecciona: **Recepcionista**
   - Click en **Save**

   **Usuario: encargado@taller.com**
   - Click en el usuario
   - En el campo **Role**, selecciona: **Encargado**
   - Click en **Save**

   **Usuario: mecanico@taller.com**
   - Click en el usuario
   - En el campo **Role**, selecciona: **Mecanico**
   - Click en **Save**

### Paso 4: Probar el Login
1. Ve a: **http://localhost:4322/login** (o el puerto que esté usando tu frontend)
2. Usa estas credenciales:

   ```
   Email: recepcionista@taller.com
   Password: Recepcion123
   ```

3. Deberías ser redirigido a: `/recepcion/dash_recep`

---

## 🎯 Credenciales Completas

| Rol | Email | Password | Dashboard |
|-----|-------|----------|-----------|
| Recepcionista | recepcionista@taller.com | Recepcion123 | /recepcion/dash_recep |
| Encargado | encargado@taller.com | Encargado123 | /encargado/dash_enc |
| Mecánico | mecanico@taller.com | Mecanico123 | /mecanico/dash_mec |

---

## 🚨 Si Sigue el Error

Si después de asignar los roles sigue el error de Content-Type:

1. **Limpia la caché del navegador** (Ctrl + Shift + Delete)
2. **Cierra y abre el navegador** completamente
3. **Verifica que Strapi esté corriendo**: http://localhost:1337
4. **Verifica que el frontend esté corriendo**: http://localhost:4322 (o 4321)
5. Intenta el login nuevamente

---

## 📝 Notas Importantes

- ⚠️ Los usuarios DEBEN tener un rol asignado para poder hacer login
- ⚠️ El nombre del rol debe coincidir EXACTAMENTE (case-sensitive)
- ⚠️ Ambos servidores deben estar corriendo (Strapi y Frontend)
- ⚠️ Si cambias el código, reinicia el frontend con Ctrl+C y luego `pnpm dev`
