-- Add tags and author_id to scenarios table
alter table scenarios add column if not exists tags text[] default '{}';
alter table scenarios add column if not exists author_id uuid references auth.users(id);

-- Enable RLS if not already enabled (it should be, but just in case)
alter table scenarios enable row level security;

-- Policy for inserting scenarios
-- Users can insert rows if they are authenticated and the author_id matches their own ID
create policy "Users can create their own scenarios" on scenarios
  for insert with check (auth.uid() = author_id);

-- Policy for updating scenarios (optional for now, but good practice)
-- Users can update rows if they are the author
create policy "Users can update their own scenarios" on scenarios
  for update using (auth.uid() = author_id);
