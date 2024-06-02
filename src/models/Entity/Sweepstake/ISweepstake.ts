import ISelectOption from '~/models/ISelectOption';

interface ISweepstake {
  game_type: ISelectOption;
  engine: ISelectOption;
  departure_at: string;
}

export default ISweepstake;
