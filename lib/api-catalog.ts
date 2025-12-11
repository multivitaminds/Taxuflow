export interface ApiEndpoint {
  name: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  description: string
  requiresAuth: boolean
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  requestBody?: {
    example: string
    schema?: Record<string, any>
  }
  responseExample?: string
}

export interface ApiCategory {
  name: string
  description: string
  endpoints: ApiEndpoint[]
}

export const API_CATALOG: Record<string, ApiCategory> = {
  "Tax Filing": {
    name: "Tax Filing",
    description: "Submit and manage 1099-NEC, W-2, and Form 941 tax filings",
    endpoints: [
      {
        name: "Submit 1099-NEC Filing",
        method: "POST",
        path: "/api/filing/submit-1099",
        description: "Submit a 1099-NEC form for electronic filing",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              year: 2024,
              recipient_tin: "123456789",
              recipient_name: "John Doe",
              nonemployee_compensation: 50000,
              payer_tin: "987654321",
            },
            null,
            2,
          ),
        },
        responseExample: JSON.stringify(
          {
            filing_id: "filing_abc123",
            status: "pending",
            submission_id: "sub_xyz789",
          },
          null,
          2,
        ),
      },
      {
        name: "Submit W-2 Filing",
        method: "POST",
        path: "/api/filing/submit-w2",
        description: "Submit W-2 forms for employees",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              year: 2024,
              employee_ssn: "123-45-6789",
              wages: 75000,
              federal_tax_withheld: 12000,
              employer_ein: "12-3456789",
            },
            null,
            2,
          ),
        },
      },
      {
        name: "Check Filing Status",
        method: "GET",
        path: "/api/filing/check-status/[id]",
        description: "Check the current status of a tax filing",
        requiresAuth: true,
        parameters: [{ name: "id", type: "string", required: true, description: "Filing ID" }],
        responseExample: JSON.stringify(
          {
            id: "filing_abc123",
            status: "accepted",
            filed_date: "2024-01-15T10:30:00Z",
            irs_confirmation: "ABC123XYZ",
          },
          null,
          2,
        ),
      },
      {
        name: "Get Filing Status List",
        method: "GET",
        path: "/api/filing/status",
        description: "List all filings with their current status",
        requiresAuth: true,
        responseExample: JSON.stringify(
          {
            filings: [
              { id: "filing_1", status: "accepted", year: 2024 },
              { id: "filing_2", status: "pending", year: 2024 },
            ],
          },
          null,
          2,
        ),
      },
      {
        name: "Submit Form 941",
        method: "POST",
        path: "/api/filing/submit-941",
        description: "Submit quarterly Form 941 employer tax return",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              quarter: "Q1",
              year: 2024,
              wages: 150000,
              federal_tax_withheld: 25000,
              employee_count: 5,
            },
            null,
            2,
          ),
        },
      },
      {
        name: "Validate 1099 Form",
        method: "POST",
        path: "/api/filing/validate-1099",
        description: "Validate 1099 form data before submission",
        requiresAuth: true,
      },
      {
        name: "Extract Document Data",
        method: "POST",
        path: "/api/filing/extract-document",
        description: "Extract tax data from uploaded documents using AI",
        requiresAuth: true,
      },
      {
        name: "Auto-file Multiple Years",
        method: "POST",
        path: "/api/auto-file-multi-year",
        description: "Automatically file tax forms for multiple years",
        requiresAuth: true,
      },
    ],
  },

  Recipients: {
    name: "Recipients & Contractors",
    description: "Manage 1099 recipients and contractor information",
    endpoints: [
      {
        name: "List Recipients",
        method: "GET",
        path: "/api/recipients",
        description: "Get all recipients/contractors",
        requiresAuth: true,
        responseExample: JSON.stringify(
          {
            recipients: [
              {
                id: "rec_123",
                name: "John Doe",
                tin: "***-**-6789",
                email: "john@example.com",
              },
            ],
          },
          null,
          2,
        ),
      },
      {
        name: "Create Recipient",
        method: "POST",
        path: "/api/recipients",
        description: "Add a new recipient/contractor",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              name: "Jane Smith",
              tin: "123-45-6789",
              email: "jane@example.com",
              address: "123 Main St, City, ST 12345",
            },
            null,
            2,
          ),
        },
      },
      {
        name: "Get Recipient",
        method: "GET",
        path: "/api/recipients/[id]",
        description: "Get details for a specific recipient",
        requiresAuth: true,
        parameters: [{ name: "id", type: "string", required: true, description: "Recipient ID" }],
      },
      {
        name: "Bulk Import Recipients",
        method: "POST",
        path: "/api/recipients/bulk-import",
        description: "Import multiple recipients from CSV",
        requiresAuth: true,
      },
      {
        name: "Export Recipients",
        method: "GET",
        path: "/api/recipients/export",
        description: "Export all recipients to CSV",
        requiresAuth: true,
      },
      {
        name: "Get Recipient Payments",
        method: "GET",
        path: "/api/recipients/[id]/payments",
        description: "Get payment history for a recipient",
        requiresAuth: true,
      },
    ],
  },

  Accounting: {
    name: "Accounting",
    description: "Manage invoices, expenses, customers, and financial data",
    endpoints: [
      {
        name: "List Invoices",
        method: "GET",
        path: "/api/accounting/invoices",
        description: "Get all invoices",
        requiresAuth: true,
        responseExample: JSON.stringify(
          {
            invoices: [
              {
                id: "inv_123",
                customer: "Acme Corp",
                amount: 5000,
                status: "paid",
                due_date: "2024-02-15",
              },
            ],
          },
          null,
          2,
        ),
      },
      {
        name: "Create Invoice",
        method: "POST",
        path: "/api/accounting/invoices",
        description: "Create a new invoice",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              customer_id: "cust_123",
              amount: 5000,
              due_date: "2024-02-15",
              line_items: [{ description: "Consulting Services", amount: 5000 }],
            },
            null,
            2,
          ),
        },
      },
      {
        name: "List Expenses",
        method: "GET",
        path: "/api/accounting/expenses",
        description: "Get all expenses",
        requiresAuth: true,
      },
      {
        name: "Create Expense",
        method: "POST",
        path: "/api/accounting/expenses",
        description: "Record a new expense",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              amount: 250,
              category: "Office Supplies",
              date: "2024-01-15",
              vendor: "Staples",
            },
            null,
            2,
          ),
        },
      },
      {
        name: "List Customers",
        method: "GET",
        path: "/api/accounting/customers",
        description: "Get all customers",
        requiresAuth: true,
      },
      {
        name: "Create Customer",
        method: "POST",
        path: "/api/accounting/customers",
        description: "Add a new customer",
        requiresAuth: true,
      },
      {
        name: "List Vendors",
        method: "GET",
        path: "/api/accounting/vendors",
        description: "Get all vendors",
        requiresAuth: true,
      },
      {
        name: "Create Vendor",
        method: "POST",
        path: "/api/accounting/vendors",
        description: "Add a new vendor",
        requiresAuth: true,
      },
      {
        name: "List Projects",
        method: "GET",
        path: "/api/accounting/projects",
        description: "Get all projects for time tracking",
        requiresAuth: true,
      },
      {
        name: "Create Project",
        method: "POST",
        path: "/api/accounting/projects",
        description: "Create a new project",
        requiresAuth: true,
      },
    ],
  },

  Documents: {
    name: "Documents",
    description: "Upload, process, and manage tax documents",
    endpoints: [
      {
        name: "Upload Document",
        method: "POST",
        path: "/api/documents/upload",
        description: "Upload a tax document (W-9, 1099, etc.)",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              file: "base64_encoded_file",
              type: "w9",
              recipient_id: "rec_123",
            },
            null,
            2,
          ),
        },
      },
      {
        name: "List Documents",
        method: "GET",
        path: "/api/documents/list",
        description: "Get all uploaded documents",
        requiresAuth: true,
      },
      {
        name: "Download Document",
        method: "GET",
        path: "/api/documents/[id]/download",
        description: "Download a specific document",
        requiresAuth: true,
        parameters: [{ name: "id", type: "string", required: true, description: "Document ID" }],
      },
      {
        name: "Extract Document Data",
        method: "POST",
        path: "/api/documents/extract-advanced",
        description: "Extract data from documents using AI",
        requiresAuth: true,
      },
      {
        name: "Process Document",
        method: "POST",
        path: "/api/process-document",
        description: "Process and analyze uploaded documents",
        requiresAuth: true,
      },
    ],
  },

  Integrations: {
    name: "Integrations",
    description: "Connect with QuickBooks, Xero, and other accounting platforms",
    endpoints: [
      {
        name: "Connect QuickBooks",
        method: "GET",
        path: "/api/books/qbo/connect",
        description: "Initiate QuickBooks OAuth connection",
        requiresAuth: true,
      },
      {
        name: "QuickBooks Callback",
        method: "GET",
        path: "/api/books/qbo/callback",
        description: "Handle QuickBooks OAuth callback",
        requiresAuth: false,
      },
      {
        name: "QuickBooks Status",
        method: "GET",
        path: "/api/books/qbo/status",
        description: "Check QuickBooks connection status",
        requiresAuth: true,
      },
      {
        name: "Sync QuickBooks",
        method: "POST",
        path: "/api/books/qbo/sync",
        description: "Sync data with QuickBooks",
        requiresAuth: true,
      },
      {
        name: "Connect Xero",
        method: "GET",
        path: "/api/books/xero/connect",
        description: "Initiate Xero OAuth connection",
        requiresAuth: true,
      },
      {
        name: "Xero Callback",
        method: "GET",
        path: "/api/books/xero/callback",
        description: "Handle Xero OAuth callback",
        requiresAuth: false,
      },
      {
        name: "Connect Plaid",
        method: "POST",
        path: "/api/plaid/create-link-token",
        description: "Create Plaid Link token for bank connections",
        requiresAuth: true,
      },
      {
        name: "Exchange Plaid Token",
        method: "POST",
        path: "/api/plaid/exchange-token",
        description: "Exchange Plaid public token for access token",
        requiresAuth: true,
      },
    ],
  },

  "AI & Intelligence": {
    name: "AI & Intelligence",
    description: "AI-powered tax advice, document processing, and analytics",
    endpoints: [
      {
        name: "Chat with AI Agent",
        method: "POST",
        path: "/api/chat",
        description: "Get AI-powered tax advice and assistance",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              message: "How do I file a 1099-NEC?",
              conversation_id: "conv_123",
            },
            null,
            2,
          ),
        },
      },
      {
        name: "AI Agent Intelligence",
        method: "POST",
        path: "/api/agent-intelligence",
        description: "Advanced AI analysis and recommendations",
        requiresAuth: true,
      },
      {
        name: "Categorize Transactions",
        method: "POST",
        path: "/api/ml/categorize",
        description: "Auto-categorize expenses using ML",
        requiresAuth: true,
      },
      {
        name: "Fraud Detection",
        method: "POST",
        path: "/api/ml/fraud-check",
        description: "Check transactions for fraud indicators",
        requiresAuth: true,
      },
      {
        name: "Cash Flow Forecast",
        method: "GET",
        path: "/api/ml/cash-flow-forecast",
        description: "AI-powered cash flow predictions",
        requiresAuth: true,
      },
      {
        name: "Generate AI Report",
        method: "POST",
        path: "/api/reports/generate-ai",
        description: "Generate financial reports with AI insights",
        requiresAuth: true,
      },
    ],
  },

  "Form 941": {
    name: "Form 941",
    description: "Quarterly employer tax returns and EFTPS deposits",
    endpoints: [
      {
        name: "List 941 Forms",
        method: "GET",
        path: "/api/form-941/list",
        description: "Get all Form 941 quarterly filings",
        requiresAuth: true,
      },
      {
        name: "Validate 941 Form",
        method: "POST",
        path: "/api/form-941/validate",
        description: "Validate Form 941 data before submission",
        requiresAuth: true,
      },
      {
        name: "Generate Schedule B",
        method: "POST",
        path: "/api/form-941/schedule-b/generate",
        description: "Generate Schedule B for tax deposits",
        requiresAuth: true,
      },
      {
        name: "Calculate Safe Harbor",
        method: "POST",
        path: "/api/form-941/safe-harbor/calculate",
        description: "Calculate safe harbor deposit amounts",
        requiresAuth: true,
      },
      {
        name: "Get Safe Harbor",
        method: "GET",
        path: "/api/form-941/safe-harbor/get",
        description: "Get saved safe harbor calculations",
        requiresAuth: true,
      },
      {
        name: "Calculate Lookback Period",
        method: "POST",
        path: "/api/form-941/lookback/calculate",
        description: "Calculate lookback period for deposits",
        requiresAuth: true,
      },
      {
        name: "List EFTPS Deposits",
        method: "GET",
        path: "/api/form-941/eftps/list",
        description: "Get all EFTPS tax deposits",
        requiresAuth: true,
      },
      {
        name: "Schedule EFTPS Deposit",
        method: "POST",
        path: "/api/form-941/eftps/schedule-deposit",
        description: "Schedule a new EFTPS tax deposit",
        requiresAuth: true,
      },
    ],
  },

  Developer: {
    name: "Developer Tools",
    description: "API keys, webhooks, and developer platform features",
    endpoints: [
      {
        name: "List API Keys",
        method: "GET",
        path: "/api/developer/keys/list",
        description: "Get all API keys for your account",
        requiresAuth: true,
      },
      {
        name: "Create API Key",
        method: "POST",
        path: "/api/developer/keys/create",
        description: "Generate a new API key",
        requiresAuth: true,
        requestBody: {
          example: JSON.stringify(
            {
              name: "Production API Key",
              scopes: ["read:filings", "write:filings"],
            },
            null,
            2,
          ),
        },
      },
      {
        name: "Revoke API Key",
        method: "POST",
        path: "/api/developer/keys/revoke",
        description: "Revoke an existing API key",
        requiresAuth: true,
      },
      {
        name: "API Usage Stats",
        method: "GET",
        path: "/api/developer/usage",
        description: "Get API usage statistics",
        requiresAuth: true,
      },
      {
        name: "List Test Requests",
        method: "GET",
        path: "/api/developer/test-requests",
        description: "Get saved test API requests",
        requiresAuth: true,
      },
      {
        name: "Save Test Request",
        method: "POST",
        path: "/api/developer/test-requests",
        description: "Save an API test request",
        requiresAuth: true,
      },
      {
        name: "List Collections",
        method: "GET",
        path: "/api/developer/test-collections",
        description: "Get test request collections",
        requiresAuth: true,
      },
      {
        name: "Create Collection",
        method: "POST",
        path: "/api/developer/test-collections",
        description: "Create a new test collection",
        requiresAuth: true,
      },
      {
        name: "Execute Request",
        method: "POST",
        path: "/api/developer/execute",
        description: "Execute an API request and log it",
        requiresAuth: true,
      },
    ],
  },

  Admin: {
    name: "Admin",
    description: "Administrative functions and system health",
    endpoints: [
      {
        name: "Admin Login",
        method: "POST",
        path: "/api/admin/login",
        description: "Authenticate as admin user",
        requiresAuth: false,
      },
      {
        name: "System Health",
        method: "GET",
        path: "/api/admin/system-health",
        description: "Check system health and status",
        requiresAuth: true,
      },
      {
        name: "Audit Logs",
        method: "GET",
        path: "/api/admin/audit-logs",
        description: "Get system audit logs",
        requiresAuth: true,
      },
      {
        name: "Monitoring Metrics",
        method: "GET",
        path: "/api/monitoring/metrics",
        description: "Get system monitoring metrics",
        requiresAuth: true,
      },
    ],
  },

  Utilities: {
    name: "Utilities",
    description: "Health checks, webhooks, and system utilities",
    endpoints: [
      {
        name: "Health Check",
        method: "GET",
        path: "/api/health",
        description: "Simple health check endpoint",
        requiresAuth: false,
        responseExample: JSON.stringify(
          {
            status: "ok",
            timestamp: "2024-01-15T10:30:00Z",
            version: "1.0.0",
          },
          null,
          2,
        ),
      },
      {
        name: "Stripe Webhook",
        method: "POST",
        path: "/api/webhooks/stripe",
        description: "Handle Stripe webhook events",
        requiresAuth: false,
      },
      {
        name: "TaxBandits Webhook",
        method: "POST",
        path: "/api/webhooks/taxbandits",
        description: "Handle TaxBandits webhook events",
        requiresAuth: false,
      },
      {
        name: "Database Diagnostics",
        method: "GET",
        path: "/api/diagnostics/database",
        description: "Run database diagnostics",
        requiresAuth: true,
      },
    ],
  },
}
