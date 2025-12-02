// API para obtener notificaciones del sistema filtradas por rol
export const prerender = false;

import type { APIRoute } from 'astro';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const notifications: Notification[] = [];
  
  // Obtener rol del usuario desde cookies
  const userRole = cookies.get('user_role')?.value || '';
  
  try {
    // ==========================================
    // NOTIFICACIONES PARA RECEPCIONISTA
    // ==========================================
    if (userRole === 'recepcionista' || userRole === 'admin') {
      // Órdenes finalizadas pendientes de facturar
      const finalizadasRes = await fetch(`${STRAPI_URL}/api/orden-de-trabajos?filters[estado][$eq]=finalizado&pagination[pageSize]=5&sort=updatedAt:desc`);
      const finalizadasData = await finalizadasRes.json();
      
      if (finalizadasData.data) {
        finalizadasData.data.forEach((orden: any) => {
          notifications.push({
            id: `factura-${orden.id}`,
            type: 'success',
            title: 'Orden lista para facturar',
            message: `Orden #${orden.id} está finalizada y lista para facturar`,
            time: getRelativeTime(orden.updatedAt),
            read: false
          });
        });
      }
      
      // Órdenes facturadas pendientes de pago/entrega
      const facturadasRes = await fetch(`${STRAPI_URL}/api/orden-de-trabajos?filters[estado][$eq]=facturado&pagination[pageSize]=5&sort=updatedAt:desc`);
      const facturadasData = await facturadasRes.json();
      
      if (facturadasData.data) {
        facturadasData.data.forEach((orden: any) => {
          notifications.push({
            id: `entrega-${orden.id}`,
            type: 'info',
            title: 'Pendiente de entrega',
            message: `Orden #${orden.id} facturada, esperando pago y entrega`,
            time: getRelativeTime(orden.updatedAt),
            read: false
          });
        });
      }
    }
    
    // ==========================================
    // NOTIFICACIONES PARA ENCARGADO
    // ==========================================
    if (userRole === 'encargado' || userRole === 'admin') {
      // Órdenes nuevas que requieren asignación
      const ordenesRes = await fetch(`${STRAPI_URL}/api/orden-de-trabajos?filters[estado][$eq]=ingresado&sort=createdAt:desc&pagination[pageSize]=5`);
      const ordenesData = await ordenesRes.json();
      
      if (ordenesData.data) {
        ordenesData.data.forEach((orden: any) => {
          notifications.push({
            id: `orden-${orden.id}`,
            type: 'info',
            title: 'Nueva orden sin asignar',
            message: `Orden #${orden.id} requiere asignación de mecánico`,
            time: getRelativeTime(orden.createdAt),
            read: false
          });
        });
      }
      
      // Alertas de stock bajo
      const stockRes = await fetch(`${STRAPI_URL}/api/repuestos?filters[stock][$lt]=5&pagination[pageSize]=5`);
      const stockData = await stockRes.json();
      
      if (stockData.data) {
        stockData.data.forEach((repuesto: any) => {
          notifications.push({
            id: `stock-${repuesto.id}`,
            type: 'warning',
            title: 'Stock bajo',
            message: `${repuesto.nombre}: solo ${repuesto.stock} unidades`,
            time: 'Ahora',
            read: false
          });
        });
      }
      
      // Solicitudes de repuestos pendientes
      const solicitudesRes = await fetch(`${STRAPI_URL}/api/solicitud-repuestos?filters[estado][$eq]=pendiente&pagination[pageSize]=5&sort=createdAt:desc`);
      const solicitudesData = await solicitudesRes.json();
      
      if (solicitudesData.data) {
        solicitudesData.data.forEach((sol: any) => {
          notifications.push({
            id: `solicitud-${sol.id}`,
            type: 'warning',
            title: 'Solicitud de repuesto',
            message: `Solicitud #${sol.id} pendiente de aprobación`,
            time: getRelativeTime(sol.createdAt),
            read: false
          });
        });
      }
    }
    
    // ==========================================
    // NOTIFICACIONES PARA MECÁNICO
    // ==========================================
    if (userRole === 'mecanico') {
      // Órdenes asignadas al mecánico (en diagnóstico o reparación)
      const misOrdenesRes = await fetch(`${STRAPI_URL}/api/orden-de-trabajos?filters[estado][$in][0]=en_diagnostico&filters[estado][$in][1]=en_reparacion&pagination[pageSize]=10&sort=updatedAt:desc`);
      const misOrdenesData = await misOrdenesRes.json();
      
      if (misOrdenesData.data) {
        misOrdenesData.data.forEach((orden: any) => {
          const estadoLabel = orden.estado === 'en_diagnostico' ? 'En Diagnóstico' : 'En Reparación';
          notifications.push({
            id: `trabajo-${orden.id}`,
            type: 'info',
            title: `Trabajo ${estadoLabel}`,
            message: `Orden #${orden.id} - ${estadoLabel.toLowerCase()}`,
            time: getRelativeTime(orden.updatedAt),
            read: false
          });
        });
      }
      
      // Solicitudes de repuestos aprobadas
      const aprobadosRes = await fetch(`${STRAPI_URL}/api/solicitud-repuestos?filters[estado][$eq]=aprobado&pagination[pageSize]=5&sort=updatedAt:desc`);
      const aprobadosData = await aprobadosRes.json();
      
      if (aprobadosData.data) {
        aprobadosData.data.forEach((sol: any) => {
          notifications.push({
            id: `aprobado-${sol.id}`,
            type: 'success',
            title: 'Repuesto aprobado',
            message: `Tu solicitud #${sol.id} fue aprobada`,
            time: getRelativeTime(sol.updatedAt),
            read: false
          });
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      notifications: notifications.slice(0, 10),
      unreadCount: notifications.length 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      notifications: [],
      unreadCount: 0,
      error: error.message 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-CL');
}
