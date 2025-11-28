-- Allow public read access to user_achievements
-- This is necessary to display achievements on public profiles

drop policy if exists "User achievements viewable by owner" on user_achievements;

create policy "User achievements viewable by everyone" on user_achievements
  for select using (true);
