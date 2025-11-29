-- Add verification columns to profiles table
alter table profiles
add column if not exists is_verified boolean default false;

alter table profiles
add column if not exists verification_requested boolean default false;

-- Index for filtering verified users if needed
create index if not exists idx_profiles_is_verified on profiles(is_verified);
