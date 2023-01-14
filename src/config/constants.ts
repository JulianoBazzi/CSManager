import formatEnvironment from '~/utils/formatEnvironment';

export const NODE_ENV = formatEnvironment(process.env.NODE_ENV);
export const NEXT_PUBLIC_SUPABASE_URL = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const TABLE_PLAYERS = 'players';
export const TABLE_SWEEPSTAKES = 'sweepstakes';
