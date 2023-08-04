import ISelectOption from '~/models/ISelectOption';

interface ISweepstake {
  id: string;
  game_type: ISelectOption;
  quantity_players: number;
  quantity_maps: number;
  departure_at: string;
}

export default ISweepstake;
