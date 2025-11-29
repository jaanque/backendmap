
-- Add forks_count column to scenarios table
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS forks_count INTEGER DEFAULT 0;

-- Function to maintain forks_count
CREATE OR REPLACE FUNCTION update_scenario_forks_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.parent_scenario_id IS NOT NULL) THEN
        UPDATE scenarios SET forks_count = forks_count + 1 WHERE id = NEW.parent_scenario_id;
    ELSIF (TG_OP = 'DELETE' AND OLD.parent_scenario_id IS NOT NULL) THEN
        UPDATE scenarios SET forks_count = forks_count - 1 WHERE id = OLD.parent_scenario_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update forks_count on scenario insert/delete
DROP TRIGGER IF EXISTS update_forks_count_trigger ON scenarios;
CREATE TRIGGER update_forks_count_trigger
AFTER INSERT OR DELETE ON scenarios
FOR EACH ROW
EXECUTE FUNCTION update_scenario_forks_count();

-- Backfill existing forks counts
UPDATE scenarios s
SET forks_count = (
    SELECT count(*)
    FROM scenarios child
    WHERE child.parent_scenario_id = s.id
);
