-- Add foreign key relationships for all accounting tables
-- This enables Supabase to properly join related tables in queries

-- =================================================================
-- PUBLIC SCHEMA RELATIONSHIPS
-- =================================================================

-- 1. INVOICES relationships
ALTER TABLE public.invoices
  DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey,
  ADD CONSTRAINT invoices_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.customers(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);

-- 2. INVOICE_ITEMS relationships
ALTER TABLE public.invoice_items
  DROP CONSTRAINT IF EXISTS invoice_items_invoice_id_fkey,
  ADD CONSTRAINT invoice_items_invoice_id_fkey 
    FOREIGN KEY (invoice_id) 
    REFERENCES public.invoices(id) 
    ON DELETE CASCADE;

ALTER TABLE public.invoice_items
  DROP CONSTRAINT IF EXISTS invoice_items_account_id_fkey,
  ADD CONSTRAINT invoice_items_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_account_id ON public.invoice_items(account_id);

-- 3. EXPENSES relationships
ALTER TABLE public.expenses
  DROP CONSTRAINT IF EXISTS expenses_vendor_id_fkey,
  ADD CONSTRAINT expenses_vendor_id_fkey 
    FOREIGN KEY (vendor_id) 
    REFERENCES public.vendors(id) 
    ON DELETE SET NULL;

ALTER TABLE public.expenses
  DROP CONSTRAINT IF EXISTS expenses_account_id_fkey,
  ADD CONSTRAINT expenses_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

