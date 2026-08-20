import { ObjectConfig, SalesforceObjectName } from '../types';

export const OBJECT_CONFIGS: Record<SalesforceObjectName, ObjectConfig> = {
  // 1. Account
  Account: {
    id: 'Account',
    name: 'Account',
    pluralName: 'Accounts',
    iconName: 'Building2',
    description: 'Companies and business entities maintaining commercial relationships in Salesforce.',
    isBackendReady: true,
    endpoint: '/api/accounts',
    primaryKey: 'id',
    nameField: 'name',
    defaultSortField: 'name',
    fields: [
      {
        key: 'name',
        label: 'Account Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. CloudVandana Solutions Inc.',
      },
      {
        key: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: false,
        placeholder: 'e.g. +1 (555) 234-5678',
      },
      {
        key: 'website',
        label: 'Website',
        type: 'text',
        required: false,
        placeholder: 'e.g. https://cloudvandana.com',
      },
      {
        key: 'industry',
        label: 'Industry',
        type: 'select',
        required: false,
        options: [
          'Technology',
          'Financial Services',
          'Healthcare',
          'Manufacturing',
          'Consulting',
          'Retail',
          'Energy',
          'Education',
          'Other'
        ],
      },
      {
        key: 'type',
        label: 'Account Type',
        type: 'select',
        required: false,
        options: [
          'Prospect',
          'Customer - Direct',
          'Customer - Channel',
          'Channel Partner / Reseller',
          'Installation Partner',
          'Technology Partner',
          'Other'
        ],
      },
      {
        key: 'billingCity',
        label: 'Billing City',
        type: 'text',
        required: false,
        placeholder: 'e.g. San Francisco',
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Account Name', sortable: true },
      { key: 'industry', label: 'Industry', sortable: true },
      { key: 'type', label: 'Type', sortable: true },
      { key: 'phone', label: 'Phone', sortable: false },
      { key: 'billingCity', label: 'Billing City', sortable: true },
    ],
    samplePayload: {
      name: 'CloudVandana Solutions',
      phone: '+1 (555) 019-2834',
      website: 'https://cloudvandana.com',
      industry: 'Technology',
      type: 'Customer - Direct',
      billingCity: 'San Francisco',
    },
    springBootDtoExample: `public class AccountDto {
    private String id;
    private String name;
    private String phone;
    private String website;
    private String industry;
    private String type;
    private String billingCity;
    // getters and setters
}`,
  },

  // 2. Opportunity
  Opportunity: {
    id: 'Opportunity',
    name: 'Opportunity',
    pluralName: 'Opportunities',
    iconName: 'TrendingUp',
    description: 'Pending commercial deals, potential pipeline revenues, and sales stage progressions.',
    isBackendReady: true,
    endpoint: '/api/opportunities',
    primaryKey: 'id',
    nameField: 'name',
    defaultSortField: 'closeDate',
    fields: [
      {
        key: 'name',
        label: 'Opportunity Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Enterprise Cloud Integration - FY26',
      },
      {
        key: 'stageName',
        label: 'Stage',
        type: 'select',
        required: true,
        options: [
          'Prospecting',
          'Qualification',
          'Needs Analysis',
          'Value Proposition',
          'Id. Decision Makers',
          'Perception Analysis',
          'Proposal/Price Quote',
          'Negotiation/Review',
          'Closed Won',
          'Closed Lost'
        ],
      },
      {
        key: 'closeDate',
        label: 'Close Date',
        type: 'date',
        required: true,
      },
      {
        key: 'amount',
        label: 'Amount ($)',
        type: 'currency',
        required: true,
        placeholder: 'e.g. 85000',
      },
      {
        key: 'probability',
        label: 'Probability (%)',
        type: 'number',
        required: false,
        placeholder: 'e.g. 75',
      },
      {
        key: 'type',
        label: 'Opportunity Type',
        type: 'select',
        required: false,
        options: [
          'Existing Customer - Upgrade',
          'Existing Customer - Replacement',
          'Existing Customer - Downgrade',
          'New Customer'
        ],
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Opportunity', sortable: true },
      { key: 'stageName', label: 'Stage', sortable: true },
      { key: 'amount', label: 'Amount ($)', sortable: true },
      { key: 'closeDate', label: 'Close Date', sortable: true },
      { key: 'probability', label: 'Probability', sortable: true },
    ],
    samplePayload: {
      name: 'Enterprise Cloud Integration',
      stageName: 'Proposal/Price Quote',
      closeDate: '2026-11-30',
      amount: 125000,
      probability: 80,
      type: 'New Customer',
    },
    springBootDtoExample: `public class OpportunityDto {
    private String id;
    private String name;
    private String stageName;
    private String closeDate;
    private Double amount;
    private Integer probability;
    private String type;
    // getters and setters
}`,
  },

  // 3. Lead
  Lead: {
    id: 'Lead',
    name: 'Lead',
    pluralName: 'Leads',
    iconName: 'UserPlus',
    description: 'Prospective clients who have expressed interest in services but are not yet converted.',
    isBackendReady: true,
    endpoint: '/api/leads',
    primaryKey: 'id',
    nameField: 'lastName',
    defaultSortField: 'lastName',
    fields: [
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        required: false,
        placeholder: 'e.g. Alex',
      },
      {
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Mercer',
      },
      {
        key: 'company',
        label: 'Company',
        type: 'text',
        required: true,
        placeholder: 'e.g. Apex Global Innovations',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'e.g. alex.mercer@apexcorp.com',
      },
      {
        key: 'phone',
        label: 'Phone',
        type: 'tel',
        required: false,
        placeholder: 'e.g. (555) 014-9988',
      },
      {
        key: 'status',
        label: 'Lead Status',
        type: 'select',
        required: true,
        options: [
          'Open - Not Contacted',
          'Working - Contacted',
          'Closed - Converted',
          'Closed - Not Converted'
        ],
      },
      {
        key: 'leadSource',
        label: 'Lead Source',
        type: 'select',
        required: false,
        options: [
          'Web',
          'Phone Inquiry',
          'Partner Referral',
          'Purchased List',
          'Trade Show',
          'Employee Referral',
          'Other'
        ],
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Lead Name', sortable: true },
      { key: 'company', label: 'Company', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'leadSource', label: 'Source', sortable: false },
    ],
    samplePayload: {
      firstName: 'Alex',
      lastName: 'Mercer',
      company: 'Apex Global Innovations',
      email: 'alex.mercer@apexcorp.com',
      phone: '(555) 014-9988',
      status: 'Open - Not Contacted',
      leadSource: 'Web',
    },
    springBootDtoExample: `public class LeadDto {
    private String id;
    private String firstName;
    private String lastName;
    private String company;
    private String email;
    private String phone;
    private String status;
    private String leadSource;
    // getters and setters
}`,
  },

  // 4. Contact
  Contact: {
    id: 'Contact',
    name: 'Contact',
    pluralName: 'Contacts',
    iconName: 'UserCheck',
    description: 'Individuals associated with accounts, opportunities, or custom interactions in Salesforce.',
    isBackendReady: true,
    endpoint: '/api/contacts',
    primaryKey: 'id',
    nameField: 'firstName',
    defaultSortField: 'lastName',
    fields: [
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Raghu',
      },
      {
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Vardhan',
      },
      {
        key: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'e.g. raghu@example.com',
      },
      {
        key: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: false,
        placeholder: 'e.g. 9876543210',
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'phone', label: 'Phone', sortable: false },
    ],
    samplePayload: {
      firstName: 'Raghu',
      lastName: 'Vardhan',
      email: 'raghu@example.com',
      phone: '9876543210',
    },
    springBootDtoExample: `public class ContactDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    // getters and setters
}`,
  },

  // 5. Case
  Case: {
    id: 'Case',
    name: 'Case',
    pluralName: 'Cases',
    iconName: 'LifeBuoy',
    description: 'Customer service tickets, support requests, and incident tracking in Salesforce Service Cloud.',
    isBackendReady: true,
    endpoint: '/api/cases',
    primaryKey: 'id',
    nameField: 'subject',
    defaultSortField: 'status',
    fields: [
      {
        key: 'caseNumber',
        label: 'Case Number',
        type: 'text',
        required: false,
        placeholder: 'Auto-generated or e.g. 00010042',
      },
      {
        key: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'e.g. Cloud API connection timeout during sync',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          'New',
          'Working',
          'Escalated',
          'Closed'
        ],
      },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        required: true,
        options: [
          'High',
          'Medium',
          'Low'
        ],
      },
      {
        key: 'origin',
        label: 'Origin',
        type: 'select',
        required: false,
        options: [
          'Web',
          'Email',
          'Phone',
          'Partner Portal'
        ],
      },
      {
        key: 'type',
        label: 'Case Type',
        type: 'select',
        required: false,
        options: [
          'Problem',
          'Feature Request',
          'Question',
          'Incident',
          'Other'
        ],
      },
      {
        key: 'description',
        label: 'Detailed Description',
        type: 'textarea',
        required: false,
        placeholder: 'Provide detailed steps or incident symptoms...',
      },
    ],
    tableColumns: [
      { key: 'subject', label: 'Subject', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'priority', label: 'Priority', sortable: true },
      { key: 'origin', label: 'Origin', sortable: false },
      { key: 'type', label: 'Type', sortable: false },
    ],
    samplePayload: {
      subject: 'OAuth Token Renewal Configuration',
      status: 'New',
      priority: 'High',
      origin: 'Web',
      type: 'Problem',
      description: 'Need assistance verifying Salesforce PKCE token lifecycle in Spring Boot.',
    },
    springBootDtoExample: `public class CaseDto {
    private String id;
    private String caseNumber;
    private String subject;
    private String status;
    private String priority;
    private String origin;
    private String type;
    private String description;
    // getters and setters
}`,
  },
};

export const SALESFORCE_OBJECT_KEYS: SalesforceObjectName[] = [
  'Account',
  'Opportunity',
  'Lead',
  'Contact',
  'Case',
];
