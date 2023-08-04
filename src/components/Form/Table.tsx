import { RiArrowDownSFill, RiArrowUpSFill, RiSubtractLine } from 'react-icons/ri';

import {
  Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Flex, Text, Skeleton, Icon,
} from '@chakra-ui/react';
import {
  useReactTable,
  flexRender,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

import { FirstPageGhostIconButton } from '~/components/IconButton/FirstPageGhostIconButton';
import { LastPageGhostIconButton } from '~/components/IconButton/LastPageGhostIconButton';
import { NextPageGhostIconButton } from '~/components/IconButton/NextPageGhostIconButton';
import { PreviousPageGhostIconButton } from '~/components/IconButton/PreviousPageGhostIconButton';
import IEntityBase from '~/models/Entity/Base/IEntityBase';

export type ITableProps<T extends IEntityBase> = {
  columns: ColumnDef<T>[];
  data?: T[];
  isLoading?: boolean;
  onRowClick?: (data: T) => void;
};

const emptyArray: never[] = [];

export function Table<T extends IEntityBase>({
  columns, data = emptyArray, isLoading, onRowClick,
}: ITableProps<T>) {
  const totalRecords = data.length || 0;

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
  });

  return (
    <>
      <ChakraTable size="sm" variant="striped" colorScheme="blue">
        <Thead>
          {getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} colSpan={header.colSpan} textTransform="none">
                  <Flex
                    align="center"
                    cursor={header.column.getCanSort() ? 'pointer' : 'inherit'}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {
                      {
                        asc: <Icon as={RiArrowUpSFill} aria-label="sorted ascending" />,
                        desc: <Icon as={RiArrowDownSFill} aria-label="sorted descending" />,
                      }[header.column.getIsSorted() as string]
                    }
                    {!header.column.getIsSorted() && header.column.getCanSort() && (
                      <Icon as={RiSubtractLine} aria-label="sorted ascending" />
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {isLoading
            && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
              <Tr key={index}>
                {columns.map((column, columnIndex) => (
                  <Td
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${columnIndex}-${index}`}
                  >
                    <Skeleton height="16px" />
                  </Td>
                ))}
              </Tr>
            ))}
          {getRowModel().rows.map((row) => (
            <Tr
              key={row.id}
              {...(onRowClick && {
                onClick: () => onRowClick(row.original),
                transition: 'background-color 0.3s ease-in-out',
                _hover: {
                  cursor: 'pointer',
                },
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>

      {totalRecords > 0 ? (
        <Flex mt="4" align="center" direction={['column', 'row']} gap={['3', '0']}>
          <Text mr={['inherit', 'auto']} color="gray.500">{`Total de ${totalRecords} registros`}</Text>
          <Flex gap="1" align="center">
            <FirstPageGhostIconButton onClick={() => setPageIndex(0)} isDisabled={!getCanPreviousPage()} />
            <PreviousPageGhostIconButton onClick={() => previousPage()} isDisabled={!getCanPreviousPage()} />
            <NextPageGhostIconButton onClick={() => nextPage()} isDisabled={!getCanNextPage()} />
            <LastPageGhostIconButton onClick={() => setPageIndex(getPageCount() - 1)} isDisabled={!getCanNextPage()} />
          </Flex>
        </Flex>
      ) : (
        !isLoading && (
          <Flex mt="8" justifyContent="center" align="center" borderBottomWidth={1} borderColor="gray.50">
            <Text mb="8">Nenhum Registro Encontrado</Text>
          </Flex>
        )
      )}
    </>
  );
}
