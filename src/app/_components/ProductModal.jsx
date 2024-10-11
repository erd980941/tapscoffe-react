'use client';
import React, { useState, useEffect } from 'react';

import { addProduct } from '../../services/productService';  // Ürün ekleme fonksiyonu
import { notifySuccess, notifyError } from '../../utils/notify';  // Toast mesajları

const ProductModal = ({ isOpen, onClose, onProductAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('drink');  // Varsayılan olarak 'drink' seçili
  const [description, setDescription] = useState('');
  useEffect(()=>{
    if(isOpen){
      setName('');
      setPrice('');
      setType('drink');
      setDescription('');
    }
  },[isOpen]);
  
  if (!isOpen) return null;
  

  const handleSave = async () => {
    const newProduct = { name, price, type, description };
    try {
      const result = await addProduct(newProduct);

      if (result && result.success) {
        notifySuccess('Ürün başarıyla eklendi!');
        onProductAdd(result.data);  // Yeni ürünü listeye ekle
        onClose();  // Modal'ı kapat
      } else {
        notifyError('Ürün eklenemedi.');
      }
    } catch (error) {
      notifyError('Bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl mb-4">Yeni Ürün Ekle</h2>
        <form>
          {/* Ürün Adı */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Ürün Adı</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          {/* Fiyat */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Fiyat</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Tür */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Ürün Türü</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="drink">İçecek</option>
              <option value="food">Yiyecek</option>
            </select>
          </div>

          {/* Açıklama */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            ></textarea>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              Kaydet
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
