import firebase from 'firebase';

interface IStoreDTO {
  user: firebase.User | null;
  game: string | null;
}

export default IStoreDTO;
