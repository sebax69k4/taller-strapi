// Configuración de Strapi
export const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'https://engaging-bubble-5a6bf0674c.strapiapp.com';

// Helper para hacer peticiones a Strapi (sin autenticación - APIs públicas)
export async function fetchStrapi(endpoint: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

// Helper simplificado para GET que aplana la estructura de Strapi
export async function strapiGet(endpoint: string) {
  const response = await fetchStrapi(endpoint, { method: 'GET' });
  
  // En Strapi v5, los datos ya vienen planos (sin attributes wrapper)
  // Solo necesitamos devolver la respuesta tal cual
  return response;
}

// Función recursiva para aplanar la estructura de Strapi
function flattenAttributes(data: any): any {
  // Check if data is a plain object; null, arrays, and non-objects are returned as is
  if (!data || typeof data !== 'object') {
    return data;
  }

  // If it's an array, map over it
  if (Array.isArray(data)) {
    return data.map(flattenAttributes);
  }

  // Handle the "data" wrapper
  if (data.data !== undefined) {
    return flattenAttributes(data.data);
  }

  // Handle the "attributes" wrapper
  if (data.attributes !== undefined) {
    const { attributes, id, documentId, ...rest } = data;
    return {
      id,
      documentId,
      ...rest,
      ...flattenAttributes(attributes),
    };
  }

  // Recursively flatten all keys in the object
  const flattened: any = {};
  for (const key in data) {
    flattened[key] = flattenAttributes(data[key]);
  }
  return flattened;
}


export async function strapiPost(endpoint: string, body: any) {
  return fetchStrapi(endpoint, {
    method: 'POST',
    body: JSON.stringify({ data: body })
  });
}

export async function strapiPut(endpoint: string, body: any) {
  return fetchStrapi(endpoint, {
    method: 'PUT',
    body: JSON.stringify({ data: body })
  });
}

export async function strapiDelete(endpoint: string) {
  return fetchStrapi(endpoint, { method: 'DELETE' });
}

// Helper para obtener todos los elementos de una colección
export async function getStrapiCollection(collection: string) {
  return fetchStrapi(`/api/${collection}?populate=*`);
}

// Helper para obtener un elemento por ID
export async function getStrapiItem(collection: string, id: string | number) {
  return fetchStrapi(`/api/${collection}/${id}?populate=*`);
}

// Helper para crear un elemento
export async function createStrapiItem(collection: string, data: any) {
  return fetchStrapi(`/api/${collection}`, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

// Helper para actualizar un elemento
export async function updateStrapiItem(collection: string, id: string | number, data: any) {
  return fetchStrapi(`/api/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

// Helper para eliminar un elemento
export async function deleteStrapiItem(collection: string, id: string | number) {
  return fetchStrapi(`/api/${collection}/${id}`, {
    method: 'DELETE',
  });
}
