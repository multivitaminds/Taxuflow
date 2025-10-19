-- Advanced AI Agent Intelligence System
-- This creates the infrastructure for sophisticated AI agents with memory, learning, and collaboration

-- Agent Memory System: Stores long-term memory for each agent
CREATE TABLE IF NOT EXISTS agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  memory_type TEXT NOT NULL, -- 'fact', 'preference', 'insight', 'pattern'
  memory_content JSONB NOT NULL,
  confidence_score INTEGER DEFAULT 100,
  relevance_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  related_documents UUID[],
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 100),
  CONSTRAINT valid_relevance CHECK (relevance_score >= 0 AND relevance_score <= 100)
);

-- Agent Collaboration Log: Tracks when agents work together
CREATE TABLE IF NOT EXISTS agent_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collaboration_type TEXT NOT NULL, -- 'analysis', 'strategy', 'optimization', 'review'
  participating_agents TEXT[] NOT NULL,
  trigger_event TEXT,
  discussion_summary TEXT,
  consensus_reached BOOLEAN DEFAULT false,
  recommendations JSONB,
  impact_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Agent Learning System: Tracks what agents learn from user interactions
CREATE TABLE IF NOT EXISTS agent_learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  learning_type TEXT NOT NULL, -- 'correction', 'preference', 'pattern', 'feedback'
  context JSONB NOT NULL,
  lesson_learned TEXT NOT NULL,
  confidence_before INTEGER,
  confidence_after INTEGER,
  applied_to_future BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advanced Tax Optimization Strategies
CREATE TABLE IF NOT EXISTS tax_optimization_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_name TEXT NOT NULL,
  strategy_type TEXT NOT NULL, -- 'deduction', 'credit', 'timing', 'structure', 'investment'
  description TEXT NOT NULL,
  potential_savings DECIMAL(12, 2),
  implementation_difficulty TEXT, -- 'easy', 'moderate', 'complex'
  time_horizon TEXT, -- 'immediate', 'this_year', 'multi_year'
  requirements JSONB,
  steps JSONB,
  risks JSONB,
  recommended_by TEXT NOT NULL,
  priority_score INTEGER DEFAULT 50,
  status TEXT DEFAULT 'suggested', -- 'suggested', 'accepted', 'implemented', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intelligent Insights: AI-generated insights that go beyond basic analysis
CREATE TABLE IF NOT EXISTS intelligent_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'opportunity', 'risk', 'trend', 'anomaly', 'prediction'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  supporting_data JSONB,
  confidence_level INTEGER DEFAULT 85,
  impact_level TEXT, -- 'low', 'medium', 'high', 'critical'
  actionable BOOLEAN DEFAULT true,
  suggested_actions JSONB,
  generated_by TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Performance Metrics: Track how well agents are performing
CREATE TABLE IF NOT EXISTS agent_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  total_analyses INTEGER DEFAULT 0,
  successful_predictions INTEGER DEFAULT 0,
  user_satisfaction_score DECIMAL(3, 2),
  average_confidence DECIMAL(5, 2),
  average_impact DECIMAL(12, 2),
  collaboration_count INTEGER DEFAULT 0,
  learning_events INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_name, metric_date)
);

-- Predictive Tax Models: Store ML models and predictions
CREATE TABLE IF NOT EXISTS predictive_tax_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL, -- 'refund_prediction', 'audit_risk', 'optimization_potential'
  prediction_data JSONB NOT NULL,
  confidence_interval JSONB,
  factors_considered TEXT[],
  created_by TEXT NOT NULL,
  valid_until TIMESTAMPTZ,
  actual_outcome JSONB,
  accuracy_score DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_memory_user ON agent_memory(user_id, agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_memory_tags ON agent_memory USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_collaborations_user ON agent_collaborations(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_events_user ON agent_learning_events(user_id, agent_name);
CREATE INDEX IF NOT EXISTS idx_optimization_strategies_user ON tax_optimization_strategies(user_id, status);
CREATE INDEX IF NOT EXISTS idx_insights_user ON intelligent_insights(user_id, acknowledged);
CREATE INDEX IF NOT EXISTS idx_insights_type ON intelligent_insights(insight_type, impact_level);
CREATE INDEX IF NOT EXISTS idx_predictive_models_user ON predictive_tax_models(user_id, model_type);

-- Enable Row Level Security
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_optimization_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligent_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_tax_models ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own agent memory"
  ON agent_memory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent memory"
  ON agent_memory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own collaborations"
  ON agent_collaborations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collaborations"
  ON agent_collaborations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own learning events"
  ON agent_learning_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own optimization strategies"
  ON tax_optimization_strategies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own optimization strategies"
  ON tax_optimization_strategies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights"
  ON intelligent_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON intelligent_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view agent performance metrics"
  ON agent_performance_metrics FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own predictive models"
  ON predictive_tax_models FOR SELECT
  USING (auth.uid() = user_id);

-- Functions for agent intelligence

-- Function to update agent memory relevance based on access patterns
CREATE OR REPLACE FUNCTION update_memory_relevance()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  NEW.access_count = OLD.access_count + 1;
  
  -- Decay relevance over time, but boost with access
  NEW.relevance_score = LEAST(100, OLD.relevance_score + 5);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_memory_relevance
  BEFORE UPDATE ON agent_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_relevance();

-- Function to automatically archive old, low-relevance memories
CREATE OR REPLACE FUNCTION archive_old_memories()
RETURNS void AS $$
BEGIN
  UPDATE agent_memory
  SET relevance_score = GREATEST(0, relevance_score - 1)
  WHERE last_accessed_at < NOW() - INTERVAL '30 days'
    AND relevance_score > 0;
END;
$$ LANGUAGE plpgsql;
