import { defineMiddleware } from "astro:middleware";

const protectedRoutes: Record<string, string> = {
    "/encargado": "encargado",
    "/mecanico": "mecanico",
    "/recepcion": "recepcionista",
};

export const onRequest = defineMiddleware(async (context, next) => {
    const pathname = context.url.pathname;
    
    // Permitir acceso público a login y home
    if (pathname === '/login' || pathname === '/' || pathname === '/acceso-denegado') {
        return next();
    }

    const protectedPath = Object.keys(protectedRoutes).find(route => pathname.startsWith(route));

    // Si la ruta no está protegida, continuar
    if (!protectedPath) {
        return next();
    }

    const userRole = context.cookies.get('user_role')?.value;

    // Si no hay sesión, redirigir al login
    if (!userRole) {
        return context.redirect('/login');
    }

    const requiredRole = protectedRoutes[protectedPath];

    // Verificar que el rol coincida
    if (userRole !== requiredRole) {
        return context.redirect('/acceso-denegado');
    }

    // Todo ok, continuar
    return next();
});
