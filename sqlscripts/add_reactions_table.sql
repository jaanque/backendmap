-- Table: scenario_reactions
create table if not exists scenario_reactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scenario_id uuid references scenarios(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique(user_id, scenario_id, emoji)
);

-- Index for counting
create index if not exists idx_scenario_reactions_scenario_id on scenario_reactions(scenario_id);
