-- Add is_public column to profiles table
alter table profiles add column if not exists is_public boolean default false;

-- Create policy to allow anyone to view public profiles
-- This allows access if is_public is true, in addition to the existing "Users can view their own profile" policy
create policy "Anyone can view public profiles" on profiles
  for select using (is_public = true);
