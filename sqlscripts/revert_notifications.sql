
-- Revert Notifications Implementation

-- Drop Triggers
DROP TRIGGER IF EXISTS on_new_fork ON scenarios;
DROP TRIGGER IF EXISTS on_new_favorite ON user_favorites;
DROP TRIGGER IF EXISTS on_new_follower ON follows;

-- Drop Functions
DROP FUNCTION IF EXISTS notify_on_fork;
DROP FUNCTION IF EXISTS notify_on_favorite;
DROP FUNCTION IF EXISTS notify_on_follow;
DROP FUNCTION IF EXISTS create_notification;

-- Drop Table
DROP TABLE IF EXISTS notifications;
