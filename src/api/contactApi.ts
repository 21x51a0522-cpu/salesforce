import { apiClient } from './apiClient';
import { ContactRecord } from '../types';

/**
 * Contact API Service
 * 
 * Directly calls Spring Boot Contact REST endpoints:
 * - GET /api/contacts?limit=20&offset=0
 * - GET /api/contacts/{id}
 * - POST /api/contacts
 * - PUT /api/contacts/{id}
 * - DELETE /api/contacts/{id}
 */
export const contactApi = {
  /**
   * Fetch contacts from the Spring Boot backend with optional pagination (20 per call)
   */
  async getAll(params?: { limit?: number; offset?: number; page?: number; pageSize?: number }): Promise<ContactRecord[]> {
    const data = await apiClient<ContactRecord[] | { records: ContactRecord[] } | any>('/api/contacts', {
      method: 'GET',
      params: {
        limit: params?.limit ?? 20,
        offset: params?.offset,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });

    // Normalize response if Spring Boot returns array or wrapped object like { records: [] } or { content: [] }
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.records)) {
      return data.records;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data && Array.isArray(data.content)) {
      return data.content;
    }
    return [];
  },

  /**
   * Fetch a single contact by its ID
   */
  async getById(id: string): Promise<ContactRecord> {
    return apiClient<ContactRecord>(`/api/contacts/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new contact
   * Payload: { firstName, lastName, email, phone }
   */
  async create(payload: { firstName: string; lastName: string; email: string; phone: string; [key: string]: any }): Promise<ContactRecord> {
    return apiClient<ContactRecord>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing contact by ID
   * Payload: { firstName, lastName, email, phone }
   */
  async update(id: string, payload: { firstName: string; lastName: string; email: string; phone: string; [key: string]: any }): Promise<ContactRecord> {
    return apiClient<ContactRecord>(`/api/contacts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a contact by ID
   */
  async delete(id: string): Promise<void> {
    await apiClient<void>(`/api/contacts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
