-- Fix permissions for user_achievements table
-- We explicitly drop the policy if it exists to avoid conflicts or stale states, then recreate it.

drop policy if exists "Users can insert their own achievements" on user_achievements;

create policy "Users can insert their own achievements" on user_achievements
  for insert with check (auth.uid() = user_id);

-- Ensure select policy exists (idempotent check not strictly needed if we assume previous scripts ran, but good for safety)
drop policy if exists "User achievements viewable by owner" on user_achievements;
create policy "User achievements viewable by owner" on user_achievements
  for select using (auth.uid() = user_id);
