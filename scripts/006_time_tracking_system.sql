-- Time Tracking System (QuickBooks Time API Parity)
-- Comprehensive time tracking for employees, contractors, and projects

-- Time Entries Table
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.project_tasks(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Time tracking
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  break_minutes INTEGER DEFAULT 0,
  
  -- Details
  description TEXT,
  notes TEXT,
  is_billable BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Billing
  hourly_rate NUMERIC(10, 2),
  billable_amount NUMERIC(10, 2),
  cost_rate NUMERIC(10, 2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, rejected, billed
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Employee Info
  employee_number VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Employment Details
  hire_date DATE,
  termination_date DATE,
  employment_type VARCHAR(50), -- full-time, part-time, contractor
  department VARCHAR(100),
  job_title VARCHAR(100),
  
  -- Compensation
  default_hourly_rate NUMERIC(10, 2),
  default_cost_rate NUMERIC(10, 2),
  salary NUMERIC(12, 2),
  pay_frequency VARCHAR(50), -- hourly, weekly, biweekly, monthly
  
  -- Time Tracking Settings
  can_track_time BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT true,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Project Info
  project_number VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  estimated_hours NUMERIC(10, 2),
  
  -- Billing
  billing_type VARCHAR(50), -- fixed-price, time-and-materials, non-billable
  fixed_price NUMERIC(12, 2),
  default_hourly_rate NUMERIC(10, 2),
  
  -- Budget
  budget_amount NUMERIC(12, 2),
  budget_hours NUMERIC(10, 2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, on-hold, completed, cancelled
  is_billable BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Tasks Table
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  -- Task Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Estimates
  estimated_hours NUMERIC(10, 2),
  
  -- Billing
  is_billable BOOLEAN DEFAULT true,
  hourly_rate NUMERIC(10, 2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'not-started', -- not-started, in-progress, completed
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timesheets Table (for grouping time entries)
CREATE TABLE IF NOT EXISTS public.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Totals
  total_hours NUMERIC(10, 2) DEFAULT 0,
  billable_hours NUMERIC(10, 2) DEFAULT 0,
  non_billable_hours NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, rejected
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timesheet Entries (link time entries to timesheets)
CREATE TABLE IF NOT EXISTS public.timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID NOT NULL REFERENCES public.timesheets(id) ON DELETE CASCADE,
  time_entry_id UUID NOT NULL REFERENCES public.time_entries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON public.time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_org ON public.time_entries(organization_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_employee ON public.time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON public.time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_dates ON public.time_entries(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON public.time_entries(status);

CREATE INDEX IF NOT EXISTS idx_employees_user ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_org ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON public.employees(is_active);

CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer ON public.projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE INDEX IF NOT EXISTS idx_timesheets_employee ON public.timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_period ON public.timesheets(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON public.timesheets(status);

-- Enable Row Level Security
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for time_entries
CREATE POLICY "Users can view their own time entries"
  ON public.time_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time entries"
  ON public.time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries"
  ON public.time_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for employees
CREATE POLICY "Users can view their own employee records"
  ON public.employees FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employee records"
  ON public.employees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employee records"
  ON public.employees FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for project_tasks
CREATE POLICY "Users can view tasks for their projects"
  ON public.project_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create tasks for their projects"
  ON public.project_tasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_tasks.project_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for timesheets
CREATE POLICY "Users can view their own timesheets"
  ON public.timesheets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own timesheets"
  ON public.timesheets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timesheets"
  ON public.timesheets FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for timesheet_entries
CREATE POLICY "Users can view their own timesheet entries"
  ON public.timesheet_entries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.timesheets
    WHERE timesheets.id = timesheet_entries.timesheet_id
    AND timesheets.user_id = auth.uid()
  ));
