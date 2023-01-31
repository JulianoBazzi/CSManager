import { ReactNode } from 'react';

interface ITableColumn {
  header: string;
  field: string;
  children?: ReactNode;
}

export default ITableColumn;
