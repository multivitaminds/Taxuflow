# Complete Platform Directory & Documentation

## Overview
This document provides a comprehensive directory of all pages and features across both the **Accounting Platform** and **Neobank Platform**. Both platforms feature enterprise-grade UX with interactive tabs, AI-powered insights, clickable drill-down cards, professional hover effects, and world-class design matching $100B financial platforms.

---

## ACCOUNTING PLATFORM

### Dashboard & Overview
- **`/accounting`** - Main Dashboard
  - Customizable widgets, financial overview, quick actions
  - Real-time metrics with trend indicators
  - Recent activity feed and notifications

### Chart of Accounts & General Ledger
- **`/accounting/chart-of-accounts`** - Chart of Accounts
  - Account hierarchy with parent/sub-accounts
  - Balance tracking and account types
  - Search and filtering capabilities
- **`/accounting/chart-of-accounts/[id]`** - Account Detail
  - Transaction history
  - Balance trends and analytics
  - Edit account settings
- **`/accounting/chart-of-accounts/[id]/journal-entry/new`** - New Journal Entry
  - Multi-line entry creation
  - Debit/credit validation
  - Attachment support

### Banking & Reconciliation
- **`/accounting/banking`** - Banking Overview
  - All connected accounts summary
  - Recent transactions across accounts
  - Quick transfer and reconciliation access
- **`/accounting/banking/accounts`** - Bank Accounts List
  - Multiple bank account management
  - Balance tracking with real-time updates
  - Account linking and verification
- **`/accounting/banking/accounts/[id]`** - Bank Account Detail
  - Transaction history with search/filter
  - Balance trends and charts
  - Account settings and management
- **`/accounting/banking/transfers`** - Inter-Account Transfers
  - Transfer history with status tracking
  - Scheduled and recurring transfers
  - Transfer categories and notes
- **`/accounting/banking/transfers/new`** - New Transfer
  - Instant and scheduled transfers
  - Amount validation and confirmations
  - Receipt generation
- **`/accounting/bank-feeds`** - Bank Feeds
  - Automated transaction imports
  - Real-time bank connection status
  - Transaction categorization rules
- **`/accounting/bank-feeds/reconciliation`** - Bank Reconciliation
  - Match imported transactions to books
  - Reconciliation workflow with approvals
  - Discrepancy identification and resolution
- **`/accounting/bank-feeds/rules`** - Bank Rules Management
  - Automated categorization rules
  - Rule templates and conditions
  - Rule priority and testing
- **`/accounting/credit-cards`** - Credit Card Accounts
  - Multiple credit card management
  - Spend tracking and limits
  - Statement reconciliation
- **`/accounting/credit-cards/[id]`** - Credit Card Detail
  - Transaction history and categorization
  - Payment schedules and reminders
  - Rewards and cashback tracking

### Sales Cycle
- **`/accounting/estimates`** - Quotes/Estimates
  - Create and manage customer quotes
  - Convert to invoices or sales orders
  - Status tracking (draft, sent, accepted, declined)
- **`/accounting/estimates/[id]`** - Estimate Detail
  - Line item management
  - Customer communication history
  - PDF generation and email sending
- **`/accounting/estimates/templates`** - Estimate Templates
  - Pre-built templates for common quotes
  - Custom template creation
  - Template versioning
- **`/accounting/sales-orders`** - Sales Orders
  - Order management from quote to fulfillment
  - Inventory allocation and tracking
  - Partial fulfillment support
- **`/accounting/sales-orders/[id]`** - Sales Order Detail
  - Order line items and pricing
  - Fulfillment status tracking
  - Convert to invoice workflow
- **`/accounting/invoices`** - Invoices
  - Invoice creation and management
  - Payment tracking and reminders
  - Recurring invoice automation
- **`/accounting/customers`** - Customers
  - Customer database management
  - Contact information and history
  - Customer statements and reports

### Purchasing & Inventory
- **`/accounting/purchase-orders`** - Purchase Orders
  - PO creation and approval workflow
  - Vendor order tracking
  - Receiving and bill matching
- **`/accounting/purchase-orders/[id]`** - Purchase Order Detail
  - Line item management
  - Approval status and history
  - Receiving workflow
- **`/accounting/purchase-orders/new`** - New Purchase Order
  - Multi-line PO creation
  - Vendor selection and terms
  - Budget checking and approvals
- **`/accounting/purchase-orders/receiving`** - Receiving Center
  - Goods receipt processing
  - Partial receiving support
  - Quality control checks
- **`/accounting/bills`** - Bills
  - Vendor bill management
  - Payment scheduling
  - Three-way matching (PO, receipt, bill)
