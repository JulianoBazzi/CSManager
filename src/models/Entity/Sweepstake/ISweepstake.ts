import ISelectOption from '~/models/ISelectOption';

interface ISweepstake {
  game_type: ISelectOption;
  engine: ISelectOption;
  departure_at: string;
  score_team_one: number;
  score_team_two: number;
}

export default ISweepstake;
