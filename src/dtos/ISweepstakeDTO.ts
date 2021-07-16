import firebase from 'firebase';

interface ISweepstakeDTO {
  id?: string;
  gameType: string;
  considerPatents: boolean;
  considerPreviousRankings: boolean;
  quantityPlayers: number;
  quantityMaps: number;
  created: firebase.firestore.Timestamp;
}

export default ISweepstakeDTO;
