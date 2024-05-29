import IPlayerLeaderboardAPI from '~/models/Entity/Leaderboard/IPlayerLeaderboardAPI';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import IRecordModal from '~/models/Modal/IRecordModal';

interface IPlayerLeaderboardModal extends IRecordModal {
  players: IPlayerAPI[];
  playerLeaderboard: IPlayerLeaderboardAPI;
  onSubmit: (data: IPlayerLeaderboardAPI) => Promise<void>;
}

export default IPlayerLeaderboardModal;
