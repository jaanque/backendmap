-- Add favorites_count to scenarios
alter table scenarios add column if not exists favorites_count integer default 0;

-- Function to handle the counter update
create or replace function update_favorites_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update scenarios
    set favorites_count = favorites_count + 1
    where id = NEW.scenario_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update scenarios
    set favorites_count = greatest(0, favorites_count - 1)
    where id = OLD.scenario_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_favorite_change on user_favorites;
create trigger on_favorite_change
after insert or delete on user_favorites
for each row execute function update_favorites_count();

-- Optional: Recalculate existing counts to ensure accuracy
with counts as (
  select scenario_id, count(*) as c
  from user_favorites
  group by scenario_id
)
update scenarios s
set favorites_count = c
from counts
where s.id = counts.scenario_id;
