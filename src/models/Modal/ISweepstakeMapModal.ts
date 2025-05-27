import type ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import type IRecordModal from '~/models/Modal/IRecordModal';

interface ISweepstakeMapModal extends IRecordModal {
  sweepstakeMap: ISweepstakeMapAPI;
}

export default ISweepstakeMapModal;
