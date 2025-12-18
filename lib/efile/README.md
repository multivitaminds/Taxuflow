# TaxBandits E-File Integration

Complete integration with TaxBandits API for individual (B2C) and business (B2B) tax filing.

## Features

### Individual Tax Filing (B2C)
- Form 1040 with all schedules (A, C, D, E, SE)
- Direct deposit setup
- Real-time status tracking
- IRS acceptance/rejection notifications

### Business Tax Filing (B2B)
- Form 1120 (C-Corp)
- Form 1120-S (S-Corp)
- Form 1065 (Partnership)
- Schedule K-1 distribution

### Payroll Tax Filing
- Form 941 (Quarterly payroll)
- Form 940 (Annual unemployment)
- W-2 generation and filing
- 1099-NEC/MISC for contractors

## Setup

### 1. Get TaxBandits Credentials

Sign up at [TaxBandits Developer Portal](https://developer.taxbandits.com):

1. Create a developer account
2. Go to Settings → API Credentials
3. Copy your API Key and User Token
4. Set up webhook URL for status updates

### 2. Configure Environment Variables

Add to your Vercel project (Vars section in v0 sidebar):

```bash
TAXBANDITS_API_KEY=your_api_key_here
TAXBANDITS_USER_TOKEN=your_user_token_here
TAXBANDITS_ENVIRONMENT=sandbox  # or 'production'
EFILE_PROVIDER=taxbandits
EFILE_WEBHOOK_SECRET=your_webhook_secret

# TaxBandits AWS S3 for PDF Storage
TAXBANDITS_AWS_ACCESS_KEY=your_aws_access_key_id
TAXBANDITS_AWS_SECRET_KEY=your_aws_secret_access_key
TAXBANDITS_AWS_S3_BUCKET=expressirsforms
TAXBANDITS_AWS_REGION=us-east-1
```

### 3. Set Up Webhooks

Configure webhook in TaxBandits dashboard:

**Webhook URL:** `https://taxu.com/api/filing/webhook`

**Events to subscribe:**
- E-file Status Change
- PDF Complete
- Form W-9 Status Change

### 4. Run Database Migration

Execute the SQL script to create the tax_filings table:

```bash
# In v0, go to Scripts folder and run:
scripts/setup-tax-filings.sql
```

## Usage

### Individual Tax Return

```typescript
import { createEFileProvider } from '@/lib/efile/provider-factory'

const provider = createEFileProvider()

const result = await provider.submitReturn({
  taxYear: 2024,
  filingStatus: 'single',
  taxpayer: {
    firstName: 'John',
    lastName: 'Doe',
    ssn: '123-45-6789',
    dateOfBirth: '1990-01-01',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    email: 'john@example.com',
    phone: '415-555-0100'
  },
  income: {
    wages: 75000,
    interest: 500,
    dividends: 1000
  },
  deductions: {
    standardDeduction: 14600
  },
  credits: {
    childTaxCredit: 2000
  },
  taxLiability: {
    federalTax: 8500,
    stateTax: 3500,
    totalWithholding: 10000
  },
  refund: {
    federalRefund: 1500,
    stateRefund: 0,
    directDeposit: {
      routingNumber: '123456789',
      accountNumber: '987654321',
      accountType: 'checking'
    }
  }
})

console.log('Submission ID:', result.submissionId)
console.log('Status:', result.status)
```

### Check Filing Status

```typescript
const status = await provider.getFilingStatus(submissionId)

console.log('IRS Status:', status.irsStatus)
console.log('Accepted:', status.acceptedAt)
console.log('Refund Status:', status.refundStatus)
```

## API Endpoints

### POST /api/filing/submit
Submit a tax return for e-filing

**Request:**
```json
{
  "taxReturn": { /* TaxReturn object */ },
  "bankInfo": {
    "routingNumber": "123456789",
    "accountNumber": "987654321",
    "accountType": "checking"
  },
  "consent": true
}
```

**Response:**
```json
{
  "success": true,
  "filingId": "uuid",
  "submissionId": "TB-12345",
  "status": "submitted",
  "message": "Return submitted successfully",
  "estimatedProcessingTime": "24-48 hours"
}
```

### GET /api/filing/status?filingId=uuid
Check filing status

**Response:**
```json
{
  "filingId": "uuid",
  "submissionId": "TB-12345",
  "status": "accepted",
  "irsStatus": "Accepted",
  "acceptedAt": "2024-01-15T10:30:00Z",
  "refundStatus": {
    "federal": "approved",
    "estimatedDate": "2024-01-22T00:00:00Z"
  }
}
```

### POST /api/filing/webhook
Webhook handler for TaxBandits status updates (internal)

## Testing

### Sandbox Mode

The integration defaults to sandbox mode for testing:

```bash
TAXBANDITS_ENVIRONMENT=sandbox
```

**Sandbox features:**
- $5,000 BanditCash for testing
- Simulated IRS responses
- No actual IRS submission
- Test all form types

### Mock Provider

For local development without TaxBandits credentials:

```bash
EFILE_PROVIDER=mock
```

The mock provider simulates:
- 95% success rate
- Random status changes
- Realistic delays
- Sample refund tracking

## Architecture

```
┌─────────────────┐
│   Taxu App      │
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Provider Factory│
│  (Abstraction)  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│  Mock  │ │TaxBandits│
│Provider│ │ Provider │
└────────┘ └─────┬────┘
                 │
                 ▼
         ┌───────────────┐
         │ TaxBandits API│
         │   (OAuth 2.0) │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │      IRS      │
         │   (E-File)    │
         └───────────────┘
```

## Error Handling

The integration handles:
- Authentication failures
- Invalid tax data
- IRS rejections
- Network timeouts
- Webhook signature verification

All errors are logged with `[v0]` prefix for debugging.

## Security

- API credentials stored as environment variables
- Webhook signatures verified with HMAC-SHA256
- Bank account numbers encrypted at rest
- Row Level Security (RLS) on database
- Service role key for admin operations only

## Support

For TaxBandits API issues:
- Email: developer@taxbandits.com
- Phone: 704-684-4751
- Docs: https://developer.taxbandits.com

For Taxu integration issues:
- Check logs with `[v0]` prefix
- Verify environment variables
- Test with mock provider first
