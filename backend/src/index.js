'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Configurar permisos públicos automáticamente
    await setupPublicPermissions(strapi);
  },
};

/**
 * Configura los permisos públicos para todas las APIs del taller
 */
async function setupPublicPermissions(strapi) {
  const actions = ['find', 'findOne', 'create', 'update', 'delete'];
  
  const contentTypes = [
    'api::cliente.cliente',
    'api::vehiculo.vehiculo',
    'api::mecenico.mecenico',
    'api::orden-de-trabajo.orden-de-trabajo',
    'api::repuesto.repuesto',
    'api::factura.factura',
    'api::bitacora.bitacora',
    'api::presupuesto.presupuesto',
    'api::servicio.servicio',
    'api::zona.zona',
    'api::solicitud-de-repuesto.solicitud-de-repuesto',
  ];

  try {
    // Obtener el rol "Public"
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      console.log('⚠️  No se encontró el rol Public');
      return;
    }

    // Para cada content-type, habilitar las acciones
    for (const contentType of contentTypes) {
      for (const action of actions) {
        const actionId = `${contentType}.${action}`;
        
        // Verificar si el permiso ya existe
        const existingPermission = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({
            where: {
              action: actionId,
              role: publicRole.id,
            },
          });

        if (!existingPermission) {
          // Crear el permiso
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: actionId,
              role: publicRole.id,
            },
          });
        }
      }
    }

    console.log('✅ Permisos públicos configurados correctamente');
  } catch (error) {
    console.error('❌ Error configurando permisos:', error.message);
  }
}
