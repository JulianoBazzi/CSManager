import {
  forwardRef, ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState,
} from 'react';

import {
  Checkbox,
  ModalBody, ModalFooter,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { PremierBadge } from '~/components/Badge/PremierBadge';
import { SolidBlueButton } from '~/components/Button/Base/SolidBlueButton';
import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { Modal, ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { TABLE_SWEEPSTAKE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import ISweepstakePlayer from '~/models/Entity/Sweepstake/ISweepstakePlayer';
import INewSweepstakePlayerModal from '~/models/Modal/INewSweepstakePlayerModal';
import { getPlayers } from '~/services/hooks/usePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export type NewSweepstakePlayerModalHandle = {
  onOpenModal: (recordModal?: INewSweepstakePlayerModal) => void;
};

const NewSweepstakePlayerModalBase: ForwardRefRenderFunction<NewSweepstakePlayerModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();

  const [isLoading, setIsLoading] = useState(false);
  const [recordModalProps, setRecordModalProps] = useState<INewSweepstakePlayerModal | undefined>();
  const [players, setPlayers] = useState<IPlayerAPI[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<IPlayerAPI[]>([]);

  function handleSelectedPlayers(value: IPlayerAPI) {
    const find = selectedPlayers.find((player) => player.id === value.id);
    if (find) {
      setSelectedPlayers((previousPlayers) => previousPlayers.filter((player) => player.id !== value.id));
    } else {
      setSelectedPlayers((previousPlayers) => [...previousPlayers, value]);
    }
  }

  const playerColumns: ColumnDef<IPlayerAPI>[] = [
    {
      accessorKey: 'id',
      header: '',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <Checkbox
          isChecked={!!selectedPlayers.find((player) => player.id === row.original.id)}
          onChange={() => handleSelectedPlayers(row.original)}
          isDisabled={isLoading}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      enableSorting: false,
    },
    {
      accessorKey: 'username',
      header: 'Steam',
      enableSorting: false,
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
    },
  ];

  const onOpenModal = useCallback(
    (recordModal?: INewSweepstakePlayerModal) => {
      setPlayers([]);
      setSelectedPlayers([]);
      setRecordModalProps(recordModal);
      if (recordModal?.id) {
        setIsLoading(true);
        getPlayers(recordModal.user.id, {
          active: true,
          sweepstakeIdNot: recordModal.id,
        })
          .then((response) => {
            setPlayers(response);
          })
          .catch((error) => {
            errorFeedbackToast('Jogadores', error);
            modalRef.current?.onCloseModal();
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
      modalRef.current?.onOpenModal();
    },
    [errorFeedbackToast],
  );

  const { mutateAsync: createMutateAsync, isPending: isLoadingCreate } = useMutation(
    {
      mutationFn: async () => {
        if (!recordModalProps?.user || !recordModalProps?.id) {
          return;
        }

        const playerList: ISweepstakePlayer[] = [];
        for (let i = 0; i < selectedPlayers.length;) {
          playerList.push({
            user_id: recordModalProps.user.id,
            sweepstake_id: recordModalProps.id,
            player_id: selectedPlayers[i].id,
            team: recordModalProps.team,
          });

          i += 1;
        }

        await supabase.from(TABLE_SWEEPSTAKE_PLAYERS).insert(playerList);
      },
      async onSuccess() {
        successFeedbackToast('Adicionar Jogadores', 'Jogadores adicionados com sucesso!');
        recordModalProps?.onSubmit(selectedPlayers.length);
        await queryClient.invalidateQueries({ queryKey: [TABLE_SWEEPSTAKE_PLAYERS, recordModalProps?.id] });
        modalRef.current?.onCloseModal();
      },
      onError(error) {
        errorFeedbackToast('Adicionar Jogadores', error);
      },
    },
  );

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <Modal
      ref={modalRef}
      title={`Adicionar Jogadores ao Time ${recordModalProps?.team === 0 ? '1' : '2'}`}
      size="xl"
    >
      <ModalBody>
        <Table
          data={players}
          columns={playerColumns}
          isLoading={isLoading}
          onRowClick={(value) => handleSelectedPlayers(value)}
        />
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        <SolidBlueButton w="100%" onClick={() => createMutateAsync()} isLoading={isLoadingCreate} isDisabled={selectedPlayers.length === 0}>
          {`Adicionar ${selectedPlayers.length > 0 ? ` ${selectedPlayers.length} jogadores` : ''}`}
        </SolidBlueButton>
        <CancelOutlineButton w="100%" onClick={() => modalRef.current?.onCloseModal()} isDisabled={isLoadingCreate} />
      </ModalFooter>
    </Modal>
  );
};

export const NewSweepstakePlayerModal = forwardRef(NewSweepstakePlayerModalBase);
