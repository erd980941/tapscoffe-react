import { config } from '../config';

export const fetchTableData = async () => {
  try {
    const response = await fetch(`${config.API_URL}/tables`);
    if (!response.ok) throw new Error('Veri getirilemedi');
    return await response.json();
  } catch (error) {
    console.error('API Hatası:', error);
    return [];
  }
};