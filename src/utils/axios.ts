import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
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

const handleResponse = <T>(response: AxiosResponse<T>) => response.data;

const handleError = (error: any) => {
  throw error?.response ? error.response.data : error;
};

export const getAPI = async <T>(url: string, options: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await api.get<T>(url, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const postAPI = async <T>(
  url: string,
  data: unknown,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const putAPI = async <T>(
  url: string,
  data: unknown,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, options);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteAPI = async <T>(
  url: string,
  data: unknown = undefined,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await api.delete<T>(url, { ...options, data });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
