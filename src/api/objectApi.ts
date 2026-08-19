import { contactApi } from './contactApi';
import { OBJECT_CONFIGS } from '../config/objectConfig';
import { SalesforceObjectName, ApiError } from '../types';
import { apiClient } from './apiClient';

/**
 * Generic Object API Service
 * 
 * Provides unified CRUD abstractions for all 5 Salesforce objects.
 * Contact routes to contactApi (active backend).
 * Other objects route to their respective /api/[object] endpoints when ready.
 */
export const objectApi = {
  /**
   * Fetch records for the selected Salesforce object
   */
  async getRecords(objectName: SalesforceObjectName): Promise<any[]> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.getAll();
    }

    if (!config.isBackendReady) {
      throw new ApiError(
        501,
        `Spring Boot endpoint ${config.endpoint} for ${config.name} is not yet implemented on the backend. Contact is currently active.`
      );
    }

    const data = await apiClient<any[] | { records: any[] }>(config.endpoint, {
      method: 'GET',
    });

    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.records)) {
      return data.records;
    }
    return [];
  },

  /**
   * Fetch a single record by ID
   */
  async getRecordById(objectName: SalesforceObjectName, id: string): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.getById(id);
    }

    if (!config.isBackendReady) {
      throw new ApiError(
        501,
        `Spring Boot endpoint ${config.endpoint}/{id} for ${config.name} is not yet configured.`
      );
    }

    return apiClient<any>(`${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new record
   */
  async createRecord(objectName: SalesforceObjectName, payload: any): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.create(payload);
    }

    if (!config.isBackendReady) {
      throw new ApiError(
        501,
        `Spring Boot endpoint ${config.endpoint} for ${config.name} is not yet configured.`
      );
    }

    return apiClient<any>(config.endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing record
   */
  async updateRecord(objectName: SalesforceObjectName, id: string, payload: any): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.update(id, payload);
    }

    if (!config.isBackendReady) {
      throw new ApiError(
        501,
        `Spring Boot endpoint ${config.endpoint}/{id} for ${config.name} is not yet configured.`
      );
    }

    return apiClient<any>(`${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a record
   */
  async deleteRecord(objectName: SalesforceObjectName, id: string): Promise<void> {
    const config = OBJECT_CONFIGS[objectName];
    if (!config) {
      throw new Error(`Unrecognized Salesforce object: ${objectName}`);
    }

    if (objectName === 'Contact') {
      return contactApi.delete(id);
    }

    if (!config.isBackendReady) {
      throw new ApiError(
        501,
        `Spring Boot endpoint ${config.endpoint}/{id} for ${config.name} is not yet configured.`
      );
    }

    return apiClient<void>(`${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
