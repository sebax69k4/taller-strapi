'use strict';

/**
 * orden-de-trabajo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::orden-de-trabajo.orden-de-trabajo', ({ strapi }) => ({
    async finalize(ctx) {
        const { id } = ctx.params;

        try {
            // 1. Fetch the order with necessary relations
            const order = await strapi.entityService.findOne('api::orden-de-trabajo.orden-de-trabajo', id, {
                populate: ['presupuesto', 'repuestos', 'factura']
            });

            if (!order) {
                return ctx.notFound('Orden no encontrada');
            }

            // 2. Check if already finalized or has invoice
            if (order.factura) {
                // Just update status if needed
                const updatedOrder = await strapi.entityService.update('api::orden-de-trabajo.orden-de-trabajo', id, {
                    data: { estado: 'finalizado' }
                });
                return updatedOrder;
            }

            // 2.1 Validate Stock Availability
            if (order.repuestos && order.repuestos.length > 0) {
                for (const repuesto of order.repuestos) {
                    // Fetch current stock
                    const item = await strapi.entityService.findOne('api::repuesto.repuesto', repuesto.id);

                    if (!item) {
                        return ctx.badRequest(`El repuesto con ID ${repuesto.id} no existe.`);
                    }

                    // Assuming 'cantidad' in the relation is not directly available, we might need a pivot table or logic.
                    // However, in this simple schema, let's assume we are just checking if the item has stock > 0
                    // OR if the order has a specific quantity requested (which might be in a component or pivot).
                    // For now, let's assume we just check if stock > 0 for any part used.
                    // A more robust implementation would need a 'cantidad_usada' field.

                    if (item.stock < 1) { // Simplification: assume 1 unit per relation for now if no quantity field
                        return ctx.badRequest(`No hay stock suficiente para el repuesto: ${item.nombre}`);
                    }
                }
            }

            // 3. Calculate totals
            let total = 0;
            let subtotal = 0;

            if (order.presupuesto && order.presupuesto.monto_total) {
                total = Number(order.presupuesto.monto_total);
                subtotal = Math.round(total / 1.19);
            } else {
                const partsTotal = order.repuestos?.reduce((sum, r) => sum + (Number(r.precio) || 0), 0) || 0;
                const labor = 75000;
                subtotal = partsTotal + labor;
                total = Math.round(subtotal * 1.19);
            }

            const iva = total - subtotal;
            const invoiceNumber = `FACT-${Date.now()}-${order.id}`;

            // 4. Create Invoice
            const invoice = await strapi.entityService.create('api::factura.factura', {
                data: {
                    numero_factura: invoiceNumber,
                    fecha_emision: new Date().toISOString().split('T')[0],
                    subtotal: subtotal,
                    iva: iva,
                    total: total,
                    orden_de_trabajo: id,
                    publishedAt: new Date()
                }
            });

            // 5. Update Order Status
            const updatedOrder = await strapi.entityService.update('api::orden-de-trabajo.orden-de-trabajo', id, {
                data: {
                    estado: 'finalizado',
                    factura: invoice.id
                }
            });

            return updatedOrder;

        } catch (err) {
            strapi.log.error('Error finalizing order:', err);
            return ctx.badRequest('Error al finalizar la orden', { moreDetails: err.message });
        }
    }
}));
