const API_URL = process.env.NODE_ENV === 'development'
  ? 'http:/tapscoffe/api'
  : 'https://your-production-url.com/api';

export const config = {
  API_URL,
  DEFAULT_PAGE_SIZE: 10,
};