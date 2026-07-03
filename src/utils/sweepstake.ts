import type ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';

export type MapStatus = 'draw' | 'team_one' | 'team_two' | 'pending';

/**
 * Determina o resultado de um mapa a partir dos placares das duas equipes nos
 * dois lados. Empate só conta quando há pontuação; 0 a 0 é considerado pendente.
 */
export function calculateMapStatus({
  team_one_score_1,
  team_one_score_2,
  team_two_score_1,
  team_two_score_2,
}: Pick<
  ISweepstakeMapAPI,
  'team_one_score_1' | 'team_one_score_2' | 'team_two_score_1' | 'team_two_score_2'
>): MapStatus {
  const teamOneTotal = team_one_score_1 + team_one_score_2;
  const teamTwoTotal = team_two_score_1 + team_two_score_2;

  if (teamOneTotal === teamTwoTotal && teamOneTotal > 0) {
    return 'draw';
  }

  if (teamOneTotal > teamTwoTotal) {
    return 'team_one';
  }

  if (teamTwoTotal > teamOneTotal) {
    return 'team_two';
  }

  return 'pending';
}
