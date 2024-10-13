'use client';
import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import { notifySuccess, notifyError } from '../../utils/notify';

const OrderProductModal = ({ isOpen, onClose, tableId, onOrderSubmit, activeOrder }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();

      // Eğer active_order mevcutsa, sipariş kalemlerini seçili ürünler listesine ekleyelim
      if (activeOrder && activeOrder.order_items) {
        const initialSelectedProducts = activeOrder.order_items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          isExisting: true,  // Bu flag ile mevcut ürünleri yeşil renkte gösteririz
        }));
        setSelectedProducts(initialSelectedProducts);
      } else {
        // Eğer active_order yoksa, yeni bir sipariş için ürünleri temizle
        setSelectedProducts([]);
      }
    }
  }, [isOpen, activeOrder]);

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      setProducts(result);
    } catch (error) {
      notifyError('Bir hata oluştu.');
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProducts((prevSelected) => {
      const existingSelectedProduct = prevSelected.find((p) => p.product_id === product.id && p.isExisting === true);
      const newSelectedProduct = prevSelected.find((p) => p.product_id === product.id && p.isExisting === false);

      if (newSelectedProduct) {
        // Eğer yeni eklenen (mavi) ürün zaten varsa, miktarını artırıyoruz
        return prevSelected.map((p) =>
          p.product_id === product.id && p.isExisting === false
            ? {
              ...p,
              quantity: p.quantity + 1,
              price: (p.quantity + 1) * product.price,
            }
            : p
        );
      } else if (existingSelectedProduct) {
        // Eğer sipariş verilmiş (yeşil) ürün varsa, yeni bir tane daha ekliyoruz (mavi renkte)
        return [
          ...prevSelected,
          {
            product_id: product.id,
            quantity: 1,
            price: product.price,
            isExisting: false,  // Yeni eklenen ürün mavi olacak
          },
        ];
      } else {
        // Eğer ürün listede yoksa, yeni ürün olarak ekliyoruz
        return [
          ...prevSelected,
          {
            product_id: product.id,
            quantity: 1,
            price: product.price,
            isExisting: false,  // Yeni eklenen ürün mavi olacak
          },
        ];
      }
    });
  };

  const removeProductFromOrder = (productId) => {
    setSelectedProducts((prevSelected) => {
      const product = prevSelected.find((p) => p.product_id === productId);
      if (product.quantity > 1) {
        return prevSelected.map((p) =>
          p.product_id === productId
            ? {
              ...p,
              quantity: p.quantity - 1,
              price: (p.quantity - 1) * p.price / p.quantity,
            }
            : p
        );
      } else {
        return prevSelected.filter((p) => p.product_id !== productId);
      }
    });
  };

  const handleOrderSubmit = async () => {
    const newProducts = selectedProducts.filter(product => product.isExisting === false);

    if (newProducts.length === 0) {
      notifyError('Lütfen en az bir ürün seçiniz.');
      return;
    }

    const result = await onOrderSubmit(tableId, newProducts);

    setSelectedProducts(result.data.order_items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      isExisting: true  // Yeni eklenen tüm ürünler de artık mevcut (yeşil) olacaktır
    })));  // Modal kapatılınca seçili ürünleri temizle
    onClose();
  };

  const handleClose = () => {
    setSelectedProducts([]);  // Modal kapatılırken ürünleri temizle
    onClose();  // Modalı kapat
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-4xl m-auto flex-col flex rounded-lg">
        <span className="absolute top-0 right-0 p-4">
          <button onClick={handleClose}>X</button>
        </span>
        <h2 className="text-2xl mb-4">Sipariş Ver</h2>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 bg-gray-100 hover:bg-blue-100 cursor-pointer">
                <button className="w-full" onClick={() => handleProductSelect(product)}>
                  <div className="text-lg font-semibold">{product.name}</div>
                  <div className="text-gray-600">{product.price} TL</div>
                </button>
              </div>
            ))
          ) : (
            <p>Yükleniyor...</p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-xl mb-2">Seçilen Ürünler</h3>
          <div className="flex flex-wrap gap-4">
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <div key={`${product.product_id}-${product.isExisting}-${index}`} className={`border rounded-lg p-4 flex items-center justify-between w-full ${product.isExisting ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <div>
                    <div className="text-lg font-semibold">Ürün ID: {product.product_id}</div>
                    <div className="text-gray-600">Adet: {product.quantity}</div>
                    <div className="text-gray-600">Toplam Fiyat: {product.price} TL</div>
                  </div>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-4" onClick={() => removeProductFromOrder(product.product_id)}>
                    {product.quantity > 1 ? 'Adet azalt' : 'X'}
                  </button>
                </div>
              ))
            ) : (
              <p>Henüz ürün seçilmedi.</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handleOrderSubmit}>
            Sipariş Ver
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderProductModal;
