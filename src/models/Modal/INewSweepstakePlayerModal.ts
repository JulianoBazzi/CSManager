import ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import IRecordModal from '~/models/Modal/IRecordModal';

interface INewSweepstakePlayerModal extends IRecordModal {
  sweepstake: ISweepstakeAPI;
  maps?: ISweepstakeMapAPI[];
  team: number;
  onSubmit: (numberPlayers: number) => void;
}

export default INewSweepstakePlayerModal;
