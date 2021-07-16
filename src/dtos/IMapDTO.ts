import firebase from 'firebase';

interface IMapDTO {
  selected?: boolean;
  id?: string;
  gameType: string;
  mapType: string;
  name: string;
  link?: string;
  active: boolean;
  created?: firebase.firestore.Timestamp;
}

export default IMapDTO;
