import React from 'react';

export type SalesforceObjectName = 'Account' | 'Opportunity' | 'Lead' | 'Contact' | 'Case';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'currency' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
}

export interface TableColumnConfig {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
}

export interface ObjectConfig {
  id: SalesforceObjectName;
  name: string;
  pluralName: string;
  iconName: string;
  description: string;
  isBackendReady: boolean;
  endpoint: string;
  primaryKey: string;
  nameField: string;
  defaultSortField: string;
  fields: FieldConfig[];
  tableColumns: TableColumnConfig[];
  samplePayload: Record<string, any>;
  springBootDtoExample?: string;
}

export interface ContactRecord {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface GenericSalesforceRecord {
  id?: string;
  [key: string]: any;
}

export type AuthStatus = 'connected' | 'disconnected' | 'checking' | 'expired' | 'error';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  objectType: SalesforceObjectName;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'AUTH' | 'FETCH';
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  message: string;
  recordId?: string;
  payload?: any;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
