import { contactApi } from './contactApi';
import { OBJECT_CONFIGS } from '../config/objectConfig';
import { SalesforceObjectName, ApiError } from '../types';
import { apiClient } from './apiClient';

export interface GetRecordsOptions {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedRecordsResult {
  records: any[];
  hasMore: boolean;
  totalSize?: number;
}

/**
 * Generic Object API Service
 * 
 * Provides unified CRUD abstractions for all 5 Salesforce objects:
 * - Account     (/api/accounts)
 * - Opportunity (/api/opportunities)
 * - Lead        (/api/leads)
 * - Contact     (/api/contacts)
 * - Case        (/api/cases)
 */
export const objectApi = {
  /**
   * Fetch paginated records (20 at a time) for the selected Salesforce object
   */
  async getRecords(
    objectName: SalesforceObjectName, 
    options: GetRecordsOptions = { limit: 20, offset: 0 }
  ): Promise<any[]> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    const limit = options.limit ?? 20;
    const offset = options.offset ?? 0;

    // Contact routes to dedicated contact service
    if (objectName === 'Contact') {
      return contactApi.getAll({ limit, offset, page: options.page, pageSize: options.pageSize });
    }

    const data = await apiClient<any[] | { records: any[] } | any>(config.endpoint, {
      method: 'GET',
      params: {
        limit,
        offset,
        page: options.page,
        pageSize: options.pageSize,
      },
    });

    // Normalize array or wrapped response
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
   * Fetch a single record by ID
   * GET /api/[objects]/{id}
   */
  async getRecordById(objectName: SalesforceObjectName, id: string): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.getById(id);
    }

    return apiClient<any>(`${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new record
   * POST /api/[objects]
   */
  async createRecord(objectName: SalesforceObjectName, payload: any): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.create(payload);
    }

    return apiClient<any>(config.endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing record
   * PUT /api/[objects]/{id}
   */
  async updateRecord(objectName: SalesforceObjectName, id: string, payload: any): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.update(id, payload);
    }

    return apiClient<any>(`${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a record by ID
   * DELETE /api/[objects]/{id}
   */
  async deleteRecord(objectName: SalesforceObjectName, id: string): Promise<void> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.delete(id);
    }

    return apiClient<void>(`${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
