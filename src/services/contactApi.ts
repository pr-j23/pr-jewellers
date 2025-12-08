import axios from 'axios';
import type { AxiosError } from 'axios';
import { shopEmailId } from '../mockData';

// Vite uses import.meta.env instead of process.env
const MAILGUN_API_KEY = import.meta.env.VITE_MAILGUN_API_KEY;
const MAILGUN_DOMAIN_NAME = import.meta.env.VITE_MAILGUN_DOMAIN_NAME;
const MAILGUN_SENDING_MAIL = import.meta.env.VITE_MAILGUN_SENDING_MAIL;

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export const sendMessage = async (formData: ContactFormData) => {
  try {
    const response = await axios.post(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN_NAME}/messages`,
      new URLSearchParams({
        from: MAILGUN_SENDING_MAIL,
        to: shopEmailId,
        subject: 'Contact Form Submission',
        text: formData.message,
        'reply-to': formData.email,
      }).toString(),
      {
        auth: {
          username: 'api',
          password: MAILGUN_API_KEY,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const fallbackMessage =
      axiosError.response?.data?.message || axiosError.message || 'Unable to send message';
    throw new Error(fallbackMessage);
  }
};
