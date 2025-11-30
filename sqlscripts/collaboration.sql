
-- Enable Realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE scenarios;
ALTER PUBLICATION supabase_realtime ADD TABLE steps;

-- Create Collaborators Table
CREATE TABLE IF NOT EXISTS scenario_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('editor', 'viewer')) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(scenario_id, user_id)
);

-- Enable RLS
ALTER TABLE scenario_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies for scenario_collaborators

-- 1. Authors can manage collaborators for their scenarios
CREATE POLICY "Authors can manage collaborators" ON scenario_collaborators
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM scenarios
            WHERE scenarios.id = scenario_collaborators.scenario_id
            AND scenarios.author_id = auth.uid()
        )
    );

-- 2. Collaborators can view the list of collaborators for the scenario they are on
CREATE POLICY "Collaborators can view other collaborators" ON scenario_collaborators
    FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM scenario_collaborators sc
            WHERE sc.scenario_id = scenario_collaborators.scenario_id
            AND sc.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM scenarios
            WHERE scenarios.id = scenario_collaborators.scenario_id
            AND scenarios.author_id = auth.uid()
        )
    );

-- Update Policies for Scenarios to include collaborators

-- Allow collaborators to VIEW private scenarios
CREATE POLICY "Collaborators can view private scenarios" ON scenarios
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM scenario_collaborators
            WHERE scenario_collaborators.scenario_id = scenarios.id
            AND scenario_collaborators.user_id = auth.uid()
        )
    );

-- Allow collaborators with 'editor' role to UPDATE scenarios
CREATE POLICY "Editors can update scenarios" ON scenarios
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM scenario_collaborators
            WHERE scenario_collaborators.scenario_id = scenarios.id
            AND scenario_collaborators.user_id = auth.uid()
            AND scenario_collaborators.role = 'editor'
        )
    );

-- Update Policies for Steps (assume steps inherit access from scenario)

-- Allow collaborators to VIEW steps
CREATE POLICY "Collaborators can view steps" ON steps
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM scenario_collaborators
            WHERE scenario_collaborators.scenario_id = steps.scenario_id
            AND scenario_collaborators.user_id = auth.uid()
        )
    );

-- Allow collaborators with 'editor' role to INSERT/UPDATE/DELETE steps
CREATE POLICY "Editors can insert steps" ON steps
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM scenario_collaborators
            WHERE scenario_collaborators.scenario_id = steps.scenario_id
            AND scenario_collaborators.user_id = auth.uid()
            AND scenario_collaborators.role = 'editor'
        )
    );

CREATE POLICY "Editors can update steps" ON steps
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM scenario_collaborators
            WHERE scenario_collaborators.scenario_id = steps.scenario_id
            AND scenario_collaborators.user_id = auth.uid()
            AND scenario_collaborators.role = 'editor'
        )
    );

CREATE POLICY "Editors can delete steps" ON steps
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM scenario_collaborators
            WHERE scenario_collaborators.scenario_id = steps.scenario_id
            AND scenario_collaborators.user_id = auth.uid()
            AND scenario_collaborators.role = 'editor'
        )
    );
