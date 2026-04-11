import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  '';

const baseUrl = rawBaseUrl ? `${rawBaseUrl.replace(/\/+$/, '')}/` : '';
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        const token = localStorage.getItem('hrms_token');
  
        console.log("TOKEN:", token); // log token
  
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
  
        headers.set('Content-Type', 'application/json');
  
        console.log("HEADERS:", Object.fromEntries(headers.entries())); // log headers zote
        return headers;
      },
    }),
    tagTypes: ['Users', 'Roles', 'Permissions', 'Auth'],
    endpoints: () => ({}),
  });