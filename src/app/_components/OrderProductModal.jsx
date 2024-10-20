'use client';
import React, { useState, useEffect, act } from 'react';
import { getProducts } from '../../services/productService';
import { notifySuccess, notifyError } from '../../utils/notify';
import { deleteOrderItems } from '../../services/orderItemService';
import { addOrders, updateOrders, deleteOrders } from '../../services/orderService';

const OrderProductModal = ({ isOpen, onClose, tableId, onOrderSubmit, activeOrder, removeOrderItemsMenuClient }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderItems, setOrderItems] = useState(activeOrder?.order_items || []);
  useEffect(() => {
    if (isOpen) {
      fetchProducts();

      if (activeOrder && activeOrder.order_items) {
        setOrderItems(activeOrder.order_items);
      } else {
        setOrderItems([]); // Eğer activeOrder yoksa, ürünleri temizle
      }
    }
  }, [isOpen, activeOrder]);

  if (!isOpen) return null;

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
      const existingSelectedProduct = prevSelected.find((p) => p.id === product.id);
      if (existingSelectedProduct) {
        return prevSelected.map((p) =>
          p.id === product.id
            ? {
              ...p,
              quantity: p.quantity + 1,
              price: (p.quantity + 1) * product.price,
            }
            : p
        );
      } else {
        return [
          ...prevSelected,
          {
            id: product.id,
            quantity: 1,
            price: product.price,
            type: product.type,
            description: product.description
          },
        ];
      }

    });
  };

  const removeProductFromSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) => {
      const product = prevSelected.find((p) => p.id === productId);
      if (product.quantity > 1) {
        return prevSelected.map((p) =>
          p.id === productId
            ? {
              ...p,
              quantity: p.quantity - 1,
              price: (p.quantity - 1) * p.price / p.quantity,
            }
            : p
        );
      } else {
        return prevSelected.filter((p) => p.id !== productId);
      }
    });
  };

  const removeOrderItems = async (orderItemId) => {
    if (confirm("Bu siparişi silmek istediğinizden emin misiniz?")) {
      const result = await deleteOrderItems(orderItemId);
      if (result.success) {
        notifySuccess(result.message);
  
        // Mevcut orderItems durumunu alın
        const currentOrderItems = [...orderItems]; // orderItems state'inden geliyor olmalı
  
        // Güncellenmiş öğeleri filtreleyin
        const updatedItems = currentOrderItems.filter(
          (orderItem) => orderItem.id !== orderItemId
        );
  
        // Durumu güncelleyin
        setOrderItems(updatedItems);
  
        // Eğer güncellenmiş öğeler boşsa, siparişi silin
        if (updatedItems.length === 0) {
          const orderId = currentOrderItems[0]?.order_id;
          if (orderId) {
            const deleteResult = await deleteOrders(orderId);
            
          }
        }
  
        removeOrderItemsMenuClient(orderItemId);
      } else {
        notifyError(result.message);
      }
    }
  };

  const handleOrderSubmit = async () => {

    if (selectedProducts.length === 0) {
      notifyError('Lütfen en az bir ürün seçiniz.');
      return;
    }

    const orderItems = selectedProducts.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: product.price
    }));
    await onOrderSubmit(tableId, orderItems);
    setSelectedProducts([]);
  };

  const handleClose = () => {
    setSelectedProducts([]);  // Modal kapatılırken ürünleri temizle
    onClose();  // Modalı kapat
  };



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
                <div key={`${product.id}-${index}`} className="border rounded-lg p-4 flex items-center justify-between w-full bg-green-100">
                  <div>
                    <div className="text-lg font-semibold">Ürün Adı: {product.name}</div>
                    <div className="text-gray-600">Adet: {product.quantity}</div>
                    <div className="text-gray-600">Toplam Fiyat: {product.price} TL</div>
                  </div>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-4" onClick={() => removeProductFromSelectProduct(product.id)}>
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>Henüz ürün seçilmedi.</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl mb-2">Siparişler</h3>
          <div className="flex flex-wrap gap-4">
            {orderItems.length > 0 ? (
              orderItems.map((orderItem, index) => (
                <div key={`${orderItem.product_id}-${index}`} className="border rounded-lg p-4 flex items-center justify-between w-full bg-blue-100">
                  <div>
                    <div className="text-lg font-semibold">Ürün Adı: {orderItem.product.name}</div>
                    <div className="text-gray-600">Adet: {orderItem.quantity}</div>
                    <div className="text-gray-600">Toplam Fiyat: {orderItem.price} TL</div>
                  </div>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-4" onClick={() => removeOrderItems(orderItem.id)}>
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>Henüz sipariş verilmedi.</p>
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
