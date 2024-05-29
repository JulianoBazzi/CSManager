import IPlayerLeaderboardAPI from '~/models/Entity/Leaderboard/IPlayerLeaderboardAPI';

interface ILeaderboardAPI {
  game: string;
  map: string;
  players: IPlayerLeaderboardAPI[];
}

export default ILeaderboardAPI;
