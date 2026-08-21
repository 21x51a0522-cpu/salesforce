```ts
import { api } from './api';
import type { ContactRecord } from '../types';

const mapSalesforceContact = (contact: any): ContactRecord => ({
  id: contact.Id ?? contact.id ?? '',
  firstName: contact.FirstName ?? contact.firstName ?? '',
  lastName: contact.LastName ?? contact.lastName ?? '',
  email: contact.Email ?? contact.email ?? '',
  phone: contact.Phone ?? contact.phone ?? '',
});

export const contactApi = {
  async getAll(): Promise<ContactRecord[]> {
    const response = await api.get('/api/contacts');
    const data = response.data;

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
    const response = await api.get(`/api/contacts/${id}`);
    return mapSalesforceContact(response.data);
  },

  async create(contact: Omit<ContactRecord, 'id'>): Promise<ContactRecord> {
    const response = await api.post('/api/contacts', contact);
    return mapSalesforceContact(response.data);
  },

  async update(
    id: string,
    contact: Partial<ContactRecord>
  ): Promise<ContactRecord> {
    const response = await api.put(`/api/contacts/${id}`, contact);
    return mapSalesforceContact(response.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/contacts/${id}`);
  },
};
```
