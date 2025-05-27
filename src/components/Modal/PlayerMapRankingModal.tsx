import {
  forwardRef, type ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState,
} from 'react';

import {
  ModalBody, ModalFooter,
} from '@chakra-ui/react';
import type { ColumnDef } from '@tanstack/react-table';

import { MapBadge } from '~/components/Badge/MapBadge';
import { Modal, type ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IViewMapRankingAPI from '~/models/Entity/Ranking/IViewMapRankingAPI';
import type IPlayerMapRankingModal from '~/models/Modal/IPlayerMapRankingModal';
import { usePlayerMapRanking } from '~/services/hooks/usePlayerMapRanking';

export type PlayerMapRankingModalHandle = {
  onOpenModal: (recordModal: IPlayerMapRankingModal) => void;
};

const PlayerMapRankingModalBase: ForwardRefRenderFunction<PlayerMapRankingModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { warningFeedbackToast } = useFeedback();

  const [recordModalProps, setRecordModalProps] = useState<IPlayerMapRankingModal | undefined>();

  const { data: rankings, isLoading } = usePlayerMapRanking(recordModalProps?.id ?? '');

  const rankingColumns: ColumnDef<IViewMapRankingAPI>[] = [
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
    (recordModal: IPlayerMapRankingModal) => {
      setRecordModalProps(recordModal);
      if (!recordModal?.id || !recordModal.player) {
        warningFeedbackToast('Ranking', 'Jogador não informado!');
        modalRef.current?.onCloseModal();
        return;
      }
      modalRef.current?.onOpenModal();
    },
    [warningFeedbackToast],
  );

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <Modal ref={modalRef} title={`Ranking: ${recordModalProps?.player?.name}`} size="4xl">
      <ModalBody>
        <Table
          data={rankings}
          columns={rankingColumns}
          isLoading={isLoading}
        />
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export const PlayerMapRankingModal = forwardRef(PlayerMapRankingModalBase);
