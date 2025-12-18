-- Fix W-9 Tables - Drop and recreate policies to avoid conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own W-9 forms" ON w9_forms;
DROP POLICY IF EXISTS "Users can manage their own contractor payments" ON contractor_payments;
DROP POLICY IF EXISTS "Users can manage their own threshold alerts" ON contractor_threshold_alerts;

-- Recreate policies
CREATE POLICY "Users can manage their own W-9 forms"
  ON w9_forms FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own contractor payments"
  ON contractor_payments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own threshold alerts"
  ON contractor_threshold_alerts FOR ALL USING (auth.uid() = user_id);
