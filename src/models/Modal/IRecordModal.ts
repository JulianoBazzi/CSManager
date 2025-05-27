import type { User } from '@supabase/supabase-js';

interface IRecordModal {
  id?: string;
  user: User;
}

export default IRecordModal;
