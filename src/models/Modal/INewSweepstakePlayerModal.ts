import IRecordModal from '~/models/Modal/IRecordModal';

interface INewSweepstakePlayerModal extends IRecordModal {
  team: number;
  onSubmit: (numberPlayers: number) => void;
}

export default INewSweepstakePlayerModal;
