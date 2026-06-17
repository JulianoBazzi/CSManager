'use client';

import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { RiMap2Line } from 'react-icons/ri';
import removeAccents from 'remove-accents';
import { MapModal, type MapModalHandle } from '~/app/maps/components/modal';
import { ActiveBadge } from '~/components/Badge/ActiveBadge';
import { MapBadge } from '~/components/Badge/MapBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import type IMapAPI from '~/models/Entity/Map/IMapAPI';
import { useMaps } from '~/services/hooks/useMaps';

interface IMapsProps {
  user: User;
}

export function MapsForm({ user }: IMapsProps) {
  const mapModalRef = useRef<MapModalHandle>(null);

  const { data, isLoading, isFetching } = useMaps(user.id);

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        map =>
          removeAccents(map.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())) ||
          removeAccents(map.format_short_game_type.trim().toLowerCase()).includes(
            removeAccents(search.trim().toLowerCase())
          ) ||
          removeAccents(map.format_map_type.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
      )
    );
  }, [search, data]);

  function handleShowModal(id?: string) {
    mapModalRef.current?.onOpenModal({
      id,
      user,
    });
  }

  const columns: ColumnDef<IMapAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'format_map_type',
      header: 'Categoria',
      enableSorting: false,
      cell: ({ row }) => <MapBadge type={row.original.map_type} format_type={row.original.format_map_type} />,
    },
    {
      accessorKey: 'format_short_game_type',
      header: 'Jogo',
      enableSorting: false,
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => <ActiveBadge active={row.original.active} />,
    },
  ];

  return (
    <>
      <MapModal ref={mapModalRef} />
      <Template user={user}>
        <Card>
          <CardHeader icon={RiMap2Line} title="Mapas" isFetching={isFetching && !isLoading}>
            <AddIconButton onClick={() => handleShowModal()} />
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
