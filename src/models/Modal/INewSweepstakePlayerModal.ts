import type { SweepstakeTeamEnum } from '~/models//Entity/Sweepstake/ISweepstakePlayerAPI';
import type ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import type ISweepstakeMapAPI from '~/models/Entity/Sweepstake/ISweepstakeMapAPI';
import type ISweepstakePlayer from '~/models/Entity/Sweepstake/ISweepstakePlayer';
import type IRecordModal from '~/models/Modal/IRecordModal';

interface INewSweepstakePlayerModal extends IRecordModal {
  sweepstake: ISweepstakeAPI;
  maps?: ISweepstakeMapAPI[];
  team: SweepstakeTeamEnum;
  onSubmit: (data: ISweepstakePlayer[]) => void;
}

export default INewSweepstakePlayerModal;
