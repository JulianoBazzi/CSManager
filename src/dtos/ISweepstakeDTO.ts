/* eslint-disable camelcase */
interface ISweepstakeDTO {
  id?: string;
  user_id?: string;
  game_type: string;
  consider_patents: boolean;
  consider_previous_rankings: boolean;
  quantity_players: number;
  quantity_maps: number;
  departure_at: Date;
  created_at: Date;
  updated_at: Date;
}

export default ISweepstakeDTO;
