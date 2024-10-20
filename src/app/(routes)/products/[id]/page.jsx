'use client'
import React, { useState, useEffect } from 'react';
import { getProductById, updateProduct } from '../../../../services/productService'; // Ürün veri çekme ve güncelleme fonksiyonları
import { notifySuccess, notifyError } from '../../../../utils/notify'; 
import { ToastContainer } from 'react-toastify';

const ProductDetails = ({ params }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);  // Yüklenme durumu için state ekliyoruz

  useEffect(() => {
    // Sayfa yüklendiğinde id'ye göre ürünü çekiyoruz
    const fetchProduct = async () => {
      try {
        setLoading(true); // Veri çekme işlemi başlamadan önce loading'i true yap
        const result = await getProductById(params.id);
        if (result) {
          setName(result.name);
          setPrice(result.price);
          setType(result.type);
          setDescription(result.description || '');
        } else {
          notifyError('Ürün verisi alınamadı');
        }
      } catch (error) {
        notifyError('Bir hata oluştu');
      } finally {
        setLoading(false); // Veri çekme işlemi bittiğinde loading'i false yap
      }
    };

    fetchProduct();
  }, [params.id]);

  // Güncelleme işlemi
  const handleSave = async () => {
    const updatedProduct = { name, price, type, description };

    try {
      const result = await updateProduct(params.id, updatedProduct);
      if (result && result.success) {
        notifySuccess(result.message);
      } else {
        notifyError('Ürün güncellenemedi');
      }
    } catch (error) {
      notifyError('Bir hata oluştu');
    }
  };

  if (loading) {
    // Eğer veriler yükleniyorsa loading mesajı göster
    return <div>Veriler yükleniyor...</div>;
  }

  // Veriler yüklendikten sonra formu göster
  return (
    <div>
      <h1 className="text-2xl mb-4">Ürün Düzenle - {name}</h1>
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

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Kaydet
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
