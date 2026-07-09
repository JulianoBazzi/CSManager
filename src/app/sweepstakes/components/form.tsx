'use client';

import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiTrophyLine } from 'react-icons/ri';
import { removeAccents } from '@julianobazzi/utils';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import type ISweepstakeAPI from '~/models/Entity/Sweepstake/ISweepstakeAPI';
import { useSweepstakes } from '~/services/hooks/useSweepstakes';

interface ISweepstakesProps {
  user: User;
}

export function SweepstakesForm({ user }: ISweepstakesProps) {
  const router = useRouter();

  const { data, isLoading, isFetching } = useSweepstakes(user.id);

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        sweepstake =>
          removeAccents(sweepstake.format_departure_at.trim().toLowerCase()).includes(
            removeAccents(search.trim().toLowerCase())
          ) ||
          removeAccents(sweepstake.format_short_game_type.trim().toLowerCase()).includes(
            removeAccents(search.trim().toLowerCase())
          ) ||
          removeAccents(sweepstake.format_game_type.trim().toLowerCase()).includes(
            removeAccents(search.trim().toLowerCase())
          )
      )
    );
  }, [search, data]);

  function handleVisualization(id?: string) {
    if (id) {
      router.push(`/sweepstakes/${id}`);
      return;
    }

    router.push('/sweepstakes/new');
  }

  const columns: ColumnDef<ISweepstakeAPI>[] = [
    {
      accessorKey: 'format_departure_at',
      header: 'Data/Hora Sorteio',
      enableSorting: false,
    },
    {
      accessorKey: 'format_short_game_type',
      header: 'Jogo',
      enableSorting: false,
    },
    {
      accessorKey: 'quantity_players',
      header: 'Nº Jogadores',
      enableSorting: false,
    },
    {
      accessorKey: 'quantity_maps',
      header: 'Nº Mapas',
      enableSorting: false,
    },
  ];

  return (
    <Template user={user}>
      <Card>
        <CardHeader icon={RiTrophyLine} title="Sorteios" isFetching={isFetching && !isLoading}>
          <AddIconButton onClick={() => handleVisualization()} />
        </CardHeader>
        <CardBody>
          <SearchBar onSearch={value => setSearch(value)} disabled={isFetching} />
          <Table
            data={dataFiltered}
            columns={columns}
            loading={isLoading}
            onRowClick={({ id }) => handleVisualization(id)}
          />
        </CardBody>
      </Card>
    </Template>
  );
}
