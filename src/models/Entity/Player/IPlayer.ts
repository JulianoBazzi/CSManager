interface IPlayer {
  id: string;
  name: string;
  username: string;
  steam_id: string;
  premier: number;
  active: boolean;
  fetch_data: boolean;
}

export default IPlayer;
