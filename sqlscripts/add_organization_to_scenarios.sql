-- Add organization_id to scenarios table
ALTER TABLE scenarios
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Update RLS policies for scenarios to include organization access
-- Allow organization owners/admins to update scenarios belonging to their org
CREATE POLICY "Organization owners/admins can update org scenarios"
  ON scenarios FOR UPDATE
  USING (
    organization_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = scenarios.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Allow organization owners/admins to delete org scenarios
CREATE POLICY "Organization owners/admins can delete org scenarios"
  ON scenarios FOR DELETE
  USING (
    organization_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = scenarios.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );
