import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import IRecordModal from '~/models/Modal/IRecordModal';

interface IPlayerMapRankingModal extends IRecordModal {
  player: IPlayerAPI;
}

export default IPlayerMapRankingModal;
