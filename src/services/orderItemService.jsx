import { get, put, del, post } from '../utils/api';

export const getOrderItems = async () => {
    const response = await get('/order-items');
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Veri bulunamadı veya geçersiz response");
      return [];
    }
  };

export const getOrderItemsById = async (id) => {
  const response = await get(`/order-items/${id}`);
  return response.data;
};

export const updateOrderItems = async (id, updatedData) => {
  try {
    const response = await put(`/order-items/${id}`, updatedData);
    return response;
  } catch (error) {
    console.error("Güncellenemedi", error);
  }
};

export const deleteOrderItems = async (id) => {
  try {
    const response = await del(`/order-items/${id}`);
    return response;
  } catch (error) {
    console.error("Silinemedi", error);
  }
};

export const addOrders = async (newOrdersData) => {
  const response = await post('/order-items', newOrdersData);
  return response;
};
