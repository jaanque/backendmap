-- Fix RLS policies for steps table
alter table steps enable row level security;

-- 1. SELECT Policy: Allow everyone to view steps (public)
drop policy if exists "Anyone can view steps" on steps;
create policy "Anyone can view steps" on steps
  for select using (true);

-- 2. INSERT Policy: Allow authenticated users to insert steps if they are the author of the scenario
drop policy if exists "Authors can insert steps" on steps;
create policy "Authors can insert steps" on steps
  for insert with check (
    exists (
      select 1 from scenarios
      where id = scenario_id
      and author_id = auth.uid()
    )
  );

-- 3. UPDATE Policy: Allow authors to update steps
drop policy if exists "Authors can update steps" on steps;
create policy "Authors can update steps" on steps
  for update using (
    exists (
      select 1 from scenarios
      where id = scenario_id
      and author_id = auth.uid()
    )
  );

-- 4. DELETE Policy: Allow authors to delete steps
drop policy if exists "Authors can delete steps" on steps;
create policy "Authors can delete steps" on steps
  for delete using (
    exists (
      select 1 from scenarios
      where id = scenario_id
      and author_id = auth.uid()
    )
  );
