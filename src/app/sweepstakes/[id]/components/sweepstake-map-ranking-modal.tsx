'use client';

import { Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import type { ColumnDef } from '@tanstack/react-table';
import { type Ref, useCallback, useImperativeHandle, useRef, useState } from 'react';
import {
  ImportImageLeaderboardModal,
  type ImportImageLeaderboardModalHandle,
} from '~/app/sweepstakes/[id]/components/import-image-leaderboard-modal';
import { RankBadge } from '~/components/Badge/RankBadge';
import { OutlineGrayButton } from '~/components/Button/Base/OutlineGrayButton';
import { Modal, ModalBody, type ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { PlayerName } from '~/components/PlayerName';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IRankingAPI from '~/models/Entity/Ranking/IRankingAPI';
import type ISweepstakeMapModal from '~/models/Modal/ISweepstakeMapModal';
import { useSweepstakeMapRanking } from '~/services/hooks/useSweepstakeMapRanking';

export type SweepstakeMapRankingModalHandle = {
  onOpenModal: (recordModal: ISweepstakeMapModal) => void;
};

export const SweepstakeMapRankingModal = ({ ref }: { ref?: Ref<SweepstakeMapRankingModalHandle> }) => {
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
      id: 'position',
      header: '#',
      enableSorting: false,
      cell: ({ row, table }) => (
        <RankBadge position={table.getSortedRowModel().rows.findIndex(r => r.id === row.id) + 1} />
      ),
    },
    {
      accessorKey: 'format_player_name',
      header: 'Jogador',
      cell: ({ row }) => (
        <PlayerName name={row.original.format_player_name} username={row.original.format_player_username} />
      ),
    },
    {
      accessorKey: 'kills',
      header: 'Vítimas',
      cell: ({ row }) => (
        <Text color="green.300" fontWeight="medium">
          {row.original.kills}
        </Text>
      ),
    },
    {
      accessorKey: 'deaths',
      header: 'Mortes',
      cell: ({ row }) => <Text color="red.300">{row.original.deaths}</Text>,
    },
    {
      accessorKey: 'assistances',
      header: 'Assist.',
    },
    {
      accessorKey: 'headshot_percentage',
      header: '%TC',
      cell: ({ row }) => <Text fontWeight="medium">{row.original.headshot_percentage}</Text>,
    },
    {
      accessorKey: 'damage',
      header: 'Dano',
      cell: ({ row }) => (
        <Text color="orange.300" fontWeight="semibold">
          {row.original.damage}
        </Text>
      ),
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
    [warningFeedbackToast]
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
    [onOpenModal]
  );

  return (
    <>
      <ImportImageLeaderboardModal ref={importImageLeaderboardModalRef} />
      <Modal ref={modalRef} title={`Ranking: ${recordModalProps?.sweepstakeMap?.maps?.name}`} size="xl">
        <ModalBody>
          <Stack gap="4">
            {!isMobile &&
              recordModalProps?.user &&
              recordModalProps?.user.id === recordModalProps?.sweepstakeMap.user_id && (
                <OutlineGrayButton onClick={() => handleImportImageLeaderboards()}>
                  Importar Pontuação
                </OutlineGrayButton>
              )}
            <Table
              data={rankings}
              columns={rankingColumns}
              loading={isLoading}
              orderBy={{ id: 'damage', desc: true }}
            />
          </Stack>
        </ModalBody>
      </Modal>
    </>
  );
};
