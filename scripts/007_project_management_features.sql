-- Advanced Project Management Features
-- Milestones, dependencies, resource allocation, and collaboration

-- Project Milestones Table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  -- Milestone Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Dates
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Progress
  progress_percentage INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'not-started', -- not-started, in-progress, completed, delayed
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Dependencies Table
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  
  -- Dependency Type
  dependency_type VARCHAR(50) DEFAULT 'finish-to-start', -- finish-to-start, start-to-start, finish-to-finish, start-to-finish
  
  -- Lag time in days
  lag_days INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Team Members Table
CREATE TABLE IF NOT EXISTS public.project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Role
  role VARCHAR(100), -- project-manager, developer, designer, qa, etc.
  
  -- Allocation
  allocation_percentage INTEGER DEFAULT 100, -- % of time allocated to this project
  hourly_rate NUMERIC(10, 2),
  
  -- Dates
  start_date DATE,
  end_date DATE,
  
  -- Permissions
  can_edit BOOLEAN DEFAULT false,
  can_approve_time BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Comments/Notes Table
CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Comment
  comment TEXT NOT NULL,
  
  -- Attachments
  attachments JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Files/Documents Table
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File Info
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  
  -- Organization
  folder VARCHAR(255),
  tags TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Expenses Table
CREATE TABLE IF NOT EXISTS public.project_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Expense Details
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  expense_date DATE NOT NULL,
  category VARCHAR(100),
  
  -- Receipt
  receipt_url TEXT,
  
  -- Billing
  is_billable BOOLEAN DEFAULT true,
  is_reimbursable BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, reimbursed
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Templates Table
CREATE TABLE IF NOT EXISTS public.project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Template Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  
  -- Template Data
  template_data JSONB NOT NULL, -- stores project structure, tasks, milestones
  
  -- Usage
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Activity Log Table
CREATE TABLE IF NOT EXISTS public.project_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity
  activity_type VARCHAR(100) NOT NULL, -- created, updated, completed, commented, etc.
  description TEXT NOT NULL,
  metadata JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance project_tasks table with additional fields
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium';
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS milestone_id UUID REFERENCES public.project_milestones(id);
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON public.project_milestones(status);

CREATE INDEX IF NOT EXISTS idx_task_dependencies_task ON public.task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_depends ON public.task_dependencies(depends_on_task_id);

CREATE INDEX IF NOT EXISTS idx_project_team_project ON public.project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user ON public.project_team_members(user_id);

CREATE INDEX IF NOT EXISTS idx_project_comments_project ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_task ON public.project_comments(task_id);

CREATE INDEX IF NOT EXISTS idx_project_files_project ON public.project_files(project_id);

CREATE INDEX IF NOT EXISTS idx_project_expenses_project ON public.project_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_project_expenses_status ON public.project_expenses(status);

CREATE INDEX IF NOT EXISTS idx_project_activity_project ON public.project_activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_created ON public.project_activity_log(created_at);

-- Enable Row Level Security
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view milestones for their projects"
  ON public.project_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_milestones.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage milestones for their projects"
  ON public.project_milestones FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_milestones.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can view team members for their projects"
  ON public.project_team_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_team_members.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can view comments for their projects"
  ON public.project_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_comments.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create comments for their projects"
  ON public.project_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view files for their projects"
  ON public.project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_files.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can view expenses for their projects"
  ON public.project_expenses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_expenses.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their templates"
  ON public.project_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage their templates"
  ON public.project_templates FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view activity for their projects"
  ON public.project_activity_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_activity_log.project_id
    AND projects.user_id = auth.uid()
  ));
