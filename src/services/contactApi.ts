import axios from 'axios';
import type { AxiosError } from 'axios';
import { API_CONFIG } from './apiConfig';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export const sendMessage = async (formData: ContactFormData) => {
  try {
    const response = await axios.post(`${API_CONFIG.hostUrl}/contact`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const fallbackMessage =
      axiosError.response?.data?.message || axiosError.message || 'Unable to send message';
    throw new Error(fallbackMessage);
  }
};
