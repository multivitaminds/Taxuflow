-- Credit Memos and Refunds System
-- Track customer credits, returns, and refunds

CREATE TABLE IF NOT EXISTS credit_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL, -- Original invoice if applicable
  credit_memo_number VARCHAR(50) UNIQUE NOT NULL,
  memo_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, approved, applied, refunded, expired
  reason VARCHAR(100), -- return, discount, damage, billing_error, goodwill, other
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) DEFAULT 0,
  amount_applied NUMERIC(12, 2) DEFAULT 0, -- Applied to other invoices
  amount_refunded NUMERIC(12, 2) DEFAULT 0, -- Actually refunded to customer
  amount_available NUMERIC(12, 2) DEFAULT 0, -- Still available as credit
  refund_method VARCHAR(50), -- original_payment, check, bank_transfer, store_credit
  refund_reference VARCHAR(100),
  notes TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_memo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_memo_id UUID REFERENCES credit_memos(id) ON DELETE CASCADE,
  original_invoice_item_id UUID REFERENCES invoice_items(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  reason VARCHAR(100),
  account_id UUID REFERENCES accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track how credits are applied to invoices
CREATE TABLE IF NOT EXISTS credit_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_memo_id UUID REFERENCES credit_memos(id) ON DELETE CASCADE,
  applied_to_invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  applied_amount NUMERIC(12, 2) NOT NULL,
  application_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track refund transactions
CREATE TABLE IF NOT EXISTS refund_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_memo_id UUID REFERENCES credit_memos(id) ON DELETE CASCADE,
  refund_date DATE NOT NULL,
  refund_amount NUMERIC(12, 2) NOT NULL,
  refund_method VARCHAR(50),
  reference_number VARCHAR(100),
  bank_account_id UUID REFERENCES bank_accounts(id),
  stripe_refund_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_memos_customer ON credit_memos(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_memos_invoice ON credit_memos(invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_memos_status ON credit_memos(status);
CREATE INDEX IF NOT EXISTS idx_credit_applications_memo ON credit_applications(credit_memo_id);
CREATE INDEX IF NOT EXISTS idx_credit_applications_invoice ON credit_applications(applied_to_invoice_id);
