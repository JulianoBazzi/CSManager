'use client';

import { Text } from '@chakra-ui/react';
import type { ColumnDef } from '@tanstack/react-table';
import { type Ref, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { MapBadge } from '~/components/Badge/MapBadge';
import { RankBadge } from '~/components/Badge/RankBadge';
import { Modal, ModalBody, type ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IViewMapRankingAPI from '~/models/Entity/Ranking/IViewMapRankingAPI';
import type IPlayerMapRankingModal from '~/models/Modal/IPlayerMapRankingModal';
import { usePlayerMapRanking } from '~/services/hooks/usePlayerMapRanking';

export type PlayerMapRankingModalHandle = {
  onOpenModal: (recordModal: IPlayerMapRankingModal) => void;
};

export const PlayerMapRankingModal = ({ ref }: { ref?: Ref<PlayerMapRankingModalHandle> }) => {
  const modalRef = useRef<ModalHandle>(null);

  const { warningFeedbackToast } = useFeedback();

  const [recordModalProps, setRecordModalProps] = useState<IPlayerMapRankingModal | undefined>();

  const { data: rankings, isLoading } = usePlayerMapRanking(recordModalProps?.id ?? '');

  const rankingColumns: ColumnDef<IViewMapRankingAPI>[] = [
    {
      id: 'position',
      header: '#',
      enableSorting: false,
      cell: ({ row, table }) => (
        <RankBadge position={table.getSortedRowModel().rows.findIndex(r => r.id === row.id) + 1} />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'format_map_type',
      header: 'Categoria',
      enableSorting: false,
      cell: ({ row }) => <MapBadge type={row.original.map_type} format_type={row.original.map_type} />,
    },
    {
      accessorKey: 'quantity',
      header: 'N° Vezes',
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
    (recordModal: IPlayerMapRankingModal) => {
      setRecordModalProps(recordModal);
      if (!recordModal?.id || !recordModal.player) {
        warningFeedbackToast('Ranking', 'Jogador não informado!');
        modalRef.current?.onCloseModal();
        return;
      }
      modalRef.current?.onOpenModal();
    },
    [warningFeedbackToast]
  );

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
  );

  return (
    <Modal ref={modalRef} title={`Ranking: ${recordModalProps?.player?.name}`} size="xl">
      <ModalBody>
        <Table data={rankings} columns={rankingColumns} loading={isLoading} orderBy={{ id: 'damage', desc: true }} />
      </ModalBody>
    </Modal>
  );
};
