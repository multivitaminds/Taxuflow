-- ============================================
-- FRAUD DETECTION AND PREVENTION SYSTEM
-- Prevents duplicate filings and suspicious activity
-- ============================================

-- Function to check for duplicate submissions
CREATE OR REPLACE FUNCTION prevent_duplicate_filing()
RETURNS TRIGGER AS $$
DECLARE
  v_duplicate_count INTEGER;
  v_fraud_details JSONB;
BEGIN
  -- Check for exact duplicate submission ID
  SELECT COUNT(*) INTO v_duplicate_count
  FROM public.tax_filings
  WHERE submission_id = NEW.submission_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  IF v_duplicate_count > 0 THEN
    -- Log fraud attempt
    v_fraud_details := jsonb_build_object(
      'submission_id', NEW.submission_id,
      'form_type', NEW.form_type,
      'tax_year', NEW.tax_year,
      'reason', 'Duplicate submission ID detected'
    );
    
    INSERT INTO public.fraud_detection_log (
      user_id,
      fraud_type,
      entity_type,
      entity_id,
      severity,
      details
    ) VALUES (
      NEW.user_id,
      'duplicate_filing',
      'tax_filing',
      NEW.id,
      'high',
      v_fraud_details
    );
    
    RAISE EXCEPTION 'FRAUD ALERT: Duplicate filing detected. Submission ID % has already been filed.', NEW.submission_id
      USING HINT = 'This tax document has already been submitted. Contact support if this is an error.';
  END IF;
  
  -- Check for duplicate SSN + EIN + Tax Year combination
  IF NEW.form_data IS NOT NULL THEN
    SELECT COUNT(*) INTO v_duplicate_count
    FROM public.tax_filings
    WHERE user_id = NEW.user_id
      AND form_type = NEW.form_type
      AND tax_year = NEW.tax_year
      AND form_data->>'ssn' = NEW.form_data->>'ssn'
      AND form_data->>'ein' = NEW.form_data->>'ein'
      AND status IN ('accepted', 'pending')
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    
    IF v_duplicate_count > 0 THEN
      v_fraud_details := jsonb_build_object(
        'submission_id', NEW.submission_id,
        'form_type', NEW.form_type,
        'tax_year', NEW.tax_year,
        'ssn', CASE WHEN NEW.form_data->>'ssn' IS NOT NULL 
               THEN 'XXX-XX-' || RIGHT(NEW.form_data->>'ssn', 4) 
               ELSE NULL END,
        'ein', CASE WHEN NEW.form_data->>'ein' IS NOT NULL 
               THEN 'XX-XXX' || RIGHT(NEW.form_data->>'ein', 4) 
               ELSE NULL END,
        'reason', 'Duplicate taxpayer information for same tax year'
      );
      
      INSERT INTO public.fraud_detection_log (
        user_id,
        fraud_type,
        entity_type,
        entity_id,
        severity,
        details
      ) VALUES (
        NEW.user_id,
        'duplicate_taxpayer_filing',
        'tax_filing',
        NEW.id,
        'critical',
        v_fraud_details
      );
      
      RAISE EXCEPTION 'FRAUD ALERT: A filing for this taxpayer (SSN/EIN) and tax year % already exists.', NEW.tax_year
        USING HINT = 'You cannot file the same tax form twice for the same tax year.';
    END IF;
  END IF;
  
  -- Check for suspicious refund amounts (over $50,000)
  IF NEW.refund_amount > 50000 THEN
    v_fraud_details := jsonb_build_object(
      'submission_id', NEW.submission_id,
      'refund_amount', NEW.refund_amount,
      'reason', 'Unusually high refund amount flagged for review'
    );
    
    INSERT INTO public.fraud_detection_log (
      user_id,
      fraud_type,
      entity_type,
      entity_id,
      severity,
      details
    ) VALUES (
      NEW.user_id,
      'suspicious_refund',
      'tax_filing',
      NEW.id,
      'medium',
      v_fraud_details
    );
    
    -- Don't block, just flag for review
    RAISE NOTICE 'Large refund amount flagged for review: $%', NEW.refund_amount;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for fraud detection
DROP TRIGGER IF EXISTS trigger_prevent_duplicate_filing ON public.tax_filings;
CREATE TRIGGER trigger_prevent_duplicate_filing
  BEFORE INSERT OR UPDATE ON public.tax_filings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_filing();

-- Function to audit all filing status changes
CREATE OR REPLACE FUNCTION audit_filing_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.taxu_audit_log (
      user_id,
      entity_type,
      entity_id,
      action,
      old_values,
      new_values
    ) VALUES (
      NEW.user_id,
      'tax_filing',
      NEW.id,
      'status_change',
      jsonb_build_object(
        'old_status', OLD.status,
        'old_refund_amount', OLD.refund_amount
      ),
      jsonb_build_object(
        'new_status', NEW.status,
        'new_refund_amount', NEW.refund_amount,
        'submission_id', NEW.submission_id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status change auditing
DROP TRIGGER IF EXISTS trigger_audit_filing_status ON public.tax_filings;
CREATE TRIGGER trigger_audit_filing_status
  AFTER UPDATE ON public.tax_filings
  FOR EACH ROW
  EXECUTE FUNCTION audit_filing_status_change();
