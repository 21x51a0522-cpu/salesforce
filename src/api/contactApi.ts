import { apiClient } from './apiClient';
import { ContactRecord } from '../types';

const mapSalesforceContact = (contact: any): ContactRecord => ({
  id: contact.Id ?? contact.id ?? '',
  firstName: contact.FirstName ?? contact.firstName ?? '',
  lastName: contact.LastName ?? contact.lastName ?? '',
  email: contact.Email ?? contact.email ?? '',
  phone: contact.Phone ?? contact.phone ?? '',
});

export const contactApi = {
  async getAll(
    params?: {
      limit?: number;
      offset?: number;
      page?: number;
      pageSize?: number;
    }
  ): Promise<ContactRecord[]> {
    const data = await apiClient<
      ContactRecord[] | { records: ContactRecord[] } | any
    >('/api/contacts', {
      method: 'GET',
      params: {
        limit: params?.limit ?? 20,
        offset: params?.offset,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });

    if (Array.isArray(data)) {
      return data.map(mapSalesforceContact);
    }

    if (data && Array.isArray(data.records)) {
      return data.records.map(mapSalesforceContact);
    }

    if (data && Array.isArray(data.data)) {
      return data.data.map(mapSalesforceContact);
    }

    if (data && Array.isArray(data.content)) {
      return data.content.map(mapSalesforceContact);
    }

    return [];
  },

  async getById(id: string): Promise<ContactRecord> {
    const data = await apiClient<any>(
      `/api/contacts/${encodeURIComponent(id)}`,
      {
        method: 'GET',
      }
    );

    return mapSalesforceContact(data);
  },

  async create(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    [key: string]: any;
  }): Promise<ContactRecord> {
    const data = await apiClient<any>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapSalesforceContact(data);
  },

  async update(
    id: string,
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      [key: string]: any;
    }
  ): Promise<ContactRecord> {
    const data = await apiClient<any>(
      `/api/contacts/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );

    return mapSalesforceContact(data);
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(
      `/api/contacts/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );
  },
};