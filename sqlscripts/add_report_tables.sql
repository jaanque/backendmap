-- Table: scenario_reports
create table if not exists scenario_reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references auth.users(id) on delete set null,
  scenario_id uuid references scenarios(id) on delete cascade not null,
  reason text not null,
  description text,
  status text default 'pending', -- pending, resolved, dismissed
  created_at timestamptz default now()
);

-- Table: profile_reports
create table if not exists profile_reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references profiles(id) on delete cascade not null,
  reason text not null,
  description text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_scenario_reports_scenario_id on scenario_reports(scenario_id);
create index if not exists idx_profile_reports_target_user_id on profile_reports(target_user_id);
