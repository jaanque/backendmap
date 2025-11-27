-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: scenarios
create table scenarios (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  difficulty text default 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
  flow_data jsonb default '{"initialNodes": [], "initialEdges": []}'::jsonb,
  created_at timestamptz default now()
);

-- Table: steps
create table steps (
  id uuid primary key default uuid_generate_v4(),
  scenario_id uuid references scenarios(id) on delete cascade,
  order_index int not null,
  title text not null,
  content text,
  active_node_id text,
  active_edge_id text
);

-- Indexes
create index idx_scenarios_slug on scenarios(slug);
create index idx_steps_scenario_id on steps(scenario_id);
