'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';  // FaPlus ikonunu ekliyoruz
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableModal from '../../_components/TableModal';

const TableClient = ({ tables }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [updatedTables, setUpdatedTables] = useState(tables); // Güncellenmiş tablo listesi
  const [isNewTable, setIsNewTable] = useState(false);  // Yeni tablo eklenip eklenmediğini izlemek için

  const handleEditClick = (table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
    setIsNewTable(false);  // Bu bir güncelleme
  };

  const handleNewTableClick = () => {
    setSelectedTable({ id: null, name: '', status: 'available' });  // Yeni tablo oluşturma
    setIsModalOpen(true);
    setIsNewTable(true);  // Bu bir yeni tablo ekleme işlemi
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTableUpdate = (updatedTable) => {
    if (isNewTable) {
      // Yeni tablo eklerken
      setUpdatedTables((prevTables) => [...prevTables, updatedTable]);
    } else {
      // Var olan tabloyu güncellerken
      setUpdatedTables((prevTables) =>
        prevTables.map((table) =>
          table.id === updatedTable.id ? updatedTable : table
        )
      );
    }
  };

  return (
    <div>
      <div className="mt-4">
        <div className="mt-6 flex justify-between">
          <h1 className="text-2xl font-bold">Tablolar</h1>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none"
            onClick={handleNewTableClick}
          >
            <FaPlus /> {/* + İkonu */}
          </button>
        </div>
        <div className="mt-6">
          <div className="bg-white shadow rounded-md overflow-hidden my-6">
            <table className="text-left w-full border-collapse">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">Tablo Adı</th>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">Statü</th>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {updatedTables.map((table) => (
                  <tr key={table.id} className="hover:bg-gray-200">
                    <td className="py-4 px-6 border-b text-gray-700 text-lg">{table.name}</td>
                    <td className="py-4 px-6 border-b text-gray-500">{table.status}</td>
                    <td className="py-4 px-6 border-b text-right">
                      <div className="flex justify-end space-x-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Edit"
                          onClick={() => handleEditClick(table)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedTable && (
        <TableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          table={selectedTable}
          onUpdate={handleTableUpdate} // Modal'dan güncellenen tabloyu al
        />
      )}
      
      {/* ToastContainer */}
      <ToastContainer />
    </div>
  );
};

export default TableClient;
