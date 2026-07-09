create or replace function get_player_scores_on_maps(map_ids uuid ARRAY, player_ids uuid ARRAY, user_id uuid)
returns table (
  id uuid,
  rating decimal,
  score int
)
language sql
as $$
-- Score = dano médio ponderado pelo nº de partidas (v_map_ranking.quantity).
-- Prioridade: mapas selecionados -> fallback: média geral em todos os mapas -> 0
-- (o 0 é imputado pela média do grupo no TS, em balanceTeams).
SELECT p.id AS id,
       p.rating AS rating,
       round(coalesce(sel.avg_damage, com.avg_damage, 0))::int AS score
  FROM players p
  LEFT JOIN (
         SELECT v.player_id,
                sum(v.damage * v.quantity)::numeric / nullif(sum(v.quantity), 0) AS avg_damage
           FROM v_map_ranking v
          WHERE v.map_id = ANY(map_ids)
            AND v.player_id = ANY(player_ids)
          GROUP BY v.player_id
       ) sel ON sel.player_id = p.id
  LEFT JOIN (
         SELECT v.player_id,
                sum(v.damage * v.quantity)::numeric / nullif(sum(v.quantity), 0) AS avg_damage
           FROM v_map_ranking v
          WHERE v.player_id = ANY(player_ids)
          GROUP BY v.player_id
       ) com ON com.player_id = p.id
 WHERE p.id = ANY(player_ids)
   AND p.user_id = get_player_scores_on_maps.user_id;
$$;
