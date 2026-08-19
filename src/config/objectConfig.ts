import { ObjectConfig, SalesforceObjectName } from '../types';

export const OBJECT_CONFIGS: Record<SalesforceObjectName, ObjectConfig> = {
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
        placeholder: 'e.g. CRUDTest',
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
      lastName: 'CRUDTest',
      email: 'raghucrudtest@example.com',
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

  Account: {
    id: 'Account',
    name: 'Account',
    pluralName: 'Accounts',
    iconName: 'Building2',
    description: 'Companies or entities that you do business with or maintain relationships in Salesforce.',
    isBackendReady: false,
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
        placeholder: 'e.g. CloudVandana Solutions',
      },
      {
        key: 'type',
        label: 'Account Type',
        type: 'select',
        required: false,
        options: ['Prospect', 'Customer - Direct', 'Customer - Channel', 'Partner', 'Other'],
      },
      {
        key: 'industry',
        label: 'Industry',
        type: 'select',
        required: false,
        options: ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 'Consulting'],
      },
      {
        key: 'phone',
        label: 'Phone',
        type: 'tel',
        required: false,
        placeholder: 'e.g. +1 (555) 019-2834',
      },
      {
        key: 'website',
        label: 'Website',
        type: 'text',
        required: false,
        placeholder: 'e.g. https://cloudvandana.com',
      },
      {
        key: 'annualRevenue',
        label: 'Annual Revenue ($)',
        type: 'number',
        required: false,
        placeholder: 'e.g. 5000000',
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Account Name', sortable: true },
      { key: 'industry', label: 'Industry', sortable: true },
      { key: 'type', label: 'Type', sortable: true },
      { key: 'phone', label: 'Phone', sortable: false },
      { key: 'website', label: 'Website', sortable: false },
    ],
    samplePayload: {
      name: 'CloudVandana Tech',
      type: 'Customer - Direct',
      industry: 'Technology',
      phone: '9876543210',
      website: 'https://cloudvandana.com',
      annualRevenue: 2500000,
    },
    springBootDtoExample: `@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    @GetMapping
    public List<AccountDto> getAll() { ... }
    @PostMapping
    public AccountDto create(@RequestBody AccountDto body) { ... }
    @PutMapping("/{id}")
    public AccountDto update(@PathVariable String id, @RequestBody AccountDto body) { ... }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { ... }
}`,
  },

  Opportunity: {
    id: 'Opportunity',
    name: 'Opportunity',
    pluralName: 'Opportunities',
    iconName: 'TrendingUp',
    description: 'Pending sales deals and pipeline revenues being tracked across sales stages in Salesforce.',
    isBackendReady: false,
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
        placeholder: 'e.g. Enterprise Cloud Migration - Q3',
      },
      {
        key: 'stageName',
        label: 'Stage',
        type: 'select',
        required: true,
        options: ['Prospecting', 'Qualification', 'Needs Analysis', 'Proposal/Quote', 'Negotiation', 'Closed Won', 'Closed Lost'],
      },
      {
        key: 'amount',
        label: 'Amount ($)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 75000',
      },
      {
        key: 'closeDate',
        label: 'Target Close Date',
        type: 'date',
        required: true,
      },
      {
        key: 'probability',
        label: 'Probability (%)',
        type: 'number',
        required: false,
        placeholder: 'e.g. 60',
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Opportunity', sortable: true },
      { key: 'stageName', label: 'Stage', sortable: true },
      { key: 'amount', label: 'Amount', sortable: true },
      { key: 'closeDate', label: 'Close Date', sortable: true },
    ],
    samplePayload: {
      name: 'CloudVandana Integration Project',
      stageName: 'Proposal/Quote',
      amount: 120000,
      closeDate: '2026-10-31',
      probability: 75,
    },
    springBootDtoExample: `@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {
    @GetMapping
    public List<OpportunityDto> getAll() { ... }
    @PostMapping
    public OpportunityDto create(@RequestBody OpportunityDto body) { ... }
    @PutMapping("/{id}")
    public OpportunityDto update(@PathVariable String id, @RequestBody OpportunityDto body) { ... }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { ... }
}`,
  },

  Lead: {
    id: 'Lead',
    name: 'Lead',
    pluralName: 'Leads',
    iconName: 'UserPlus',
    description: 'Prospective clients who have shown interest in your products/services but are not yet qualified.',
    isBackendReady: false,
    endpoint: '/api/leads',
    primaryKey: 'id',
    nameField: 'firstName',
    defaultSortField: 'lastName',
    fields: [
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
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
        placeholder: 'e.g. Apex Global Corp',
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
        placeholder: 'e.g. 555-014-9988',
      },
      {
        key: 'status',
        label: 'Lead Status',
        type: 'select',
        required: true,
        options: ['Open - Not Contacted', 'Working - Contacted', 'Closed - Converted', 'Closed - Not Converted'],
      },
    ],
    tableColumns: [
      { key: 'name', label: 'Lead Name', sortable: true },
      { key: 'company', label: 'Company', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
    ],
    samplePayload: {
      firstName: 'Alex',
      lastName: 'Mercer',
      company: 'Apex Global Corp',
      email: 'alex.mercer@apexcorp.com',
      phone: '555-014-9988',
      status: 'Open - Not Contacted',
    },
    springBootDtoExample: `@RestController
@RequestMapping("/api/leads")
public class LeadController {
    @GetMapping
    public List<LeadDto> getAll() { ... }
    @PostMapping
    public LeadDto create(@RequestBody LeadDto body) { ... }
    @PutMapping("/{id}")
    public LeadDto update(@PathVariable String id, @RequestBody LeadDto body) { ... }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { ... }
}`,
  },

  Case: {
    id: 'Case',
    name: 'Case',
    pluralName: 'Cases',
    iconName: 'LifeBuoy',
    description: 'Customer service issues, support inquiries, and incident reports logged in Salesforce Service Cloud.',
    isBackendReady: false,
    endpoint: '/api/cases',
    primaryKey: 'id',
    nameField: 'subject',
    defaultSortField: 'status',
    fields: [
      {
        key: 'subject',
        label: 'Case Subject',
        type: 'text',
        required: true,
        placeholder: 'e.g. Unable to configure OAuth callback in production',
      },
      {
        key: 'status',
        label: 'Case Status',
        type: 'select',
        required: true,
        options: ['New', 'Working', 'Escalated', 'Closed'],
      },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        required: true,
        options: ['High', 'Medium', 'Low'],
      },
      {
        key: 'origin',
        label: 'Case Origin',
        type: 'select',
        required: false,
        options: ['Web', 'Email', 'Phone', 'Partner Portal'],
      },
      {
        key: 'description',
        label: 'Detailed Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the incident or customer inquiry in detail...',
      },
    ],
    tableColumns: [
      { key: 'subject', label: 'Subject', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'priority', label: 'Priority', sortable: true },
      { key: 'origin', label: 'Origin', sortable: false },
    ],
    samplePayload: {
      subject: 'OAuth handshake verification error',
      status: 'New',
      priority: 'High',
      origin: 'Web',
      description: 'Spring Boot server returned 401 when testing contact synchronization.',
    },
    springBootDtoExample: `@RestController
@RequestMapping("/api/cases")
public class CaseController {
    @GetMapping
    public List<CaseDto> getAll() { ... }
    @PostMapping
    public CaseDto create(@RequestBody CaseDto body) { ... }
    @PutMapping("/{id}")
    public CaseDto update(@PathVariable String id, @RequestBody CaseDto body) { ... }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { ... }
}`,
  },
};

export const SALESFORCE_OBJECT_KEYS: SalesforceObjectName[] = [
  'Contact',
  'Account',
  'Opportunity',
  'Lead',
  'Case',
];
