'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';  
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import ProductModal from '../../_components/ProductModal';  // Modal bileşenini ekliyoruz
import { deleteProduct } from '../../../services/productService'; // Silme fonksiyonunu ekliyoruz
import { notifySuccess, notifyError } from '../../../utils/notify'; // Toast bildirimleri

const ProductClient = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modalın açık/kapalı durumu
  const [updatedProducts, setUpdatedProducts] = useState(products);  // Güncellenmiş ürün listesi

  const handleNewProductClick = () => {
    setIsModalOpen(true);  // Modal açılıyor
  };

  const handleProductAdd = (newProduct) => {
    setUpdatedProducts((prevProducts) => [...prevProducts, newProduct]);  // Yeni ürün listeye ekleniyor
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Modal kapanıyor
  };

  // Ürün silme işlemi
  const handleProductDelete = async (productId) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const result = await deleteProduct(productId); // Ürünü silme işlemi
        if (result && result.success) {
          setUpdatedProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          );
          notifySuccess("Ürün başarıyla silindi!");
        } else {
          notifyError("Ürün silinemedi!");
        }
      } catch (error) {
        notifyError("Bir hata oluştu, ürün silinemedi!");
      }
    }
  };

  return (
    <div>
      <div className="mt-4">
        <div className="mt-6 flex justify-between">
          <h1 className="text-2xl font-bold">Ürünler</h1>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none"
            onClick={handleNewProductClick}  // Yeni ürün ekleme butonuna tıklayınca modal açılıyor
          >
            <FaPlus /> {/* + İkonu */}
          </button>
        </div>
        <div className="mt-6">
          <div className="bg-white shadow rounded-md overflow-hidden my-6">
            <table className="text-left w-full border-collapse">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">Ürün Adı</th>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">Fiyat</th>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">Tür</th>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">Açıklama</th>
                  <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {updatedProducts.map((product, index) => (
                  <tr key={product.id|| index} className="hover:bg-gray-200">
                    <td className="py-4 px-6 border-b text-gray-700 text-lg">{product.name}</td>
                    <td className="py-4 px-6 border-b text-gray-500">{product.price} TL</td>
                    <td className="py-4 px-6 border-b text-gray-500">{product.type}</td>
                    <td className="py-4 px-6 border-b text-gray-500">{product.description}</td>
                    <td className="py-4 px-6 border-b text-right">
                      <div className="flex justify-end space-x-4">
                        {/* Edit Butonu */}
                        <Link href={`/products/${product.id}`} >
                          <div
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Edit"
                          >
                            <FaEdit />
                          </div>
                        </Link>
                        
                        {/* Delete Butonu */}
                        <button
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                          title="Delete"
                          onClick={() => handleProductDelete(product.id)} // Silme işlemi
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

      {/* Ürün Ekleme Modali */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProductAdd={handleProductAdd}  // Ürün eklendiğinde listeye eklemek için
      />

      {/* ToastContainer */}
      <ToastContainer />
    </div>
  );
};

export default ProductClient;
