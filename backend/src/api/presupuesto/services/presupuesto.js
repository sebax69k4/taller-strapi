'use strict';

/**
 * presupuesto service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::presupuesto.presupuesto');
