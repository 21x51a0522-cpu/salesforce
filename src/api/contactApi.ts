import { apiClient } from './apiClient';
import { ContactRecord } from '../types';

/**
 * Contact API Service
 * 
 * Directly calls Spring Boot Contact REST endpoints:
 * - GET /api/contacts
 * - GET /api/contacts/{id}
 * - POST /api/contacts
 * - PUT /api/contacts/{id}
 * - DELETE /api/contacts/{id}
 */
export const contactApi = {
  /**
   * Fetch all contacts from the Spring Boot backend
   */
  async getAll(): Promise<ContactRecord[]> {
    const data = await apiClient<ContactRecord[] | { records: ContactRecord[] } | any>('/api/contacts', {
      method: 'GET',
    });

    // Normalize response if Spring Boot returns array or wrapped object like { records: [] } or { data: [] }
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
  async create(payload: { firstName: string; lastName: string; email: string; phone: string }): Promise<ContactRecord> {
    return apiClient<ContactRecord>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing contact by ID
   * Payload: { firstName, lastName, email, phone }
   */
  async update(id: string, payload: { firstName: string; lastName: string; email: string; phone: string }): Promise<ContactRecord> {
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
