interface ISweepstakeAPI {
  id: string;
  user_id: string;
  game_type: string;
  consider_patents: boolean;
  consider_previous_rankings: boolean;
  quantity_players: number;
  quantity_maps: number;
  departure_at: string;

  format_game_type: string;
  format_short_game_type: string;
  format_departure_at: string;
}

export default ISweepstakeAPI;
