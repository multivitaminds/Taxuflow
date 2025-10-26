-- Create security logs table for tracking security events
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view security logs
CREATE POLICY "Super admins can view security logs"
  ON security_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- System can insert security logs
CREATE POLICY "System can insert security logs"
  ON security_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);

-- Create function to automatically set severity based on event type
CREATE OR REPLACE FUNCTION set_security_log_severity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type IN ('unauthorized_access', 'suspicious_activity', 'rate_limit_exceeded') THEN
    NEW.severity := 'warning';
  END IF;
  
  IF NEW.event_type IN ('data_breach_attempt', 'sql_injection_attempt', 'xss_attempt') THEN
    NEW.severity := 'critical';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_security_log_severity_trigger
  BEFORE INSERT ON security_logs
  FOR EACH ROW
  EXECUTE FUNCTION set_security_log_severity();
