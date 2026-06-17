'use client';

import { Flex } from '@chakra-ui/react';
import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { RiTeamLine } from 'react-icons/ri';
import removeAccents from 'remove-accents';
import {
  PlayerMapRankingModal,
  type PlayerMapRankingModalHandle,
} from '~/app/players/components/player-map-ranking-modal';
import { PlayerModal, type PlayerModalHandle } from '~/app/players/components/player-modal';
import { ActiveBadge } from '~/components/Badge/ActiveBadge';
import { BooleanBadge } from '~/components/Badge/BooleanBadge';
import { LinkBadge } from '~/components/Badge/LinkBadge';
import { PremierBadge } from '~/components/Badge/PremierBadge';
import { StarBadge } from '~/components/Badge/StarBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { RankingIconButton } from '~/components/IconButton/RankingIconButton';
import { RefreshIconButton } from '~/components/IconButton/RefreshIconButton';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import { TABLE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import { usePlayers } from '~/services/hooks/usePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

interface IPlayersProps {
  user: User;
}

export function PlayersForm({ user }: IPlayersProps) {
  const playerModalRef = useRef<PlayerModalHandle>(null);
  const playerMapRankingModalRef = useRef<PlayerMapRankingModalHandle>(null);

  const { data, isLoading, isFetching } = usePlayers(user.id);
  const { successFeedbackToast, errorFeedbackToast, warningFeedbackToast } = useFeedback();

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        player =>
          removeAccents(player.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())) ||
          removeAccents(player.username.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
      )
    );
  }, [search, data]);

  function handleShowModal(id?: string) {
    playerModalRef.current?.onOpenModal({
      id,
      user,
    });
  }

  function handleShowRankingModal(player: IPlayerAPI) {
    playerMapRankingModalRef.current?.onOpenModal({
      id: player.id,
      user,
      player,
    });
  }

  async function handleUpdatePremier() {
    const players = data?.filter(player => player.fetch_data && player.steam_id?.trim()) ?? [];

    if (players.length === 0) {
      warningFeedbackToast('Premier', 'Nenhum jogador com "Buscar Dados" habilitado e Steam ID preenchido.');
      return;
    }

    setIsUpdating(true);
    try {
      const { data: response } = await axios.post<{ results: { steam_id: string; premier: number | null }[] }>(
        '/api/premier-rank',
        { steam_ids: players.map(player => player.steam_id) }
      );

      const premierBySteamId = new Map(response.results.map(result => [result.steam_id, result.premier]));

      // premier null = não resolvido (rate limit) → pula, não sobrescreve.
      const toUpdate = players.filter(player => premierBySteamId.get(player.steam_id) != null);

      await Promise.all(
        toUpdate.map(player =>
          supabase
            .from(TABLE_PLAYERS)
            .update({ premier: premierBySteamId.get(player.steam_id) })
            .eq('id', player.id)
        )
      );

      await queryClient.invalidateQueries({ queryKey: [TABLE_PLAYERS] });
      const failed = players.length - toUpdate.length;
      successFeedbackToast(
        'Premier',
        `${toUpdate.length} jogador(es) atualizado(s)${failed ? `, ${failed} sem dados/falha` : ''}.`
      );
    } catch (error) {
      errorFeedbackToast('Premier', error);
    } finally {
      setIsUpdating(false);
    }
  }

  const columns: ColumnDef<IPlayerAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'actions',
      header: 'Steam ID',
      enableSorting: false,
      cell: ({ row }) => (
        <LinkBadge
          value={row.original.steam_id}
          link={`https://xsteamcommunity.com/profiles/${row.original.steam_id}`}
        />
      ),
    },
    {
      accessorKey: 'premier',
      header: 'Premier',
      cell: ({ row }) => <PremierBadge premier={row.original.premier} />,
    },
    {
      accessorKey: 'rating',
      header: 'Avaliação',
      cell: ({ row }) => <StarBadge rating={row.original.rating} />,
    },
    {
      accessorKey: 'fetch_data',
      header: 'Buscar Dados',
      cell: ({ row }) => <BooleanBadge active={row.original.fetch_data} />,
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => <ActiveBadge active={row.original.active} />,
    },
    {
      accessorKey: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => <RankingIconButton onClick={() => handleShowRankingModal(row.original)} size="xs" />,
    },
  ];

  return (
    <>
      <PlayerModal ref={playerModalRef} />
      <PlayerMapRankingModal ref={playerMapRankingModalRef} />
      <Template user={user}>
        <Card>
          <CardHeader icon={RiTeamLine} title="Jogadores" isFetching={isFetching && !isLoading}>
            <Flex gap="2">
              <RefreshIconButton onClick={handleUpdatePremier} loading={isUpdating} disabled={isFetching} />
              <AddIconButton onClick={() => handleShowModal()} />
            </Flex>
          </CardHeader>
          <CardBody>
            <SearchBar onSearch={value => setSearch(value)} disabled={isFetching} />
            <Table
              data={dataFiltered}
              columns={columns}
              loading={isLoading}
              onRowClick={({ id }) => handleShowModal(id)}
              orderBy={{
                id: 'name',
                desc: false,
              }}
            />
          </CardBody>
        </Card>
      </Template>
    </>
  );
}
