import firebase from 'firebase';

interface IPlayerDTO {
  selected?: boolean;
  id?: string;
  name: string;
  username: string;
  patent: string;
  active: boolean;
  created?: firebase.firestore.Timestamp;
}

export default IPlayerDTO;
