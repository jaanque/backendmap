
-- Fix Infinite Recursion in RLS Policies

-- Drop problematic policies
DROP POLICY IF EXISTS "Collaborators can view other collaborators" ON scenario_collaborators;
DROP POLICY IF EXISTS "Authors can manage collaborators" ON scenario_collaborators;

-- Create a helper function to check access without triggering RLS recursion
-- SECURITY DEFINER ensures it runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION is_scenario_member(lookup_scenario_id UUID, lookup_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM scenario_collaborators
    WHERE scenario_id = lookup_scenario_id
    AND user_id = lookup_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create Policies

-- 1. Authors can manage (ALL) collaborators
-- This check accesses 'scenarios' table, not 'scenario_collaborators', so it's safe.
CREATE POLICY "Authors can manage collaborators" ON scenario_collaborators
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM scenarios
            WHERE scenarios.id = scenario_collaborators.scenario_id
            AND scenarios.author_id = auth.uid()
        )
    );

-- 2. Users can view themselves
CREATE POLICY "Users can view their own collaboration entry" ON scenario_collaborators
    FOR SELECT
    USING (
        auth.uid() = user_id
    );

-- 3. Collaborators can view OTHER collaborators for the same scenario
-- We use the SECURITY DEFINER function to check if the *current user* is a member
-- This avoids the SELECT policy on scenario_collaborators from firing recursively
CREATE POLICY "Collaborators can view other collaborators" ON scenario_collaborators
    FOR SELECT
    USING (
        is_scenario_member(scenario_id, auth.uid())
    );
