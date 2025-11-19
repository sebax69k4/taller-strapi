import { defineMiddleware } from "astro:middleware";

const protectedRoutes: Record<string, string> = {
    "/encargado": "Encargado",
    "/mecanico": "Mecanico",
    "/recepcion": "Recepcionista",
};

export const onRequest = defineMiddleware(async (context, next) => {
    const pathname = context.url.pathname;
    
    const protectedPath = Object.keys(protectedRoutes).find(route => pathname.startsWith(route));

    // Si la ruta no está protegida, continuar sin hacer nada
    if (!protectedPath) {
        return next();
    }

    const token = context.cookies.get('jwt')?.value;

    // Si no hay token, redirigir al login
    if (!token) {
        return context.redirect('/login');
    }

    try {
        // Verificar el token y obtener el rol del usuario desde Strapi
        const response = await fetch('http://localhost:1337/api/users/me?populate=role', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        // Si el token es inválido o expiró, Strapi devolverá un error
        if (!response.ok) {
            context.cookies.delete('jwt', { path: '/' });
            return context.redirect('/login');
        }

        const user = await response.json();
        const userRole = user.role?.name;
        const requiredRole = protectedRoutes[protectedPath];

        // Si el rol del usuario no coincide con el rol requerido, redirigir a acceso denegado
        if (userRole !== requiredRole) {
            return context.redirect('/acceso-denegado');
        }

        // Si todo está en orden, continuar a la página solicitada
        return next();

    } catch (error) {
        // Ante cualquier error de red, redirigir al login
        console.error('Error validating token:', error);
        context.cookies.delete('jwt', { path: '/' });
        return context.redirect('/login');
    }
});
