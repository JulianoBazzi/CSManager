import { Table as ChakraTable, Flex, Icon, Skeleton, Text, useBreakpointValue } from '@chakra-ui/react';
import {
  type ColumnDef,
  type ColumnSort,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { RiArrowDownSFill, RiArrowUpSFill, RiSubtractLine } from 'react-icons/ri';

import { FirstPageGhostIconButton } from '~/components/IconButton/FirstPageGhostIconButton';
import { LastPageGhostIconButton } from '~/components/IconButton/LastPageGhostIconButton';
import { NextPageGhostIconButton } from '~/components/IconButton/NextPageGhostIconButton';
import { PreviousPageGhostIconButton } from '~/components/IconButton/PreviousPageGhostIconButton';
import type IEntityBase from '~/models/Entity/Base/IEntityBase';

export type ITableProps<T extends IEntityBase> = {
  columns: ColumnDef<T>[];
  orderBy?: ColumnSort;
  data?: T[];
  perPage?: number;
  loading?: boolean;
  columnVisibility?: VisibilityState;
  onRowClick?: (data: T) => void;
  isRowSelected?: (data: T) => boolean;
};

const emptyArray: never[] = [];

export function Table<T extends IEntityBase>({
  columns,
  orderBy = { id: 'id', desc: true },
  data = emptyArray,
  perPage = 10,
  loading,
  columnVisibility,
  onRowClick,
  isRowSelected,
}: ITableProps<T>) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const totalRecords = data.length || 0;

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: perPage,
  });

  const [sorting, setSorting] = useState<SortingState>([orderBy]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const {
    getRowModel,
    getHeaderGroups,
    getPageCount,
    setPageIndex,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage,
  } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
  });

  const table = () => (
    <ChakraTable.Root size="sm" striped colorPalette="gray">
      <ChakraTable.Header>
        {getHeaderGroups().map(headerGroup => (
          <ChakraTable.Row key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <ChakraTable.ColumnHeader key={header.id} colSpan={header.colSpan} textTransform="none">
                <Flex
                  align="center"
                  cursor={header.column.getCanSort() ? 'pointer' : 'inherit'}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {
                    {
                      asc: (
                        <Icon aria-label="sorted ascending">
                          <RiArrowUpSFill />
                        </Icon>
                      ),
                      desc: (
                        <Icon aria-label="sorted descending">
                          <RiArrowDownSFill />
                        </Icon>
                      ),
                    }[header.column.getIsSorted() as string]
                  }
                  {!header.column.getIsSorted() && header.column.getCanSort() && (
                    <Icon aria-label="sortable">
                      <RiSubtractLine />
                    </Icon>
                  )}
                </Flex>
              </ChakraTable.ColumnHeader>
            ))}
          </ChakraTable.Row>
        ))}
      </ChakraTable.Header>
      <ChakraTable.Body>
        {loading &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
            <ChakraTable.Row key={index}>
              {columns.map((_, columnIndex) => (
                <ChakraTable.Cell key={`${columnIndex}-${index}`}>
                  <Skeleton height="16px" />
                </ChakraTable.Cell>
              ))}
            </ChakraTable.Row>
          ))}
        {getRowModel().rows.map(row => {
          const selected = isRowSelected?.(row.original);
          return (
            <ChakraTable.Row
              key={row.id}
              transition="background-color 0.2s ease-in-out"
              css={{
                ...(selected && {
                  '& td': { backgroundColor: 'var(--chakra-colors-blue-900) !important' },
                  '& td:first-of-type': { boxShadow: 'inset 3px 0 0 var(--chakra-colors-blue-400)' },
                }),
                ...(onRowClick && {
                  cursor: 'pointer',
                  '&:hover td': {
                    backgroundColor: `var(--chakra-colors-${selected ? 'blue-800' : 'gray-700'}) !important`,
                  },
                }),
              }}
            >
              {row.getVisibleCells().map(cell => (
                <ChakraTable.Cell
                  key={cell.id}
                  {...(onRowClick &&
                    cell.column.id !== 'actions' && {
                      onClick: () => onRowClick(row.original),
                    })}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </ChakraTable.Cell>
              ))}
            </ChakraTable.Row>
          );
        })}
      </ChakraTable.Body>
    </ChakraTable.Root>
  );

  return (
    <>
      {isMobile ? <ChakraTable.ScrollArea>{table()}</ChakraTable.ScrollArea> : table()}

      {totalRecords > 0 ? (
        <Flex mt="4" align="center" direction={['column', 'row']} gap={['3', '0']}>
          <Text mr={['inherit', 'auto']} color="gray.200">{`Total de ${totalRecords} registros`}</Text>
          <Flex gap="1" align="center">
            <FirstPageGhostIconButton onClick={() => setPageIndex(0)} disabled={!getCanPreviousPage()} />
            <PreviousPageGhostIconButton onClick={() => previousPage()} disabled={!getCanPreviousPage()} />
            <NextPageGhostIconButton onClick={() => nextPage()} disabled={!getCanNextPage()} />
            <LastPageGhostIconButton onClick={() => setPageIndex(getPageCount() - 1)} disabled={!getCanNextPage()} />
          </Flex>
        </Flex>
      ) : (
        !loading && (
          <Flex mt="8" justifyContent="center" align="center" borderBottomWidth={1} borderColor="gray.50">
            <Text mb="8">Nenhum Registro Encontrado</Text>
          </Flex>
        )
      )}
    </>
  );
}
