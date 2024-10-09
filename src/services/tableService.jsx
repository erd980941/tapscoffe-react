import { get, put, del, post } from '../utils/api';

export const getTables = async () => {
    const response = await get('/tables');
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Veri bulunamadı veya geçersiz response");
      return [];
    }
  };

export const getTableById = async (id) => {
  const response= await get(`/tables/${id}`);
  return  response.data;
};

export const updateTable = async (id, updatedData) => {
  try {
    const response = await put(`/tables/${id}`, updatedData);
    return response;
  } catch (error) {
    console.error("Güncellenemedi", error);
  }
};

export const deleteTable = async (id) =>{
  try{
    const response = await del(`/tables/${id}`);
    return response;
  } catch (error) {
    console.error("Silinemedi", error);
  }
}

export const addTable = async (newTableData) => {
    const response = await post('/tables', newTableData);
    return response;
};