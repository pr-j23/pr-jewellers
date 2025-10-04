import axios from 'axios';
import { shopEmailId } from '../mockData';

// Vite uses import.meta.env instead of process.env
const MAILGUN_API_KEY = import.meta.env.VITE_MAILGUN_API_KEY;
const MAILGUN_DOMAIN_NAME = import.meta.env.VITE_MAILGUN_DOMAIN_NAME;
const MAILGUN_SENDING_MAIL = import.meta.env.VITE_MAILGUN_SENDING_MAIL;

export const sendMessage = async formData => {
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
    throw new Error(error.response?.data || error.message);
  }
};
