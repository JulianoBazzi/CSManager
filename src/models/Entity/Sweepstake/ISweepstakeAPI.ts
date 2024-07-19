export enum SeepstakeEngineEnum {
  Premier = 'premier',
  Ranking = 'ranking',
}

interface ISweepstakeAPI {
  id: string;
  user_id: string;
  game_type: string;
  engine: SeepstakeEngineEnum;
  quantity_players: number;
  quantity_maps: number;
  score_team_one: number;
  score_team_two: number;
  departure_at: string;

  format_game_type: string;
  format_short_game_type: string;
  format_engine: string;
  format_departure_at: string;
}

export default ISweepstakeAPI;
