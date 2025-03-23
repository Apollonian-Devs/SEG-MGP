import api from '../api';
import { ACCESS_TOKEN } from '../constants';

export const getWithAuth = (url, config = {}) => {
  const access = localStorage.getItem(ACCESS_TOKEN);
  const headers = {
    Authorization: `Bearer ${access}`,
    ...config.headers,
  };
  return api.get(url, { ...config, headers });
};


export const postWithAuth = (url, data, config = {}) => {
    const access = localStorage.getItem(ACCESS_TOKEN);
    const headers = {
        Authorization: `Bearer ${access}`,
        ...config.headers,
    };
    return api.post(url, data, { ...config, headers });
};

  