- **`/accounting/vendors`** - Vendors
  - Vendor database management
  - Payment terms and history
  - Vendor performance tracking
- **`/accounting/inventory`** - Inventory Management
  - Stock level tracking
  - Reorder point automation
  - Multi-location inventory
- **`/accounting/inventory/[id]`** - Inventory Item Detail
  - Item history and movements
  - COGS calculation
  - Lot/serial number tracking
- **`/accounting/products`** - Products & Services
  - Product catalog management
  - Pricing and costing
  - Product categories

### Financial Management
- **`/accounting/budget`** - Budgeting & Forecasting
  - Budget creation by department/category
  - Variance analysis
  - Multi-period budgeting
- **`/accounting/budget/[id]`** - Budget Detail
  - Line item budget tracking
  - Actual vs budget comparison
  - Budget adjustments and approvals
- **`/accounting/budget/new`** - New Budget
  - Template-based budget creation
  - Historical data import
  - Collaborative budget building
- **`/accounting/assets`** - Fixed Assets
  - Asset register management
  - Asset lifecycle tracking
  - Asset categories and locations
- **`/accounting/assets/[id]`** - Asset Detail
  - Asset information and history
  - Depreciation schedule
  - Maintenance and disposal records
- **`/accounting/assets/new`** - New Asset
  - Asset acquisition recording
  - Depreciation method selection
  - Initial valuation setup
- **`/accounting/assets/depreciation`** - Depreciation Schedule
  - Automated depreciation calculations
  - Multiple depreciation methods (Straight-line, Declining balance, Units of production)
  - Period-end depreciation processing
- **`/accounting/assets/disposed`** - Disposed Assets
  - Asset disposal tracking
  - Gain/loss on disposal calculation
  - Disposal documentation

### Expenses & Payroll
- **`/accounting/expenses`** - Expenses
  - Expense submission and approval
  - Multi-level approval workflows
  - Policy compliance checking
- **`/accounting/expenses/receipts`** - Receipt Scanner
  - OCR receipt scanning
  - Automatic expense creation
  - Receipt attachment and storage
- **`/accounting/expenses/mileage`** - Mileage Tracking
  - Trip logging and calculation
  - IRS mileage rate compliance
  - Route mapping and verification
- **`/accounting/expenses/reimbursements`** - Reimbursements
  - Reimbursement request management
  - Approval and payment processing
  - Reimbursement reporting
- **`/accounting/employees`** - Employees
  - Employee database management
  - Contact and emergency information
  - Employee access and permissions
- **`/accounting/payroll`** - Payroll Management
  - Pay period setup and processing
  - Salary and hourly wage management
  - Time entry integration
- **`/accounting/payroll/run`** - Run Payroll
  - Payroll calculation and review
  - Tax withholding calculations
  - Direct deposit and check printing

### Projects & Time
- **`/accounting/projects`** - Projects & Job Costing
  - Project creation and tracking
  - Budget vs actual analysis
  - Project profitability reporting
- **`/accounting/projects/[id]`** - Project Detail
  - Project milestones and tasks
  - Time and expense allocation
  - Project billing and invoicing
- **`/accounting/time-tracking`** - Time Tracking
  - Employee time entry
  - Project/task time allocation
  - Timesheet approval workflow

### Tax Management
- **`/accounting/tax`** - Tax Management
  - Tax liability tracking
  - Sales tax by jurisdiction
  - Tax payment scheduling
- **`/accounting/tax/quarterly`** - Quarterly Tax Estimates
  - Estimated tax calculations
  - Payment voucher generation
  - Quarterly filing reminders
- **`/accounting/tax/filing`** - Tax Filing Center
  - Form preparation and e-filing
  - 1099 and W-2 generation
  - Filing status tracking

### Reports & Analytics
- **`/accounting/reports`** - Reports Overview
  - Report catalog and favorites
  - Recent reports access
  - Report scheduling
- **`/accounting/reports/profit-loss`** - Profit & Loss
  - Income statement generation
  - Period comparison
  - Department/class breakdown
- **`/accounting/reports/balance-sheet`** - Balance Sheet
  - Assets, liabilities, equity summary
  - Current vs prior period
  - Account drill-down capability
- **`/accounting/reports/cash-flow`** - Cash Flow Statement
  - Operating, investing, financing activities
  - Direct or indirect method
  - Cash position forecasting
- **`/accounting/reports/ar-aging`** - AR Aging Report
  - Customer receivables aging
  - Collection priority ranking
  - Overdue invoice identification
