module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/orden-de-trabajos/:id/finalize',
            handler: 'orden-de-trabajo.finalize',
            config: {
                auth: false, // Or define specific policies if needed, for now open to authenticated users via global config
            },
        },
    ],
};
