import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  '';

const baseUrl = rawBaseUrl ? `${rawBaseUrl.replace(/\/+$/, '')}/` : '';

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('hrms_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// ── Token refresh ──
// Module-level promise acts as a mutex: concurrent 401s share one refresh call
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshUrl = `${rawBaseUrl.replace(/\/+$/, '')}/api/auth/refresh-token`;
    const response = await fetch(refreshUrl, {
      method: 'POST',
      credentials: 'include', // sends the httpOnly refresh token cookie
    });
    if (response.ok) {
      const data = await response.json();
      const newToken: string = data.accessToken;
      localStorage.setItem('hrms_token', newToken);
      window.dispatchEvent(
        new CustomEvent('hrms:token-refreshed', { detail: { accessToken: newToken } }),
      );
      return true;
    }
  } catch {
    // network error or non-JSON response — treat as refresh failure
  }
  return false;
}

// ── Base query with automatic token refresh on 401 ──
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Prevent multiple simultaneous refresh calls
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
      refreshPromise.finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (refreshed) {
      // Retry the original request with the new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — clear storage and force logout
      localStorage.removeItem('hrms_token');
      localStorage.removeItem('hrms_user');
      window.dispatchEvent(new Event('hrms:force-logout'));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users', 'Roles', 'Permissions', 'Auth'],
  endpoints: () => ({}),
});
