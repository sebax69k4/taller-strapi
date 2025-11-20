/**
 * CRUD Operations Library for Strapi v5
 * Funciones genéricas para operaciones CRUD en todas las entidades
 */

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN || '';

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

/**
 * Construye query params para populate en Strapi v5
 */
export function buildPopulateParams(fields: string[]): string {
  if (fields.length === 0) return '';
  return fields.map((field, index) => `populate[${index}]=${field}`).join('&');
}

/**
 * GET - Obtener todos los registros de una colección
 */
export async function getAll<T>(
  collection: string,
  options: {
    populate?: string[];
    filters?: Record<string, any>;
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  } = {}
): Promise<StrapiResponse<T[]>> {
  const params = new URLSearchParams();
  
  // Populate
  if (options.populate && options.populate.length > 0) {
    options.populate.forEach((field, index) => {
      params.append(`populate[${index}]`, field);
    });
  }
  
  // Filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      params.append(`filters[${key}]`, String(value));
    });
  }
  
  // Sort
  if (options.sort) {
    params.append('sort', options.sort);
  }
  
  // Pagination
  if (options.pagination) {
    if (options.pagination.page) {
      params.append('pagination[page]', String(options.pagination.page));
    }
    if (options.pagination.pageSize) {
      params.append('pagination[pageSize]', String(options.pagination.pageSize));
    }
  }
  
  const queryString = params.toString();
  const url = `${STRAPI_URL}/api/${collection}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: STRAPI_TOKEN ? {
      'Authorization': `Bearer ${STRAPI_TOKEN}`
    } : {}
  });
  
  if (!response.ok) {
    const error: StrapiError = await response.json();
    throw new Error(error.error.message || `Error fetching ${collection}`);
  }
  
  return response.json();
}

/**
 * GET - Obtener un registro por ID
 */
export async function getById<T>(
  collection: string,
  id: number | string,
  options: {
    populate?: string[];
  } = {}
): Promise<StrapiResponse<T>> {
  const params = new URLSearchParams();
  
  if (options.populate && options.populate.length > 0) {
    options.populate.forEach((field, index) => {
      params.append(`populate[${index}]`, field);
    });
  }
  
  const queryString = params.toString();
  const url = `${STRAPI_URL}/api/${collection}/${id}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: STRAPI_TOKEN ? {
      'Authorization': `Bearer ${STRAPI_TOKEN}`
    } : {}
  });
  
  if (!response.ok) {
    const error: StrapiError = await response.json();
    throw new Error(error.error.message || `Error fetching ${collection} with id ${id}`);
  }
  
  return response.json();
}

/**
 * POST - Crear un nuevo registro
 */
export async function create<T>(
  collection: string,
  data: any
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api/${collection}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
    },
    body: JSON.stringify({ data })
  });
  
  if (!response.ok) {
    const error: StrapiError = await response.json();
    throw new Error(error.error.message || `Error creating ${collection}`);
  }
  
  return response.json();
}

/**
 * PUT - Actualizar un registro existente
 */
export async function update<T>(
  collection: string,
  id: number | string,
  data: any
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api/${collection}/${id}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
    },
    body: JSON.stringify({ data })
  });
  
  if (!response.ok) {
    const error: StrapiError = await response.json();
    throw new Error(error.error.message || `Error updating ${collection} with id ${id}`);
  }
  
  return response.json();
}

/**
 * DELETE - Eliminar un registro
 */
export async function remove<T>(
  collection: string,
  id: number | string
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api/${collection}/${id}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: STRAPI_TOKEN ? {
      'Authorization': `Bearer ${STRAPI_TOKEN}`
    } : {}
  });
  
  if (!response.ok) {
    const error: StrapiError = await response.json();
    throw new Error(error.error.message || `Error deleting ${collection} with id ${id}`);
  }
  
  return response.json();
}

// ============== Funciones específicas por entidad ==============

/**
 * CLIENTES
 */
export const clientes = {
  getAll: (populate = ['vehiculos']) => getAll('clientes', { populate, sort: 'nombre:asc' }),
  getById: (id: number | string, populate = ['vehiculos']) => getById('clientes', id, { populate }),
  create: (data: any) => create('clientes', data),
  update: (id: number | string, data: any) => update('clientes', id, data),
  delete: (id: number | string) => remove('clientes', id),
};

/**
 * VEHICULOS
 */
export const vehiculos = {
  getAll: (populate = ['cliente', 'mecanico', 'orden_de_trabajos']) => 
    getAll('vehiculos', { populate, sort: 'patente:asc' }),
  getById: (id: number | string, populate = ['cliente', 'mecanico', 'orden_de_trabajos']) => 
    getById('vehiculos', id, { populate }),
  create: (data: any) => create('vehiculos', data),
  update: (id: number | string, data: any) => update('vehiculos', id, data),
  delete: (id: number | string) => remove('vehiculos', id),
  getByCliente: (clienteId: number | string) => 
    getAll('vehiculos', { 
      filters: { 'cliente': { 'id': { '$eq': clienteId } } },
      populate: ['cliente']
    }),
};

/**
 * REPUESTOS
 */
export const repuestos = {
  getAll: (populate = ['servicios', 'orden_de_trabajos']) => 
    getAll('repuestos', { populate, sort: 'nombre:asc' }),
  getById: (id: number | string, populate = ['servicios', 'orden_de_trabajos']) => 
    getById('repuestos', id, { populate }),
  create: (data: any) => create('repuestos', data),
  update: (id: number | string, data: any) => update('repuestos', id, data),
  delete: (id: number | string) => remove('repuestos', id),
  getLowStock: () => 
    getAll('repuestos', { 
      filters: { 'stock': { '$lte': { '$ref': 'stock_minimo' } } },
      sort: 'stock:asc'
    }),
};

