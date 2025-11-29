-- Function to get daily highlights based on favorites from the previous day
CREATE OR REPLACE FUNCTION get_daily_highlights(limit_count int DEFAULT 3)
RETURNS SETOF scenarios
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM scenarios s
  JOIN (
    SELECT scenario_id, COUNT(*) as daily_likes
    FROM user_favorites
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
      AND created_at < CURRENT_DATE
    GROUP BY scenario_id
  ) stats ON s.id = stats.scenario_id
  ORDER BY stats.daily_likes DESC
  LIMIT limit_count;
END;
$$;