- **`/accounting/reports/ap-aging`** - AP Aging Report
  - Vendor payables aging
  - Payment priority management
  - Cash requirement forecasting
- **`/accounting/reports/comparative`** - Comparative Reports
  - Year-over-Year (YoY) analysis
  - Quarter-over-Quarter (QoQ) analysis
  - Custom period comparisons
  - Trend indicators and growth rates
- **`/accounting/ratios`** - Financial Ratios Dashboard
  - Liquidity ratios (Current, Quick, Cash)
  - Profitability ratios (Gross, Net, Operating margins, ROI, ROA, ROE)
  - Efficiency ratios (Asset, Inventory, Receivables turnover)
  - Leverage ratios (Debt-to-equity, Debt ratio)
  - Benchmark comparison and health indicators
- **`/accounting/performance`** - Performance Metrics & KPIs
  - 15+ KPIs across 5 categories
  - Industry benchmarking
  - Target achievement tracking
  - Performance trend analysis

### Document Management
- **`/accounting/documents`** - Document Management
  - Centralized document repository
  - Advanced search and filtering
  - Document categories and tags
- **`/accounting/documents/ocr`** - OCR Scanning
  - Document digitization
  - Automatic data extraction
  - Integration with transactions
- **`/accounting/documents/versions`** - Version Control
  - Document versioning
  - Change tracking and history
  - Version comparison
- **`/accounting/documents/linked`** - Linked Documents
  - Transaction-document associations
  - Cross-reference management
  - Audit trail maintenance

### Communication
- **`/accounting/email-templates`** - Email Templates
  - Pre-built email templates
  - Custom template creation
  - Variable substitution
- **`/accounting/email-templates/[id]`** - Template Editor
  - Rich text editing
  - Template preview
  - Variable insertion
- **`/accounting/email-templates/[id]/preview`** - Template Preview
  - Live preview with sample data
  - Mobile/desktop views
  - Send test emails
- **`/accounting/notifications`** - Notification Center
  - Real-time alert management
  - Notification preferences
  - Action-required tracking

### Operations
- **`/accounting/activity`** - Activity Feed
  - Global timeline of all actions
  - User activity tracking
  - Filter by user, date, action type
- **`/accounting/import-export`** - Import/Export Center
  - CSV/Excel import wizard
  - Bulk data operations
  - Export templates and scheduling
- **`/accounting/import-export/import/[type]`** - Import Wizard
  - Step-by-step import process
  - Field mapping
  - Validation and error handling
- **`/accounting/backup`** - Backup & Restore
  - Automated backup scheduling
  - Point-in-time recovery
  - Backup retention policies
  - Restore with safety warnings

### Multi-Entity Management
- **`/accounting/companies`** - Companies Management
  - Multi-entity dashboard
  - Company switcher
  - Data isolation controls
- **`/accounting/companies/[id]`** - Company Detail
  - Company settings and information
  - User assignments
  - Data management
- **`/accounting/companies/new`** - New Company
  - Company setup wizard
  - Chart of accounts initialization
  - Integration configuration

### Settings & Configuration
- **`/accounting/settings`** - Settings
  - General settings
  - Tax configuration
  - Payment methods
  - Fiscal year setup
- **`/accounting/settings/roles`** - User Roles & Permissions
  - Custom role creation
  - Field-level security
  - Module permissions management
- **`/accounting/permissions/[id]/users`** - Role Users Management
  - User assignment to roles
  - User invitation
  - Access level configuration
- **`/accounting/onboarding`** - Onboarding Wizard
  - Step-by-step setup
  - Company information
  - Initial configuration

### Advanced Features
- **`/accounting/audit`** - Audit Trail
  - Complete change history
  - User action tracking
  - Compliance reporting
- **`/accounting/workflows`** - Workflow Automation
  - Automated workflow creation
  - Approval routing
  - Rule-based actions
- **`/accounting/recurring`** - Recurring Transactions
  - Automated transaction scheduling
  - Recurring invoice/bill setup
  - Recurrence pattern management

### Integrations
- **`/accounting/quickbooks`** - QuickBooks Integration
  - Data sync configuration
  - Import/export mapping
  - Connection status monitoring

---

## NEOBANK PLATFORM

### Dashboard & Overview
- **`/neobank`** - Main Banking Dashboard
  - Account balance overview
  - Recent transactions
  - Quick actions (transfer, pay bills, deposit)
  - Financial health score

### Account Management
- **`/neobank/accounts`** - Accounts Overview
  - All accounts in one view
  - Total balance with trends
  - Monthly inflow/outflow tracking
  - AI-powered insights and recommendations
  - Account switching and management
