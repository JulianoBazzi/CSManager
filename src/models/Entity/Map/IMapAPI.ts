interface IMapAPI {
  id: string;
  game_type: string;
  map_type: string;
  name: string;
  active: boolean;

  format_short_game_type: string;
  format_map_type: string;
  format_active: string;
}

export default IMapAPI;
