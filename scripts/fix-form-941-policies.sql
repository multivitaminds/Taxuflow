-- Fix Form 941 Tables - Drop and recreate policies to avoid conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own 941 filings" ON form_941_filings;
DROP POLICY IF EXISTS "Users can manage their own EFTPS deposits" ON eftps_deposits;
DROP POLICY IF EXISTS "Users can manage their own deposit schedules" ON form_941_deposit_schedules;
DROP POLICY IF EXISTS "Users can manage their own 941 reconciliations" ON form_941_reconciliations;
DROP POLICY IF EXISTS "Users can view penalties for their 941 filings" ON form_941_penalties;

-- Recreate policies
CREATE POLICY "Users can manage their own 941 filings"
  ON form_941_filings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own EFTPS deposits"
  ON eftps_deposits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own deposit schedules"
  ON form_941_deposit_schedules FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 941 reconciliations"
  ON form_941_reconciliations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view penalties for their 941 filings"
  ON form_941_penalties FOR SELECT USING (
    form_941_id IN (SELECT id FROM form_941_filings WHERE user_id = auth.uid())
  );
