-- Create organizations schema for multi-tenancy support

-- Organizations table
CREATE TABLE IF NOT EXISTS public.orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization members table
CREATE TABLE IF NOT EXISTS public.org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orgs (users can see orgs they're members of)
CREATE POLICY "Users can view orgs they belong to" ON public.orgs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = orgs.id
      AND org_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert orgs" ON public.orgs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners and admins can update orgs" ON public.orgs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = orgs.id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners can delete orgs" ON public.orgs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = orgs.id
      AND org_members.user_id = auth.uid()
      AND org_members.role = 'owner'
    )
  );

-- RLS Policies for org_members
CREATE POLICY "Users can view members of their orgs" ON public.org_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members AS om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert themselves as members" ON public.org_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners and admins can manage members" ON public.org_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members AS om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orgs_created_at ON public.orgs(created_at);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.org_members(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on orgs
DROP TRIGGER IF EXISTS update_orgs_updated_at ON public.orgs;
CREATE TRIGGER update_orgs_updated_at
  BEFORE UPDATE ON public.orgs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on org_members
DROP TRIGGER IF EXISTS update_org_members_updated_at ON public.org_members;
CREATE TRIGGER update_org_members_updated_at
  BEFORE UPDATE ON public.org_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
