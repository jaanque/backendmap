-- Fix RLS policies for scenarios table
-- First, drop existing policies to ensure a clean slate (and avoid errors if they don't exist)
drop policy if exists "Users can create their own scenarios" on scenarios;
drop policy if exists "Users can update their own scenarios" on scenarios;
drop policy if exists "Public read access" on scenarios;
drop policy if exists "Anyone can view scenarios" on scenarios;

-- Ensure RLS is enabled
alter table scenarios enable row level security;

-- 1. SELECT Policy: Allow everyone to view scenarios
-- This is critical for the application to function and for .select() to work after insert
create policy "Anyone can view scenarios" on scenarios
  for select using (true);

-- 2. INSERT Policy: Allow authenticated users to insert if they are the author
create policy "Users can create their own scenarios" on scenarios
  for insert with check (
    auth.role() = 'authenticated' and
    auth.uid() = author_id
  );

-- 3. UPDATE Policy: Allow authors to update their own scenarios
create policy "Users can update their own scenarios" on scenarios
  for update using (
    auth.uid() = author_id
  );

-- 4. DELETE Policy: Allow authors to delete their own scenarios
create policy "Users can delete their own scenarios" on scenarios
  for delete using (
    auth.uid() = author_id
  );
