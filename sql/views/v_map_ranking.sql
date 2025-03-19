drop view v_map_ranking;

create view v_map_ranking as
select r.user_id,
       r.map_id,
       r.player_id,
       COUNT(1) as quantity,
       m.name,
       m.map_type,
       CEIL(AVG(kills)) as kills,
       CEIL(AVG(assistances)) as assistances,
       CEIL(AVG(deaths)) as deaths,
       CEIL(AVG(headshot_percentage)) as headshot_percentage,
       CEIL(AVG(damage)) as damage
  from ranking r
  join maps m on m.id = r.map_id
group by r.user_id,
         r.map_id,
         r.player_id,
         m.name,
         m.map_type
