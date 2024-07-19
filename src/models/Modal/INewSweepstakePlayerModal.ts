import { SweepstakeTeamEnum } from '~/models//Entity/Sweepstake/ISweepstakePlayerAPI';
import ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import ISweepstakePlayer from '~/models/Entity/Sweepstake/ISweepstakePlayer';
import IRecordModal from '~/models/Modal/IRecordModal';

interface INewSweepstakePlayerModal extends IRecordModal {
  sweepstake: ISweepstakeAPI;
  maps?: ISweepstakeMapAPI[];
  team: SweepstakeTeamEnum;
  onSubmit: (data: ISweepstakePlayer[]) => void;
}

export default INewSweepstakePlayerModal;
