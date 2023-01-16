import { createClient } from '@supabase/supabase-js';

import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '~/config/constants';

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;
