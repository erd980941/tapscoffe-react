import { get, put, del, post } from '../utils/api';

export const getProducts = async () => {
    const response = await get('/products');
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Veri bulunamadı veya geçersiz response");
      return [];
    }
  };

export const getProductById = async (id) => {
  const response = await get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, updatedData) => {
  try {
    const response = await put(`/products/${id}`, updatedData);
    return response;
  } catch (error) {
    console.error("Güncellenemedi", error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await del(`/products/${id}`);
    return response;
  } catch (error) {
    console.error("Silinemedi", error);
  }
};

export const addProduct = async (newProductData) => {
  const response = await post('/products', newProductData);
  return response;
};
