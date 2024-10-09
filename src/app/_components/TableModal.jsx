'use client';
import React, { useState, useEffect } from 'react';
import { updateTable, addTable } from '../../services/tableService'; // Yeni tablo ekleme fonksiyonu
import { notifySuccess, notifyError } from '../../utils/notify';

const TableModal = ({ isOpen, onClose, table, onUpdate }) => {
  const [tableName, setTableName] = useState(table.name);
  useEffect(() => {
    if (isOpen && table) {
      // Modal açıldığında, table.name değerini state'e set et
      setTableName(table.name || ''); 
    }
  }, [isOpen, table]);

  const isNewTable = table.id === null; // Yeni tablo olup olmadığını kontrol ediyoruz

  if (!isOpen) return null;

  const handleSave = async () => {
    const updatedTable = { name: tableName };

    try {
      let result;
      if (isNewTable) {
        // Yeni tablo ekliyoruz
        result = await addTable(updatedTable);
      } else {
        // Mevcut tabloyu güncelliyoruz
        result = await updateTable(table.id, updatedTable);
      }

      if (result && result.success) {
        console.log(result.daa);
        onUpdate({ ...table, ...result.data });
        notifySuccess(result.message);
        onClose();  // Modal'ı kapat
      } else {
        notifyError(result.message || 'Tablo güncellenemedi!');
      }
    } catch (error) {
      notifyError('İşlem sırasında bir hata oluştu.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-1/2">
          <h2 className="text-2xl mb-4">{isNewTable ? "Yeni Tablo Ekle" : `Table Details - ${table.name}`}</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Table Name</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TableModal;
