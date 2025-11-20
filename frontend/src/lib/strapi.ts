// Configuración de Strapi
export const STRAPI_URL = 'http://localhost:1337';

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

// Helper simplificado para fetch directo (reemplazo directo de fetch con bearer)
export async function strapiGet(endpoint: string) {
  return fetchStrapi(endpoint, { method: 'GET' });
}

export async function strapiPost(endpoint: string, body: any) {
  return fetchStrapi(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function strapiPut(endpoint: string, body: any) {
  return fetchStrapi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
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
