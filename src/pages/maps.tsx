import { useEffect, useRef, useState } from 'react';

import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import removeAccents from 'remove-accents';

import { ActiveBadge } from '~/components/Badge/ActiveBadge';
import { MapBadge } from '~/components/Badge/MapBadge';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Table } from '~/components/Form/Table';
import { AddIconButton } from '~/components/IconButton/AddIconButton';
import { MapModal, MapModalHandle } from '~/components/Modal/MapModal';
import { SearchBar } from '~/components/SearchBar';
import Template from '~/components/Template';
import IMapAPI from '~/models/Entity/Map/IMapAPI';
import { useMaps } from '~/services/hooks/useMaps';
import supabase from '~/services/supabase';

interface IMapsProps extends GetServerSideProps {
  user: User;
}

const Maps: NextPage<IMapsProps> = ({ user }) => {
  const mapModalRef = useRef<MapModalHandle>(null);

  const { data, isLoading, isFetching } = useMaps(user.id);

  const [search, setSearch] = useState('');
  const [dataFiltered, setDataFiltered] = useState(data);

  useEffect(() => {
    setDataFiltered(
      data?.filter(
        (map) => removeAccents(map.name.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(map.format_short_game_type.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase()))
          || removeAccents(map.format_map_type.trim().toLowerCase()).includes(removeAccents(search.trim().toLowerCase())),
      ),
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
      enableSorting: false,
    },
    {
      accessorKey: 'format_map_type',
      header: 'Categoria',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
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
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => <ActiveBadge active={row.original.active} />,
    },
  ];

  return (
    <>
      <Head>
        <title>Mapas - CS Manager</title>
      </Head>
      <MapModal ref={mapModalRef} />
      <Template user={user}>
        <Card>
          <CardHeader title="Mapas" isFetching={isFetching && !isLoading}>
            <AddIconButton onClick={() => handleShowModal()} />
          </CardHeader>
          <CardBody>
            <SearchBar onSearch={(value) => setSearch(value)} isDisabled={isFetching} />
            <Table
              data={dataFiltered}
              columns={columns}
              isLoading={isLoading}
              onRowClick={({ id }) => handleShowModal(id)}
            />
          </CardBody>
        </Card>
      </Template>
    </>
  );
};

export default Maps;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { 'csm.token': token } = parseCookies(context);
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
