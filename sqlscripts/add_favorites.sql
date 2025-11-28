CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, scenario_id)
);

-- Enable RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);
