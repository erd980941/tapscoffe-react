import React from 'react';
import { getTables } from '../../../services/tableService';
import Image from 'next/image';

const MenuPage = async () => {
  const tables = await getTables();

  return (
    <div className="flex flex-wrap justify-around gap-4">
  
      {tables && tables.length > 0 ? (
        tables.map((table) => (
          <div
            key={table.id}
            className="w-64 h-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center"
          >
            <div className="p-6 text-center">
              <a href="#">
                <h5 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Masa <br /> 01
                </h5>
              </a>
            </div>
          </div>
        ))
      ) : (
        <li>Veri bulunamadı</li>
      )}
    </div>
  );
  
  


};

export default MenuPage;
