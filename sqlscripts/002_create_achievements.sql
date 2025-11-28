-- Create achievements table
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon_name text not null, -- e.g., 'Trophy', 'Star', 'Zap'
  created_at timestamptz default now()
);

-- Create user_achievements table
create table if not exists user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  achievement_id uuid references achievements(id) not null,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

-- Enable RLS
alter table achievements enable row level security;
alter table user_achievements enable row level security;

-- Policies
create policy "Achievements are viewable by everyone" on achievements
  for select using (true);

create policy "User achievements viewable by owner" on user_achievements
  for select using (auth.uid() = user_id);

create policy "Users can insert their own achievements" on user_achievements
  for insert with check (auth.uid() = user_id);

-- Seed data
insert into achievements (title, description, icon_name) values
  ('First Steps', 'Completed your first scenario.', 'Footprints'),
  ('Architect', 'Completed 5 scenarios.', 'DraftingCompass'),
  ('Mastermind', 'Completed all beginner scenarios.', 'Brain'),
  ('Early Bird', 'Joined during the beta phase.', 'Sun'),
  ('Bug Hunter', 'Found and reported a bug.', 'Bug');