- **`/neobank/transactions`** - Transactions
  - Complete transaction history
  - Advanced search and filtering
  - Transaction categorization
  - Split transactions
  - Merchant information

### Personal Finance
- **`/neobank/budgets`** - Budget Management
  - Category-based budget tracking
  - Real-time spending alerts
  - Over-budget warnings
  - Upcoming bills monitoring
  - Budget templates
- **`/neobank/goals`** - Financial Goals
  - Goal creation and tracking
  - Visual progress indicators
  - AI-powered recommendations
  - Priority-based organization
  - Milestone celebrations
- **`/neobank/spending`** - Spending Analytics
  - Category breakdown
  - Spending trends over time
  - Merchant analysis
  - Budget comparison
  - Saving opportunities

### Transfers & Payments
- **`/neobank/transfers`** - Transfers
  - Domestic transfers (ACH, Wire)
  - P2P payments
  - Scheduled and recurring transfers
  - Transfer history and status
- **`/neobank/international`** - International Transfers & FX
  - Cross-border payments
  - Real-time exchange rates
  - Currency converter with locked rates
  - Multiple transfer methods (Fast Transfer, SWIFT)
  - Fee transparency
  - Rate alerts
- **`/neobank/bill-pay`** - Bill Pay
  - Upcoming bills tracking
  - Auto-pay setup
  - Recurring payments management
  - Payment history
- **`/neobank/bill-pay/payees`** - Payee Management
  - Payee database
  - Auto-pay configuration
  - Payment history by payee
  - Category assignment

### Cards
- **`/neobank/cards`** - Cards Management
  - Physical and virtual cards
  - Card controls and limits
  - Transaction alerts
  - Card freezing/unfreezing
- **`/neobank/virtual-cards`** - Virtual Cards
  - Disposable card creation
  - Single-use, recurring, and merchant-locked cards
  - Spending limit controls
  - Subscription management
  - Card expiration tracking
  - Merchant controls

### Investments
- **`/neobank/investments`** - Investment Portfolio
  - Portfolio value tracking
  - Holdings management (stocks, ETFs, crypto)
  - Performance analytics
  - Asset allocation breakdown
  - AI investment insights
  - Rebalancing recommendations
- **`/neobank/crypto`** - Crypto Dashboard
  - Cryptocurrency holdings
  - Real-time price tracking
  - Buy/sell functionality
  - Crypto transfers
  - Market trends

### Wealth Management
- **`/neobank/wealth`** - Wealth Management Dashboard
  - Total net worth tracking
  - Portfolio insights and analytics
  - Asset allocation optimization
  - Financial goal progress
  - AI-powered wealth recommendations
  - Risk assessment
- **`/neobank/robo-advisor`** - Robo-Advisor
  - Automated investment strategies
  - Risk profile assessment
  - Portfolio recommendations
  - Performance tracking
  - Continuous AI optimization
  - Rebalancing automation

### Business Banking
- **`/neobank/business`** - Business Banking
  - Business account management
  - Team access controls
  - Business services integration
  - Merchant tools
  - Business analytics
  - Payroll integration

### Credit & Loans
- **`/neobank/loans`** - Loan & Credit Management
  - Active loans tracking
  - Payment schedules
  - Credit line utilization
  - AI debt optimization recommendations
  - Refinancing opportunities
- **`/neobank/credit-score`** - Credit Score Monitoring
  - Real-time credit score display
  - Score trend tracking
  - Score factor analysis
  - Credit account listings
  - AI improvement tips
  - Credit alerts

### Subscriptions & Recurring
- **`/neobank/subscriptions`** - Subscription Management
  - Active subscription tracking
  - Monthly/yearly spending totals
  - Renewal alerts
  - AI cost-saving insights
  - Trial expiration warnings
  - Duplicate service detection

### Merchant Services
- **`/neobank/merchant`** - Merchant Services
  - Payment processing
  - POS integration
  - Invoice management
  - Transaction tracking
  - Payment method configuration
  - Sales analytics

### Reports & Analytics
- **`/neobank/reports`** - Reports Hub
  - Interactive report catalog
  - Summary, Detailed, Compare, Chart views
  - Clickable drill-down cards
  - Recent reports access
  - Scheduled reports
- **`/neobank/reports/custom`** - Custom Report Builder
  - Metric selection across categories
  - Date range configuration
  - Report scheduling
  - Export templates (PDF, Excel, CSV)
  - Filter and grouping options
- **`/neobank/insights`** - Business Insights
  - AI-powered banking intelligence
  - Trend analysis with confidence scores
  - Actionable recommendations
  - Opportunity identification
  - Risk warnings
  - Performance benchmarking
