-- Add visibility column to scenarios table
ALTER TABLE public.scenarios
ADD COLUMN is_public BOOLEAN DEFAULT FALSE;

-- Update existing scenarios to be public (optional, depending on requirement, but safer to default false or true based on legacy)
-- Assuming existing ones were effectively public:
UPDATE public.scenarios SET is_public = TRUE;

-- Update RLS policies to respect is_public

-- Drop existing select policy
DROP POLICY IF EXISTS "Anyone can view scenarios" ON public.scenarios;

-- Create new policy: Users can view public scenarios OR their own private scenarios
CREATE POLICY "Anyone can view public scenarios"
ON public.scenarios
FOR SELECT
USING (is_public = TRUE OR auth.uid() = author_id);

-- Ensure author can update their own scenarios (regardless of public status)
-- (This likely already exists but good to double check or reaffirm)
-- Existing policy is usually "Users can update their own scenarios"
