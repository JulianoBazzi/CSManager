create or replace function get_player_scores_on_maps(map_ids uuid ARRAY, player_ids uuid ARRAY, user_id uuid)
returns table (
  id uuid,
  rating decimal,
  score int
)
language sql
as $$
SELECT p.id as id,
       p.rating as rating,
       coalesce((CASE
                     WHEN x.count > 1 THEN ceil(x.damage / x.count)
                     ELSE 0
                 END), 0) AS score
FROM players p
LEFT JOIN
  (SELECT v.player_id,
          count(1) as count,
          sum(v.damage) as damage
     FROM v_map_ranking v
    WHERE v.map_id = ANY(map_ids)
    GROUP BY v.player_id) x ON p.id = x.player_id
WHERE p.id = ANY(player_ids)
  AND p.user_id = user_id;
$$;