/**
 * MECANICOS
 */
export const mecanicos = {
  getAll: (populate = ['servicios', 'orden_de_trabajos', 'zona', 'vehiculos', 'bitacoras']) => 
    getAll('mecenico', { populate, sort: 'nombre:asc' }),
  getById: (id: number | string, populate = ['servicios', 'orden_de_trabajos', 'zona']) => 
    getById('mecenico', id, { populate }),
  create: (data: any) => create('mecenico', data),
  update: (id: number | string, data: any) => update('mecenico', id, data),
  delete: (id: number | string) => remove('mecenico', id),
  getByEstado: (estado: string) => 
    getAll('mecenico', { 
      filters: { 'estado': { '$eq': estado } },
      populate: ['zona']
    }),
  getByEmail: (email: string) => 
    getAll('mecenico', { 
      filters: { 'email': { '$eq': email } }
    }),
};

/**
 * ZONAS
 */
export const zonas = {
  getAll: (populate = ['orden_de_trabajos', 'mecanicos']) => 
    getAll('zonas', { populate, sort: 'nombre:asc' }),
  getById: (id: number | string, populate = ['orden_de_trabajos', 'mecanicos']) => 
    getById('zonas', id, { populate }),
  create: (data: any) => create('zonas', data),
  update: (id: number | string, data: any) => update('zonas', id, data),
  delete: (id: number | string) => remove('zonas', id),
};

/**
 * ORDENES DE TRABAJO
 */
export const ordenDeTrabajo = {
  getAll: (populate = ['vehiculo', 'mecanico', 'zona', 'presupuesto', 'factura', 'repuestos', 'bitacoras']) => 
    getAll('orden-de-trabajos', { populate, sort: 'fecha_ingreso:desc' }),
  getById: (id: number | string, populate = ['vehiculo', 'mecanico', 'zona', 'presupuesto', 'factura', 'repuestos', 'bitacoras']) => 
    getById('orden-de-trabajos', id, { populate }),
  create: (data: any) => create('orden-de-trabajos', data),
  update: (id: number | string, data: any) => update('orden-de-trabajos', id, data),
  delete: (id: number | string) => remove('orden-de-trabajos', id),
  getByEstado: (estado: string, populate = ['vehiculo', 'mecanico', 'zona']) => 
    getAll('orden-de-trabajos', { 
      filters: { 'estado': { '$eq': estado } },
      populate,
      sort: 'fecha_ingreso:desc'
    }),
  getByMecanico: (mecanicoId: number | string) => 
    getAll('orden-de-trabajos', { 
      filters: { 'mecanico': { 'id': { '$eq': mecanicoId } } },
      populate: ['vehiculo', 'zona'],
      sort: 'fecha_ingreso:desc'
    }),
  getByZona: (zonaId: number | string) => 
    getAll('orden-de-trabajos', { 
      filters: { 'zona': { 'id': { '$eq': zonaId } } },
      populate: ['vehiculo', 'mecanico'],
      sort: 'fecha_ingreso:desc'
    }),
};

/**
 * SERVICIOS
 */
export const servicios = {
  getAll: (populate = ['vehiculo', 'mecenico', 'repuestos']) => 
    getAll('servicios', { populate, sort: 'fecha_ingreso:desc' }),
  getById: (id: number | string, populate = ['vehiculo', 'mecenico', 'repuestos']) => 
    getById('servicios', id, { populate }),
  create: (data: any) => create('servicios', data),
  update: (id: number | string, data: any) => update('servicios', id, data),
  delete: (id: number | string) => remove('servicios', id),
};

/**
 * BITACORAS
 */
export const bitacoras = {
  getAll: (populate = ['orden_de_trabajo', 'mecanico']) => 
    getAll('bitacoras', { populate, sort: 'fecha:desc' }),
  getById: (id: number | string, populate = ['orden_de_trabajo', 'mecanico']) => 
    getById('bitacoras', id, { populate }),
  create: (data: any) => create('bitacoras', data),
  update: (id: number | string, data: any) => update('bitacoras', id, data),
  delete: (id: number | string) => remove('bitacoras', id),
  getByOrden: (ordenId: number | string) => 
    getAll('bitacoras', { 
      filters: { 'orden_de_trabajo': { 'id': { '$eq': ordenId } } },
      populate: ['mecanico'],
      sort: 'fecha:desc'
    }),
};

/**
 * PRESUPUESTOS
 */
export const presupuestos = {
  getAll: (populate = ['orden_de_trabajo']) => 
    getAll('presupuestos', { populate, sort: 'fecha_generacion:desc' }),
  getById: (id: number | string, populate = ['orden_de_trabajo']) => 
    getById('presupuestos', id, { populate }),
  create: (data: any) => create('presupuestos', data),
  update: (id: number | string, data: any) => update('presupuestos', id, data),
  delete: (id: number | string) => remove('presupuestos', id),
};

/**
 * FACTURAS
 */
export const facturas = {
  getAll: (populate = ['orden_de_trabajo']) => 
    getAll('facturas', { populate, sort: 'fecha_emision:desc' }),
  getById: (id: number | string, populate = ['orden_de_trabajo']) => 
    getById('facturas', id, { populate }),
  create: (data: any) => create('facturas', data),
  update: (id: number | string, data: any) => update('facturas', id, data),
  delete: (id: number | string) => remove('facturas', id),
};
