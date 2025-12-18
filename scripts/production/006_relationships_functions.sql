-- Additional Relationships and Utility Functions

-- Function to calculate account balance
CREATE OR REPLACE FUNCTION calculate_account_balance(account_uuid UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  total_debits DECIMAL(15,2);
  total_credits DECIMAL(15,2);
  account_type TEXT;
  balance DECIMAL(15,2);
BEGIN
  SELECT type INTO account_type FROM public.accounts WHERE id = account_uuid;
  
  SELECT COALESCE(SUM(debit), 0), COALESCE(SUM(credit), 0)
  INTO total_debits, total_credits
  FROM public.journal_entry_lines
  WHERE account_id = account_uuid;
  
  IF account_type IN ('asset', 'expense') THEN
    balance := total_debits - total_credits;
  ELSE
    balance := total_credits - total_debits;
  END IF;
  
  RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Function to update neobank account balance
CREATE OR REPLACE FUNCTION update_neobank_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'credit' THEN
    UPDATE public.neobank_accounts
    SET balance = balance + NEW.amount,
        available_balance = available_balance + NEW.amount
    WHERE id = NEW.account_id;
  ELSIF NEW.transaction_type = 'debit' THEN
    UPDATE public.neobank_accounts
    SET balance = balance - NEW.amount,
        available_balance = available_balance - NEW.amount
    WHERE id = NEW.account_id;
  END IF;
  
  NEW.balance_after := (SELECT balance FROM public.neobank_accounts WHERE id = NEW.account_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for neobank transactions
CREATE TRIGGER update_balance_on_transaction
  BEFORE INSERT ON public.neobank_transactions
  FOR EACH ROW EXECUTE FUNCTION update_neobank_balance();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    organization_id,
    user_id,
    action,
    resource_type,
    resource_id,
    changes
  ) VALUES (
    COALESCE(NEW.organization_id, OLD.organization_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to important tables
CREATE TRIGGER audit_invoices
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_bills
  AFTER INSERT OR UPDATE OR DELETE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_expenses
  AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();
