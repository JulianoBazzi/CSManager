DROP FUNCTION get_ranking_by_year(uuid,integer)

CREATE OR REPLACE FUNCTION get_ranking_by_year(p_user_id uuid, p_year integer)
RETURNS TABLE (
    user_id UUID,
    id UUID,
    name VARCHAR,
    username VARCHAR,
    premier INTEGER,
    rating DECIMAL,
    sweepstake_count INTEGER,
    kills INTEGER,
    deaths INTEGER,
    assistances INTEGER,
    headshot_percentage INTEGER,
    damage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.user_id,
           s.id,
           s.name,
           s.username,
           s.premier::INTEGER as premier,
           s.rating::DECIMAL as rating,
           s.sweepstake_count::INTEGER as sweepstake_count,
           (s.kills / s.sweepstake_count)::INTEGER  as kills,
           (s.deaths / s.sweepstake_count)::INTEGER  as deaths,
           (s.assistances / s.sweepstake_count)::INTEGER  as assistances,
           s.headshot_percentage::INTEGER as headshot_percentage,
           (s.damage / s.sweepstake_count)::INTEGER  as damage
    FROM (
        SELECT p.user_id,
               p.id,
               p.name,
               p.username,
               p.premier,
               p.rating,
               (SELECT count(1)
                  FROM sweepstake_players sp
                 WHERE sp.player_id = p.id
                   AND EXTRACT(YEAR FROM sp.created_at) = p_year) as sweepstake_count,
               SUM(r.kills) as kills,
               SUM(r.deaths) as deaths,
               SUM(r.assistances) as assistances,
               CEIL(AVG(r.headshot_percentage)) as headshot_percentage,
               SUM(r.damage) as damage
        FROM players p,
             ranking r
        WHERE p.id = r.player_id
          AND p.active = true
          AND p.user_id = p_user_id
          AND EXTRACT(YEAR FROM r.created_at) = p_year
        GROUP BY p.user_id,
                 p.id,
                 p.name,
                 p.username,
                 p.premier,
                 p.rating
    ) s;
END;
$$ LANGUAGE plpgsql;
