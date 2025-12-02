// API Proxy para Strapi - permite búsquedas desde el frontend
export const prerender = false;

import type { APIRoute } from 'astro';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const strapiPath = url.pathname.replace('/api/strapi/', '/api/');
  const queryString = url.search;
  
  try {
    const response = await fetch(`${STRAPI_URL}${strapiPath}${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
