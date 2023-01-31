import { forwardRef, ForwardRefRenderFunction, useState } from 'react';

import { Table as ChakraTable, TableContainer, Thead, Tr, Th, Tbody, Td, Skeleton, Text, Flex } from '@chakra-ui/react';

import { FirstPageGhostIconButton } from '~/components/IconButton/FirstPageGhostIconButton';
import { LastPageGhostIconButton } from '~/components/IconButton/LastPageGhostIconButton';
import { NextPageGhostIconButton } from '~/components/IconButton/NextPageGhostIconButton';
import { PreviousPageGhostIconButton } from '~/components/IconButton/PreviousPageGhostIconButton';
import ITableColumn from '~/models/ITableColumn';
import getProperty from '~/utils/getProperty';

interface ITableProps<T> {
  data?: T[];
  columns: ITableColumn[];
  isLoading?: boolean;
}

const emptyArray: never[] = [];

const TableBase: ForwardRefRenderFunction<HTMLTableElement, ITableProps<any>> = (
  { data, columns, isLoading }: ITableProps<any>,
  ref
) => {
  const dataFiltered = data || emptyArray;
  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = dataFiltered.length || 0;
  const totalPages = Math.ceil(totalRecords / 10);
  const startRecordNumber = currentPage > 1 ? (currentPage - 1) * 10 + 1 : 1;
  const endRecordNumber = totalRecords > currentPage * 10 ? currentPage * 10 : totalRecords;

  return (
    <>
      <TableContainer>
        <ChakraTable size="sm" variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.field}>{column.header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading &&
              [0, 1, 2, 3, 4, 5].map((index) => (
                <Tr key={index}>
                  {columns.map((column) => (
                    <Td key={`${String(column.field)}-${index}`}>
                      <Skeleton height="20px" />
                    </Td>
                  ))}
                </Tr>
              ))}
            {totalRecords > 0 &&
              data?.map((item) => (
                <Tr key={item.id}>
                  {columns.map((column) => (
                    <Td>{getProperty(item, column.field)}</Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </ChakraTable>
      </TableContainer>
      {totalRecords > 0 ? (
        <Flex mt="8" align="center" direction={['column', 'row']} gap={['3', '0']}>
          <Text mr={['inherit', 'auto']}>
            {`Mostrando ${startRecordNumber} até ${endRecordNumber} registros de ${totalRecords} registros`}
          </Text>
          <Flex gap="1" align="center">
            <FirstPageGhostIconButton onClick={() => setCurrentPage(1)} isDisabled={currentPage === 1} />
            <PreviousPageGhostIconButton
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
            />
            <NextPageGhostIconButton
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            />
            <LastPageGhostIconButton
              onClick={() => setCurrentPage(totalPages)}
              isDisabled={currentPage === totalPages}
            />
          </Flex>
        </Flex>
      ) : (
        !isLoading && (
          <Flex mt="8" justifyContent="center" align="center" borderBottomWidth={1} borderColor="blue.700">
            <Text mb="8">Nenhum Registro Encontrado</Text>
          </Flex>
        )
      )}
    </>
  );
};

export const Table = forwardRef(TableBase);
