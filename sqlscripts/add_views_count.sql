
-- Add views_count column
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Function to safely increment views
CREATE OR REPLACE FUNCTION increment_scenario_views(scenario_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE scenarios
  SET views_count = views_count + 1
  WHERE id = scenario_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SECURITY DEFINER allows anon users to increment views if they have execute permission
