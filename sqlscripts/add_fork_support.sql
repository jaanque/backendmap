-- Add parent_scenario_id to scenarios table
alter table scenarios
add column if not exists parent_scenario_id uuid references scenarios(id) on delete set null;

-- Index for performance
create index if not exists idx_scenarios_parent_scenario_id on scenarios(parent_scenario_id);
