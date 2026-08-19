import { ApiError } from '../types';

/**
 * Base REST API Client for Spring Boot Backend Communication
 * 
 * Architecture:
 * React Frontend ---> Spring Boot Backend (http://localhost:8080) ---> Salesforce REST / OAuth 2.0 PKCE
 * All Salesforce tokens and credentials remain strictly on the Spring Boot backend.
 */

// Environment-based API Base URL configuration
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

export const getApiBaseUrl = (): string => {
  // Allow optional runtime override from localStorage for live testing in different environments
  const customUrl = localStorage.getItem('CLOUDVANDANA_API_URL');
  if (customUrl && customUrl.trim()) {
    return customUrl.trim().replace(/\/+$/, '');
  }
  return API_BASE_URL;
};

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
    console.warn(`[CloudVandana CRM] Network request failed to ${url}:`, networkErr);
    throw new ApiError(
      0,
      `Unable to reach Spring Boot backend at ${baseUrl}. If running locally, ensure your Spring Boot server is active on port 8080 and CORS is enabled.`,
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
