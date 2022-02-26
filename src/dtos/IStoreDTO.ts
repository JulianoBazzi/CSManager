import firebase from 'firebase';
import IFilterComboBoxStringDTO from './IFilterComboBoxStringDTO';

interface IStoreDTO {
  user: firebase.User | null;
  game: string | null;
  gamesType: IFilterComboBoxStringDTO[];
  mapsType: IFilterComboBoxStringDTO[];
}

export default IStoreDTO;
