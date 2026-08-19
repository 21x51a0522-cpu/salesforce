import { ApiError } from '../types';

/**
 * Base REST API Client for Spring Boot Backend Communication
 * 
 * Architecture:
 * React Frontend ---> Spring Boot Backend ---> Salesforce REST / OAuth 2.0 PKCE
 * All Salesforce tokens and credentials remain strictly on the Spring Boot backend.
 */

export const DEFAULT_REMOTE_BACKEND = 'https://cloudvandana-salesforce-backend-ytnm.onrender.com';
export const DEFAULT_LOCAL_BACKEND = 'http://localhost:8080';

export const getApiBaseUrl = (): string => {
  // Check runtime manual override first
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('CLOUDVANDANA_API_URL');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isLocalHostDomain = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0'
  );

  // If running locally in browser (e.g. npm run dev), use envUrl or default to localhost:8080
  if (isLocalHostDomain) {
    return (envUrl || DEFAULT_LOCAL_BACKEND).replace(/\/+$/, '');
  }

  // If running on a remote/hosted domain (Vercel, Cloud, AI Studio preview):
  // If envUrl is explicitly a remote URL (not localhost), use it; otherwise use the deployed Render Spring Boot backend
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1') && !envUrl.includes('0.0.0.0')) {
    return envUrl.replace(/\/+$/, '');
  }

  return DEFAULT_REMOTE_BACKEND;
};

export const API_BASE_URL = getApiBaseUrl();

export const setCustomApiBaseUrl = (url: string | null): void => {
  if (!url || !url.trim()) {
    localStorage.removeItem('CLOUDVANDANA_API_URL');
  } else {
    localStorage.setItem('CLOUDVANDANA_API_URL', url.trim().replace(/\/+$/, ''));
  }
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Common REST request wrapper with credentials: "include", standard headers, and unified error handling
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  let url = `${baseUrl}${cleanEndpoint}`;

  // Handle URL query parameters if provided
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Only set Content-Type if there's a body
  if (options.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const mergedOptions: RequestInit = {
    ...options,
    // ALWAYS include session cookies/credentials for Spring Boot session authentication
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  let response: Response;
  try {
    response = await fetch(url, mergedOptions);
  } catch (networkErr: any) {
    throw new ApiError(
      0,
      `Backend unavailable at ${baseUrl}. If running locally, ensure your Spring Boot server is active on port 8080 and CORS is enabled.`,
      networkErr
    );
  }

  // Handle HTTP Error statuses
  if (!response.ok) {
    let errorData: any = null;
    let errorMessage = '';

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorData.detail || '';
      } else {
        errorMessage = await response.text();
      }
    } catch {
      // Ignored parse error
    }

    if (response.status === 401) {
      throw new ApiError(
        401,
        errorMessage || 'Salesforce session expired or unauthenticated. Please login again.',
        errorData
      );
    }

    if (response.status === 403) {
      throw new ApiError(
        403,
        errorMessage || 'Forbidden: Insufficient permissions for this Salesforce operation.',
        errorData
      );
    }

    if (response.status === 404) {
      throw new ApiError(
        404,
        errorMessage || 'Requested record or endpoint was not found.',
        errorData
      );
    }

    if (response.status >= 500) {
      throw new ApiError(
        response.status,
        errorMessage || 'Something went wrong on the Spring Boot server.',
        errorData
      );
    }

    throw new ApiError(
      response.status,
      errorMessage || `Request failed with status ${response.status}`,
      errorData
    );
  }

  // Handle empty responses (like 204 No Content or empty DELETE response)
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return (await response.json()) as T;
    } catch (parseError) {
      return {} as T;
    }
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
