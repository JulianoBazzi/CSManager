import type IPlayerLeaderboardAPI from '~/models/Entity/Leaderboard/IPlayerLeaderboardAPI';
import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import type IRecordModal from '~/models/Modal/IRecordModal';

interface IPlayerLeaderboardModal extends IRecordModal {
  players: IPlayerAPI[];
  playerLeaderboard: IPlayerLeaderboardAPI;
  onSubmit: (data: IPlayerLeaderboardAPI) => Promise<void>;
}

export default IPlayerLeaderboardModal;
