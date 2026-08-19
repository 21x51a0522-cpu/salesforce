import { apiClient, getApiBaseUrl } from './apiClient';
import { AuthStatus } from '../types';

/**
 * Authentication API Interface
 * 
 * Interacts with Spring Boot OAuth 2.0 / Session endpoints:
 * - GET /api/auth/login (initiates Salesforce OAuth 2.0 PKCE redirect)
 * - GET /api/auth/callback (OAuth callback receiver on Spring Boot)
 */
export const authApi = {
  /**
   * Get the full URL to initiate Salesforce OAuth login flow on Spring Boot backend
   */
  getLoginUrl(): string {
    return `${getApiBaseUrl()}/api/auth/login`;
  },

  /**
   * Get the backend OAuth callback URL
   */
  getCallbackUrl(): string {
    return `${getApiBaseUrl()}/api/auth/callback`;
  },

  /**
   * Trigger direct redirection to the Spring Boot Salesforce Login endpoint
   */
  redirectToLogin(): void {
    window.location.href = this.getLoginUrl();
  },

  /**
   * Probe backend connection and Salesforce session health
   */
  async checkSessionStatus(): Promise<{ status: AuthStatus; message: string; details?: any }> {
    try {
      // Test by making a lightweight query to the contacts endpoint
      await apiClient('/api/contacts', {
        method: 'GET',
      });
      return {
        status: 'connected',
        message: 'Salesforce Connected',
      };
    } catch (err: any) {
      if (err.status === 401) {
        return {
          status: 'expired',
          message: 'Salesforce session expired. Please login again.',
        };
      }
      if (err.status === 0) {
        return {
          status: 'error',
          message: 'Backend server unreachable at ' + getApiBaseUrl(),
          details: err.message,
        };
      }
      // If 500 or other, return error but could still be connected to backend
      return {
        status: 'error',
        message: err.message || 'Error checking Salesforce connection status',
        details: err,
      };
    }
  },

  /**
   * Clear session on backend if logout endpoint is provided
   */
  async logout(): Promise<void> {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore if logout endpoint is not explicitly defined in Spring Boot
    }
  },
};
