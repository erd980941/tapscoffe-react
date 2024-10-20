import { get, put, del, post } from '../utils/api';

export const getOrders = async () => {
    const response = await get('/orders');
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Veri bulunamadı veya geçersiz response");
      return [];
    }
  };

export const getOrdersById = async (id) => {
  const response = await get(`/orders/${id}`);
  return response.data;
};

export const updateOrders = async (id, updatedData) => {
  try {
    const response = await put(`/orders/${id}`, updatedData);
    return response;
  } catch (error) {
    console.error("Güncellenemedi", error);
  }
};

export const deleteOrders = async (id) => {
  try {
    const response = await del(`/orders/${id}`);
    return response;
  } catch (error) {
    console.error("Silinemedi", error);
  }
};

export const addOrders = async (newOrdersData) => {
  const response = await post('/orders', newOrdersData);
  return response;
};
export const updateTableStatus = async (tableId, status) => {
  try {
    const response = await put(`/tables/${tableId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Tablo durumu güncellenemedi", error);
    return { success: false, message: "Tablo güncellenemedi." };
  }
};