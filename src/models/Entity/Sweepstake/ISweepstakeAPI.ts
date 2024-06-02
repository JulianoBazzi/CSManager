interface ISweepstakeAPI {
  id: string;
  user_id: string;
  game_type: string;
  engine: string;
  quantity_players: number;
  quantity_maps: number;
  departure_at: string;

  format_game_type: string;
  format_short_game_type: string;
  format_engine: string;
  format_departure_at: string;
}

export default ISweepstakeAPI;
