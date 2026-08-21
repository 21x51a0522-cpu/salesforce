import { contactApi } from './contactApi';
import { OBJECT_CONFIGS } from '../config/objectConfig';
import { SalesforceObjectName } from '../types';
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
 * Convert Salesforce API field names to the camelCase
 * field names expected by the frontend.
 */
const mapSalesforceRecord = (
  objectName: SalesforceObjectName,
  record: any
): any => {
  if (!record) return record;

  switch (objectName) {
    case 'Account':
      return {
        ...record,
        id: record.Id ?? record.id ?? '',
        name: record.Name ?? record.name ?? '',
        phone: record.Phone ?? record.phone ?? '',
        website: record.Website ?? record.website ?? '',
        industry: record.Industry ?? record.industry ?? '',
        type: record.Type ?? record.type ?? '',
        billingCity: record.BillingCity ?? record.billingCity ?? '',
      };

    case 'Opportunity':
      return {
        ...record,
        id: record.Id ?? record.id ?? '',
        name: record.Name ?? record.name ?? '',
        stageName: record.StageName ?? record.stageName ?? '',
        closeDate: record.CloseDate ?? record.closeDate ?? '',
        amount: record.Amount ?? record.amount ?? '',
        probability: record.Probability ?? record.probability ?? '',
        type: record.Type ?? record.type ?? '',
      };

    case 'Lead':
      return {
        ...record,
        id: record.Id ?? record.id ?? '',
        firstName: record.FirstName ?? record.firstName ?? '',
        lastName: record.LastName ?? record.lastName ?? '',
        company: record.Company ?? record.company ?? '',
        email: record.Email ?? record.email ?? '',
        phone: record.Phone ?? record.phone ?? '',
        status: record.Status ?? record.status ?? '',
        leadSource: record.LeadSource ?? record.leadSource ?? '',
      };

    case 'Case':
      return {
        ...record,
        id: record.Id ?? record.id ?? '',
        caseNumber: record.CaseNumber ?? record.caseNumber ?? '',
        subject: record.Subject ?? record.subject ?? '',
        status: record.Status ?? record.status ?? '',
        priority: record.Priority ?? record.priority ?? '',
        origin: record.Origin ?? record.origin ?? '',
        type: record.Type ?? record.type ?? '',
        description: record.Description ?? record.description ?? '',
      };

    case 'Contact':
      return record;

    default:
      return {
        ...record,
        id: record.Id ?? record.id ?? '',
      };
  }
};

/**
 * Normalize different backend response formats.
 */
const extractRecords = (data: any): any[] => {
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
};

/**
 * Generic Object API Service
 *
 * Supports:
 * - Account
 * - Opportunity
 * - Lead
 * - Contact
 * - Case
 */
export const objectApi = {
  /**
   * Fetch records for a Salesforce object.
   */
  async getRecords(
    objectName: SalesforceObjectName,
    options: GetRecordsOptions = {
      limit: 20,
      offset: 0,
    }
  ): Promise<any[]> {
    const config = OBJECT_CONFIGS[objectName];

    if (!config) {
      throw new Error(
        `Unrecognized Salesforce object: ${objectName}`
      );
    }

    const limit = options.limit ?? 20;
    const offset = options.offset ?? 0;

    // Contact already has its own correct mapper.
    if (objectName === 'Contact') {
      return contactApi.getAll({
        limit,
        offset,
        page: options.page,
        pageSize: options.pageSize,
      });
    }

    const data = await apiClient<any>(
      config.endpoint,
      {
        method: 'GET',
        params: {
          limit,
          offset,
          page: options.page,
          pageSize: options.pageSize,
        },
      }
    );

    const records = extractRecords(data);

    return records.map((record) =>
      mapSalesforceRecord(objectName, record)
    );
  },

  /**
   * Fetch a single record by ID.
   */
  async getRecordById(
    objectName: SalesforceObjectName,
    id: string
  ): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];

    if (!config) {
      throw new Error(
        `Unrecognized Salesforce object: ${objectName}`
      );
    }

    if (objectName === 'Contact') {
      return contactApi.getById(id);
    }

    const data = await apiClient<any>(
      `${config.endpoint}/${encodeURIComponent(id)}`,
      {
        method: 'GET',
      }
    );

    return mapSalesforceRecord(objectName, data);
  },

  /**
   * Create a new record.
   */
  async createRecord(
    objectName: SalesforceObjectName,
    payload: any
  ): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];

    if (!config) {
      throw new Error(
        `Unrecognized Salesforce object: ${objectName}`
      );
    }

    if (objectName === 'Contact') {
      return contactApi.create(payload);
    }

    const data = await apiClient<any>(
      config.endpoint,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    return mapSalesforceRecord(objectName, data);
  },

  /**
   * Update an existing record.
   */
  async updateRecord(
    objectName: SalesforceObjectName,
    id: string,
    payload: any
  ): Promise<any> {
    const config = OBJECT_CONFIGS[objectName];

    if (!config) {
      throw new Error(
        `Unrecognized Salesforce object: ${objectName}`
      );
    }

    if (objectName === 'Contact') {
      return contactApi.update(id, payload);
    }

    const data = await apiClient<any>(
      `${config.endpoint}/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );

    return mapSalesforceRecord(objectName, data);
  },

  /**
   * Delete a record by ID.
   */
  async deleteRecord(
    objectName: SalesforceObjectName,
    id: string
  ): Promise<void> {
    const config = OBJECT_CONFIGS[objectName];

    if (!config) {
      throw new Error(
        `Unrecognized Salesforce object: ${objectName}`
      );
    }

    if (objectName === 'Contact') {
      return contactApi.delete(id);
    }

    await apiClient<void>(
      `${config.endpoint}/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );
  },
};