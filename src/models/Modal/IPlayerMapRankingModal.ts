import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import type IRecordModal from '~/models/Modal/IRecordModal';

interface IPlayerMapRankingModal extends IRecordModal {
  player: IPlayerAPI;
}

export default IPlayerMapRankingModal;
