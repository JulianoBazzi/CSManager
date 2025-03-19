drop view v_ranking;

create view v_ranking as
select s.user_id,
       s.id,
       s.name,
       s.username,
       s.premier,
       s.rating,
       s.sweepstake_count,
       (s.kills / s.sweepstake_count) as kills,
       (s.deaths / s.sweepstake_count) as deaths,
       (s.assistances / s.sweepstake_count) as assistances,
       s.headshot_percentage,
       (s.damage / s.sweepstake_count) as damage
  from (
select p.user_id,
       p.id,
       p.name,
       p.username,
       p.premier,
       p.rating,
       (select count(1)
          from sweepstake_players sp
         where sp.player_id = p.id) as sweepstake_count,
       SUM(r.kills) as kills,
       SUM(r.deaths) as deaths,
       SUM(r.assistances) as assistances,
       CEIL(AVG(r.headshot_percentage)) as headshot_percentage,
       SUM(r.damage) as damage
  from players p,
       ranking r
 where p.id = r.player_id
   and p.active = true
   group by p.user_id,
            p.id,
            p.name,
            p.username,
            p.premier,
            p.rating) s
