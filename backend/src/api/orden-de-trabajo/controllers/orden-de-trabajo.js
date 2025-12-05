'use strict';

/**
 * orden-de-trabajo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::orden-de-trabajo.orden-de-trabajo', ({ strapi }) => ({
    async finalize(ctx) {
        const { id } = ctx.params;

        try {
            // 1. Fetch the order with items_detalle
            const order = await strapi.entityService.findOne('api::orden-de-trabajo.orden-de-trabajo', id, {
                populate: ['presupuesto', 'factura', 'items_detalle', 'items_detalle.repuesto', 'items_detalle.servicio']
            });

            if (!order) {
                return ctx.notFound('Orden no encontrada');
            }

            // 2. Check if already has invoice
            if (order.factura) {
                const updatedOrder = await strapi.entityService.update('api::orden-de-trabajo.orden-de-trabajo', id, {
                    data: { estado: 'finalizado' }
                });
                return updatedOrder;
            }

            // 3. Calculate totals from items_detalle
            let subtotal = 0;
            const desglose = {
                servicios: [],
                repuestos: [],
                mano_obra: [],
                otros: []
            };

            if (order.items_detalle && order.items_detalle.length > 0) {
                for (const item of order.items_detalle) {
                    const itemSubtotal = Number(item.subtotal) || (Number(item.precio_unitario) * Number(item.cantidad));
                    subtotal += itemSubtotal;

                    const desgloseItem = {
                        descripcion: item.descripcion,
                        cantidad: item.cantidad,
                        precio_unitario: Number(item.precio_unitario),
                        subtotal: itemSubtotal
                    };

                    // Categorize by type
                    switch (item.tipo) {
                        case 'servicio':
                            desglose.servicios.push(desgloseItem);
                            break;
                        case 'repuesto':
                            desglose.repuestos.push(desgloseItem);
                            // Decrease stock for parts
                            if (item.repuesto?.id) {
                                const currentStock = item.repuesto.stock || 0;
                                const newStock = Math.max(0, currentStock - item.cantidad);
                                await strapi.entityService.update('api::repuesto.repuesto', item.repuesto.id, {
                                    data: { stock: newStock }
                                });
                            }
                            break;
                        case 'mano_obra':
                            desglose.mano_obra.push(desgloseItem);
                            break;
                        default:
                            desglose.otros.push(desgloseItem);
                    }
                }
            } else if (order.presupuesto?.monto_total) {
                // Fallback to budget if no items
                subtotal = Math.round(Number(order.presupuesto.monto_total) / 1.19);
            } else {
                // Fallback default labor
                subtotal = 75000;
                desglose.mano_obra.push({
                    descripcion: 'Mano de obra general',
                    cantidad: 1,
                    precio_unitario: 75000,
                    subtotal: 75000
                });
            }

            const iva = Math.round(subtotal * 0.19);
            const total = subtotal + iva;
            const invoiceNumber = `FACT-${Date.now()}-${order.id}`;

            // 4. Create Invoice with desglose
            const invoice = await strapi.entityService.create('api::factura.factura', {
                data: {
                    numero_factura: invoiceNumber,
                    fecha_emision: new Date().toISOString().split('T')[0],
                    subtotal: subtotal,
                    iva: iva,
                    total: total,
                    orden_de_trabajo: id,
                    desglose: desglose,
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

