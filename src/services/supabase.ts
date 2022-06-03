import { SUPABASE_PUBLIC_TOKEN, SUPABASE_URL } from '@/config/env';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_TOKEN);

export default supabase;