- **`/neobank/cash-flow`** - Cash Flow Forecasting
  - 6-month predictive analytics
  - Income/expense projections
  - AI-powered forecasting
  - Scenario planning (best, expected, worst case)
  - Confidence scores
  - Actionable insights

### Tax & Savings
- **`/neobank/tax-buckets`** - Tax Buckets
  - Automated tax savings
  - Quarterly estimate calculations
  - Tax bucket allocation rules
  - Tax payment reminders
  - AI tax optimization

### Additional Features
- **`/neobank/atms`** - ATM Locator
  - Nearby ATM finder
  - Fee-free ATM network
  - Directions and navigation
  - ATM features (deposit, withdrawal limits)
  - Rewards for ATM usage

---

## Key Features Across Both Platforms

### AI & Intelligence
- **AI-Powered Insights**: Every major section includes AI recommendations with confidence scores
- **Trend Analysis**: Automated detection of positive/negative trends
- **Predictive Analytics**: Forecasting and projections across financial metrics
- **Smart Categorization**: Automatic transaction and expense categorization
- **Optimization Recommendations**: Actionable suggestions for cost savings and efficiency

### User Experience
- **Interactive Tabs**: Summary, Detailed, Compare, Chart views on all reports
- **Clickable Drill-Down**: All cards and metrics link to detailed analysis
- **Professional Hover Effects**: Smooth transitions and visual feedback
- **Color-Coded Indicators**: Green (positive), Red (negative), Yellow (warning), Blue (info)
- **Gradient Backgrounds**: Modern, appealing visual design
- **Real-Time Updates**: Live data refresh across dashboards

### Enterprise Features
- **Multi-Entity Support**: Manage multiple companies/accounts from one login
- **Advanced Permissions**: Role-based access with field-level security
- **Audit Trail**: Complete change history and compliance tracking
- **Backup & Restore**: Automated backups with point-in-time recovery
- **API Integration**: Connect to QuickBooks, Stripe, and other platforms
- **Document Management**: OCR, version control, and centralized storage

### Compliance & Security
- **SOC 2 Ready**: Audit trails and access controls
- **Data Encryption**: All data encrypted at rest and in transit
- **Two-Factor Authentication**: Enhanced security for all users
- **Session Management**: Secure session handling
- **Compliance Reporting**: Built-in reports for regulatory requirements

---

## Platform Statistics

### Accounting Platform
- **75+ Pages**: Comprehensive accounting and financial management
- **30 Major Feature Systems**: All aspects of business accounting
- **15+ Reports**: Financial statements and analytics
- **8 Integration Points**: QuickBooks, Stripe, banking, and more

### Neobank Platform
- **50+ Pages**: Complete digital banking experience
- **20 Major Feature Systems**: Personal and business banking
- **10+ AI-Powered Features**: Insights, predictions, and recommendations
- **6 Advanced Enterprise Features**: Wealth management, robo-advisor, business banking

---

## Design System

### Color Palette
- **Primary**: Blue gradients for main actions and highlights
- **Success**: Green for positive trends and completions
- **Warning**: Yellow/Orange for alerts and attention items
- **Danger**: Red for errors and negative trends
- **Neutral**: Gray scale for backgrounds and borders

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, appropriate line height
- **Data Display**: Tabular numerics with proper alignment

### Components
- **Cards**: Rounded corners, shadow effects, hover states
- **Buttons**: Multiple sizes and variants (primary, secondary, outline)
- **Badges**: Status indicators with color coding
- **Progress Bars**: Visual tracking with color transitions
- **Tabs**: Navigation with active states
- **Modals**: Centered overlays with backdrop
- **Dropdowns**: Searchable with keyboard navigation

---

## Getting Started

### Accounting Platform
1. Visit `/accounting` to access the main dashboard
2. Complete onboarding wizard at `/accounting/onboarding`
3. Set up your chart of accounts
4. Connect bank feeds for automated reconciliation
5. Create your first invoice or bill

### Neobank Platform
1. Visit `/neobank` to access the banking dashboard
2. Link your accounts at `/neobank/accounts`
3. Set up budgets at `/neobank/budgets`
4. Create financial goals at `/neobank/goals`
5. Explore AI insights at `/neobank/insights`

---

## Support & Documentation

For additional help:
- Check the built-in help tooltips on each page
- Review the onboarding wizard for setup guidance
- Contact support through the settings menu
- Access API documentation for integrations

---

**Last Updated**: December 2024  
**Platform Version**: 1.0.0  
**Total Pages**: 125+  
**Total Features**: 50+
