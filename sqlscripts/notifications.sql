
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  actor_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('follow', 'fork', 'favorite')),
  resource_id UUID REFERENCES scenarios(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Helper function to insert notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_actor_id UUID,
  p_type TEXT,
  p_resource_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Prevent self-notifications
  IF p_user_id = p_actor_id THEN
    RETURN;
  END IF;

  INSERT INTO notifications (user_id, actor_id, type, resource_id)
  VALUES (p_user_id, p_actor_id, p_type, p_resource_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: New Follower
CREATE OR REPLACE FUNCTION notify_on_follow() RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(NEW.following_id, NEW.follower_id, 'follow');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_follower ON follows;
CREATE TRIGGER on_new_follower
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION notify_on_follow();

-- Trigger: New Favorite
CREATE OR REPLACE FUNCTION notify_on_favorite() RETURNS TRIGGER AS $$
DECLARE
  v_author_id UUID;
BEGIN
  SELECT author_id INTO v_author_id FROM scenarios WHERE id = NEW.scenario_id;
  IF v_author_id IS NOT NULL THEN
    PERFORM create_notification(v_author_id, NEW.user_id, 'favorite', NEW.scenario_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_favorite ON user_favorites;
CREATE TRIGGER on_new_favorite
AFTER INSERT ON user_favorites
FOR EACH ROW
EXECUTE FUNCTION notify_on_favorite();

-- Trigger: New Fork
CREATE OR REPLACE FUNCTION notify_on_fork() RETURNS TRIGGER AS $$
DECLARE
  v_author_id UUID;
BEGIN
  -- Only if it is a fork
  IF NEW.parent_scenario_id IS NOT NULL THEN
    SELECT author_id INTO v_author_id FROM scenarios WHERE id = NEW.parent_scenario_id;
    IF v_author_id IS NOT NULL THEN
      -- resource_id points to the ORIGINAL scenario being forked
      PERFORM create_notification(v_author_id, NEW.author_id, 'fork', NEW.parent_scenario_id);
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_fork ON scenarios;
CREATE TRIGGER on_new_fork
AFTER INSERT ON scenarios
FOR EACH ROW
EXECUTE FUNCTION notify_on_fork();
