import {
  forwardRef, type ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState,
} from 'react';

import {
  ModalBody, ModalFooter,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import type { ColumnDef } from '@tanstack/react-table';

import { PremierBadge } from '~/components/Badge/PremierBadge';
import { OutlineGrayButton } from '~/components/Button/Base/OutlineGrayButton';
import { Modal, type ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { ImportImageLeaderboardModal, type ImportImageLeaderboardModalHandle } from '~/components/Modal/ImportImageLeaderboardModal';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IRankingAPI from '~/models/Entity/Ranking/IRankingAPI';
import type ISweepstakeMapModal from '~/models/Modal/ISweepstakeMapModal';
import { useSweepstakeMapRanking } from '~/services/hooks/useSweepstakeMapRanking';

export type SweepstakeMapRankingModalHandle = {
  onOpenModal: (recordModal: ISweepstakeMapModal) => void;
};

const SweepstakeMapRankingModalBase: ForwardRefRenderFunction<SweepstakeMapRankingModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const importImageLeaderboardModalRef = useRef<ImportImageLeaderboardModalHandle>(null);

  const { warningFeedbackToast } = useFeedback();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [recordModalProps, setRecordModalProps] = useState<ISweepstakeMapModal | undefined>();

  const { data: rankings, isLoading } = useSweepstakeMapRanking({
    mapId: recordModalProps?.sweepstakeMap?.map_id,
    sweepstakeId: recordModalProps?.sweepstakeMap?.sweepstake_id,
  });

  const rankingColumns: ColumnDef<IRankingAPI>[] = [
    {
      accessorKey: 'format_player_name',
      header: 'Nome',
    },
    {
      accessorKey: 'format_player_username',
      header: 'Steam',
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      cell: ({ row }) => <PremierBadge premier={row.original.players?.premier} />,
    },
    {
      accessorKey: 'kills',
      header: 'Vítimas',
    },
    {
      accessorKey: 'deaths',
      header: 'Mortes',
    },
    {
      accessorKey: 'assistances',
      header: 'Assist.',
    },
    {
      accessorKey: 'headshot_percentage',
      header: '%TC',
    },
    {
      accessorKey: 'damage',
      header: 'Dano',
    },
  ];

  const onOpenModal = useCallback(
    (recordModal: ISweepstakeMapModal) => {
      setRecordModalProps(recordModal);
      if (!recordModal?.sweepstakeMap) {
        warningFeedbackToast('Ranking', 'Mapa não informado!');
        modalRef.current?.onCloseModal();
        return;
      }
      modalRef.current?.onOpenModal();
    },
    [warningFeedbackToast],
  );

  function handleImportImageLeaderboards() {
    if (!recordModalProps?.user) {
      return;
    }

    importImageLeaderboardModalRef.current?.onOpenModal({
      id: recordModalProps.sweepstakeMap?.id,
      user: recordModalProps?.user,
      sweepstakeMap: recordModalProps.sweepstakeMap,
    });
  }

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <>
      <ImportImageLeaderboardModal ref={importImageLeaderboardModalRef} />
      <Modal ref={modalRef} title={`Ranking: ${recordModalProps?.sweepstakeMap?.maps?.name}`} size="4xl">
        <ModalBody>
          <Stack spacing="4">
            {!isMobile && recordModalProps?.user && recordModalProps?.user.id === recordModalProps?.sweepstakeMap.user_id && (
              <OutlineGrayButton onClick={() => handleImportImageLeaderboards()}>Importar Pontuação</OutlineGrayButton>
            )}
            <Table
              data={rankings}
              columns={rankingColumns}
              isLoading={isLoading}
            />
          </Stack>
        </ModalBody>
        <ModalFooter />
      </Modal>
    </>
  );
};

export const SweepstakeMapRankingModal = forwardRef(SweepstakeMapRankingModalBase);
