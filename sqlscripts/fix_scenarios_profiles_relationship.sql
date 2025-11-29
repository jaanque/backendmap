-- Add foreign key relationship between scenarios and profiles to enable joins
-- This allows PostgREST to resolve the 'author:profiles(*)' query.

DO $$
BEGIN
    -- Check if the constraint already exists to avoid errors
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'scenarios_author_id_profiles_fkey'
    ) THEN
        ALTER TABLE scenarios
        ADD CONSTRAINT scenarios_author_id_profiles_fkey
        FOREIGN KEY (author_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE; -- Optional: behavior when profile/user is deleted
    END IF;
END $$;
