import { User } from '@supabase/supabase-js';
import IFilterComboBoxStringDTO from './IFilterComboBoxStringDTO';

interface IStoreDTO {
  user: User | null;
  game: string | null;
  gamesType: IFilterComboBoxStringDTO[];
  mapsType: IFilterComboBoxStringDTO[];
}

export default IStoreDTO;