ALTER TABLE public.expenses
  DROP CONSTRAINT IF EXISTS expenses_category_id_fkey,
  ADD CONSTRAINT expenses_category_id_fkey 
    FOREIGN KEY (category_id) 
    REFERENCES public.expense_categories(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_expenses_vendor_id ON public.expenses(vendor_id);
CREATE INDEX IF NOT EXISTS idx_expenses_account_id ON public.expenses(account_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON public.expenses(category_id);

-- 4. CUSTOMERS relationships (already exists via contacts, but let's ensure)
-- Customers table is standalone but referenced by other tables

-- 5. VENDORS relationships
-- Vendors table is standalone but referenced by other tables

-- 6. BANK_ACCOUNTS relationships
ALTER TABLE public.bank_accounts
  DROP CONSTRAINT IF EXISTS bank_accounts_account_id_fkey,
  ADD CONSTRAINT bank_accounts_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bank_accounts_account_id ON public.bank_accounts(account_id);

-- 7. BANK_TRANSACTIONS relationships
ALTER TABLE public.bank_transactions
  DROP CONSTRAINT IF EXISTS bank_transactions_bank_account_id_fkey,
  ADD CONSTRAINT bank_transactions_bank_account_id_fkey 
    FOREIGN KEY (bank_account_id) 
    REFERENCES public.bank_accounts(id) 
    ON DELETE CASCADE;

ALTER TABLE public.bank_transactions
  DROP CONSTRAINT IF EXISTS bank_transactions_vendor_id_fkey,
  ADD CONSTRAINT bank_transactions_vendor_id_fkey 
    FOREIGN KEY (vendor_id) 
    REFERENCES public.vendors(id) 
    ON DELETE SET NULL;

ALTER TABLE public.bank_transactions
  DROP CONSTRAINT IF EXISTS bank_transactions_customer_id_fkey,
  ADD CONSTRAINT bank_transactions_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.customers(id) 
    ON DELETE SET NULL;

ALTER TABLE public.bank_transactions
  DROP CONSTRAINT IF EXISTS bank_transactions_category_id_fkey,
  ADD CONSTRAINT bank_transactions_category_id_fkey 
    FOREIGN KEY (category_id) 
    REFERENCES public.expense_categories(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bank_transactions_bank_account_id ON public.bank_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_vendor_id ON public.bank_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_customer_id ON public.bank_transactions(customer_id);

-- 8. PRODUCTS relationships
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_income_account_id_fkey,
  ADD CONSTRAINT products_income_account_id_fkey 
    FOREIGN KEY (income_account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_expense_account_id_fkey,
  ADD CONSTRAINT products_expense_account_id_fkey 
    FOREIGN KEY (expense_account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_asset_account_id_fkey,
  ADD CONSTRAINT products_asset_account_id_fkey 
    FOREIGN KEY (asset_account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_income_account_id ON public.products(income_account_id);
CREATE INDEX IF NOT EXISTS idx_products_expense_account_id ON public.products(expense_account_id);

-- 9. PROJECTS relationships
-- Projects table is mostly standalone

-- 10. BILLS relationships
ALTER TABLE public.bills
  DROP CONSTRAINT IF EXISTS bills_vendor_id_fkey,
  ADD CONSTRAINT bills_vendor_id_fkey 
    FOREIGN KEY (vendor_id) 
    REFERENCES public.vendors(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON public.bills(vendor_id);

-- 11. BILL_ITEMS relationships
ALTER TABLE public.bill_items
  DROP CONSTRAINT IF EXISTS bill_items_bill_id_fkey,
  ADD CONSTRAINT bill_items_bill_id_fkey 
    FOREIGN KEY (bill_id) 
    REFERENCES public.bills(id) 
    ON DELETE CASCADE;

ALTER TABLE public.bill_items
  DROP CONSTRAINT IF EXISTS bill_items_account_id_fkey,
  ADD CONSTRAINT bill_items_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES public.accounts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON public.bill_items(bill_id);

-- 12. PAYMENTS relationships
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_invoice_id_fkey,
  ADD CONSTRAINT payments_invoice_id_fkey 
    FOREIGN KEY (invoice_id) 
    REFERENCES public.invoices(id) 
    ON DELETE SET NULL;

ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_customer_id_fkey,
  ADD CONSTRAINT payments_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.customers(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);

-- 13. ESTIMATES relationships
ALTER TABLE public.estimates
  DROP CONSTRAINT IF EXISTS estimates_customer_id_fkey,
  ADD CONSTRAINT estimates_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.customers(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON public.estimates(customer_id);

-- 14. PURCHASE_ORDERS relationships
ALTER TABLE public.purchase_orders
  DROP CONSTRAINT IF EXISTS purchase_orders_vendor_id_fkey,
  ADD CONSTRAINT purchase_orders_vendor_id_fkey 
    FOREIGN KEY (vendor_id) 
    REFERENCES public.vendors(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON public.purchase_orders(vendor_id);

-- =================================================================
-- BOOKS SCHEMA RELATIONSHIPS
-- =================================================================

-- 1. BOOKS.INVOICES relationships
ALTER TABLE books.invoices
  DROP CONSTRAINT IF EXISTS invoices_contact_id_fkey,
  ADD CONSTRAINT invoices_contact_id_fkey 
    FOREIGN KEY (contact_id) 
    REFERENCES books.contacts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_books_invoices_contact_id ON books.invoices(contact_id);

-- 2. BOOKS.INVOICE_LINES relationships
ALTER TABLE books.invoice_lines
  DROP CONSTRAINT IF EXISTS invoice_lines_invoice_id_fkey,
  ADD CONSTRAINT invoice_lines_invoice_id_fkey 
    FOREIGN KEY (invoice_id) 
    REFERENCES books.invoices(id) 
    ON DELETE CASCADE;

ALTER TABLE books.invoice_lines
  DROP CONSTRAINT IF EXISTS invoice_lines_account_id_fkey,
  ADD CONSTRAINT invoice_lines_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES books.accounts(id) 
    ON DELETE SET NULL;

ALTER TABLE books.invoice_lines
  DROP CONSTRAINT IF EXISTS invoice_lines_item_id_fkey,
  ADD CONSTRAINT invoice_lines_item_id_fkey 
    FOREIGN KEY (item_id) 
    REFERENCES books.items(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_books_invoice_lines_invoice_id ON books.invoice_lines(invoice_id);
CREATE INDEX IF NOT EXISTS idx_books_invoice_lines_item_id ON books.invoice_lines(item_id);

-- 3. BOOKS.BILLS relationships
ALTER TABLE books.bills
  DROP CONSTRAINT IF EXISTS bills_contact_id_fkey,
  ADD CONSTRAINT bills_contact_id_fkey 
    FOREIGN KEY (contact_id) 
    REFERENCES books.contacts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_books_bills_contact_id ON books.bills(contact_id);

-- 4. BOOKS.BILL_LINES relationships
ALTER TABLE books.bill_lines
  DROP CONSTRAINT IF EXISTS bill_lines_bill_id_fkey,
  ADD CONSTRAINT bill_lines_bill_id_fkey 
    FOREIGN KEY (bill_id) 
    REFERENCES books.bills(id) 
    ON DELETE CASCADE;

ALTER TABLE books.bill_lines
  DROP CONSTRAINT IF EXISTS bill_lines_account_id_fkey,
  ADD CONSTRAINT bill_lines_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES books.accounts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_books_bill_lines_bill_id ON books.bill_lines(bill_id);

-- 5. BOOKS.PAYMENTS relationships
ALTER TABLE books.payments
  DROP CONSTRAINT IF EXISTS payments_contact_id_fkey,
  ADD CONSTRAINT payments_contact_id_fkey 
    FOREIGN KEY (contact_id) 
    REFERENCES books.contacts(id) 
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_books_payments_contact_id ON books.payments(contact_id);

-- 6. BOOKS.PAYMENT_APPLICATIONS relationships
ALTER TABLE books.payment_applications
  DROP CONSTRAINT IF EXISTS payment_applications_payment_id_fkey,
  ADD CONSTRAINT payment_applications_payment_id_fkey 
    FOREIGN KEY (payment_id) 
    REFERENCES books.payments(id) 
    ON DELETE CASCADE;

ALTER TABLE books.payment_applications
  DROP CONSTRAINT IF EXISTS payment_applications_invoice_id_fkey,
  ADD CONSTRAINT payment_applications_invoice_id_fkey 
    FOREIGN KEY (invoice_id) 
    REFERENCES books.invoices(id) 
    ON DELETE SET NULL;

ALTER TABLE books.payment_applications
  DROP CONSTRAINT IF EXISTS payment_applications_bill_id_fkey,
  ADD CONSTRAINT payment_applications_bill_id_fkey 
    FOREIGN KEY (bill_id) 
    REFERENCES books.bills(id) 
    ON DELETE SET NULL;

-- 7. BOOKS.ITEMS relationships
ALTER TABLE books.items
  DROP CONSTRAINT IF EXISTS items_income_account_fkey,
  ADD CONSTRAINT items_income_account_fkey 
    FOREIGN KEY (income_account) 
    REFERENCES books.accounts(id) 
    ON DELETE SET NULL;

ALTER TABLE books.items
  DROP CONSTRAINT IF EXISTS items_expense_account_fkey,
  ADD CONSTRAINT items_expense_account_fkey 
    FOREIGN KEY (expense_account) 
    REFERENCES books.accounts(id) 
    ON DELETE SET NULL;

-- 8. BOOKS.BANK_TRANSACTIONS relationships
ALTER TABLE books.bank_transactions
  DROP CONSTRAINT IF EXISTS bank_transactions_bank_account_id_fkey,
  ADD CONSTRAINT bank_transactions_bank_account_id_fkey 
    FOREIGN KEY (bank_account_id) 
    REFERENCES books.bank_accounts(id) 
    ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_books_bank_transactions_bank_account_id ON books.bank_transactions(bank_account_id);

-- 9. BOOKS.JOURNAL_LINES relationships
ALTER TABLE books.journal_lines
  DROP CONSTRAINT IF EXISTS journal_lines_entry_id_fkey,
  ADD CONSTRAINT journal_lines_entry_id_fkey 
    FOREIGN KEY (entry_id) 
    REFERENCES books.journal_entries(id) 
    ON DELETE CASCADE;

ALTER TABLE books.journal_lines
  DROP CONSTRAINT IF EXISTS journal_lines_account_id_fkey,
  ADD CONSTRAINT journal_lines_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES books.accounts(id) 
    ON DELETE SET NULL;

ALTER TABLE books.journal_lines
  DROP CONSTRAINT IF EXISTS journal_lines_contact_id_fkey,
  ADD CONSTRAINT journal_lines_contact_id_fkey 
    FOREIGN KEY (contact_id) 
    REFERENCES books.contacts(id) 
    ON DELETE SET NULL;

-- =================================================================
-- REFRESH SCHEMA CACHE
-- =================================================================

-- Force Supabase to refresh its schema cache
NOTIFY pgrst, 'reload schema';
