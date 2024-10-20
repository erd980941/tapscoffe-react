import { getTables } from '../../../services/tableService';
import MenuClient from './MenuClient'; // MenuClient istemci bileşeni

const MenuPage = async () => {
  const tables = await getTables();  // Sunucu tarafında async işlem
  return (
    <div>
      <MenuClient tables={tables} />  
    </div>
  );
};

export default MenuPage;
