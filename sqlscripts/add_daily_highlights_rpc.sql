-- Function to get daily highlights
-- Logic: Top scenarios by likes in the last 24 hours.
-- Fallback: If no recent likes, defaults to total favorites count (All-time popular).
-- This ensures the section is never empty as long as scenarios exist.
CREATE OR REPLACE FUNCTION get_daily_highlights(limit_count int DEFAULT 3)
RETURNS SETOF scenarios
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM scenarios s
  LEFT JOIN (
    SELECT scenario_id, COUNT(*) as daily_count
    FROM user_favorites
    WHERE created_at >= (now() - interval '24 hours')
    GROUP BY scenario_id
  ) d ON s.id = d.scenario_id
  ORDER BY
    COALESCE(d.daily_count, 0) DESC, -- Primary: Recent likes
    s.favorites_count DESC,          -- Secondary: Total likes (Fallback)
    s.created_at DESC                -- Tertiary: Newest
  LIMIT limit_count;
END;
$$;
