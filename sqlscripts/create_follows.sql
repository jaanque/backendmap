-- Create follows table
create table if not exists follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid references auth.users(id) not null,
  following_id uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

-- Indexes for performance
create index idx_follows_follower on follows(follower_id);
create index idx_follows_following on follows(following_id);

-- Enable RLS
alter table follows enable row level security;

-- Policies

-- 1. Everyone can view follows (to show counts and lists)
create policy "Follows are viewable by everyone" on follows
  for select using (true);

-- 2. Users can follow others (insert)
create policy "Users can follow others" on follows
  for insert with check (auth.uid() = follower_id);

-- 3. Users can unfollow (delete)
create policy "Users can unfollow" on follows
  for delete using (auth.uid() = follower_id);
