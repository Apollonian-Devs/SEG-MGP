import api from '../api';
import { ACCESS_TOKEN } from '../constants';

/**
 * API Utility Functions - Helper functions for making authenticated API requests.
 *
 * @function getWithAuth
 * @description Sends a GET request with an Authorization header containing the access token.
 * @param {string} url - The API endpoint to send the request to.
 * @param {object} [config={}] - Optional configuration object for additional request settings.
 * @returns {Promise} - The response from the API.
 *
 * @function postWithAuth
 * @description Sends a POST request with an Authorization header containing the access token.
 * @param {string} url - The API endpoint to send the request to.
 * @param {object} data - The data to be sent in the request body.
 * @param {object} [config={}] - Optional configuration object for additional request settings.
 * @returns {Promise} - The response from the API.
 */


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
  
