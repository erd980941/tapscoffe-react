import { getTables } from '../../../services/tableService';
import TableClient from './TableClient';

const TablesPage = async () => {
  const tables = await getTables(); 

  return (
    <div>
      <TableClient tables={tables} />
    </div>
  );
};

export default TablesPage;
