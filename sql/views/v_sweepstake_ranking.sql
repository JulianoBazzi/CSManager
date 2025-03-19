drop view v_sweepstake_ranking;

create view v_sweepstake_ranking as
select r.user_id,
       r.sweepstake_id,
       r.player_id,
       p.name,
       p.username,
       p.premier,
       p.rating,
       SUM(kills) as kills,
       SUM(assistances) as assistances,
       SUM(deaths) as deaths,
       CEIL(AVG(headshot_percentage)) as headshot_percentage,
       SUM(damage) as damage
  from ranking r
  join players p on p.id = r.player_id
group by r.user_id,
         r.sweepstake_id,
         r.player_id,
         p.name,
         p.username,
         p.premier,
         p.rating
