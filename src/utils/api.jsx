"use server"; 
import { config } from '../config';

export const apiFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    ...options,
  };

  try {
    const fullUrl = `${config.API_URL}${url}`;
    const response = await fetch(fullUrl, defaultOptions);
    if (!response.ok) {
      throw new Error(`API isteğinde hata oluştu: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Fetch Hatası:', error);
    return null;
  }
};

// GET request
export const get = (url) => apiFetch(url,{
  methot: 'GET'
});

// POST request
export const post = (url, data) => apiFetch(url, {
  method: 'POST',
  body: JSON.stringify(data),
});

// PUT request
export const put = (url, data) => apiFetch(url, {
  method: 'PUT',
  body: JSON.stringify(data),
});

// DELETE request
export const del = (url) => apiFetch(url, {
  method: 'DELETE',
});
