import formatEnvironment from '~/utils/formatEnvironment';

export const NODE_ENV = formatEnvironment(process.env.NODE_ENV);
export const NEXT_PUBLIC_SUPABASE_URL = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const NEXT_PUBLIC_IMGBB_API_KEY = String(process.env.NEXT_PUBLIC_IMGBB_API_KEY);
export const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY);

export const TABLE_MAPS = 'maps';
export const TABLE_PLAYERS = 'players';
export const TABLE_RANKING = 'ranking';
export const TABLE_SWEEPSTAKES = 'sweepstakes';
export const TABLE_SWEEPSTAKE_MAPS = 'sweepstake_maps';
export const TABLE_SWEEPSTAKE_PLAYERS = 'sweepstake_players';

export const FUNCTION_GET_PLAYER_SCORES_ON_MAPS = 'get_player_scores_on_maps';
export const FUNCTION_GET_RANKING_BY_YEAR = 'get_ranking_by_year';

export const VIEW_RANKING = 'v_ranking';
export const VIEW_MAP_RANKING = 'v_map_ranking';
export const VIEW_SWEEPSTAKE_RANKING = 'v_sweepstake_ranking';
