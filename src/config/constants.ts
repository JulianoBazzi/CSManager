import formatEnvironment from '~/utils/formatEnvironment';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}. Verifique o seu arquivo .env.`);
  }
  return value;
}

export const NODE_ENV = formatEnvironment(process.env.NODE_ENV);

// Variáveis públicas: inlined no client e obrigatórias em ambos os lados -> validadas na carga.
export const NEXT_PUBLIC_SUPABASE_URL = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = requireEnv(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Segredos server-side: não são inlined no client, então são validados no ponto de uso
// (ver ~/config/openai.ts e a rota premier-rank).
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
export const SCRAPE_DO_TOKEN = process.env.SCRAPE_DO_TOKEN ?? '';

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
