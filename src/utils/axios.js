import axios from 'axios';
import { API_CONFIG } from '../services/apiConfig';

const api = axios.create({
  baseURL: API_CONFIG.hostUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  async error => {
    throw error;
  }
);

const handleResponse = response => response.data;

const handleError = error => {
  throw error.response ? error.response.data : error;
};
export const getAPI = async (url, options = {}) => {
  try {
    const response = await api.get(url, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const postAPI = async (url, data, options = {}) => {
  try {
    const response = await api.post(url, data, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const putAPI = async (url, data, options = {}) => {
  try {
    const response = await api.put(url, data, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteAPI = async (url, data, options = {}) => {
  try {
    const response = await api.delete(url, data, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
