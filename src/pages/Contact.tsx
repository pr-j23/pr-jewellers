import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/shared/Button';
import { DEFAULT_MEDIA, STORE_CONTACT } from '../utils/appConfig';
import { sendMessage, type ContactFormData } from '../services/contactApi';

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500';

const defaultFormData: ContactFormData = {
  name: '',
  email: '',
  message: '',
};

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await sendMessage(formData);
      toast.success('Your message has been sent successfully!');
      setFormData(defaultFormData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-serif mb-6">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your message"
                rows={4}
                required
              />
            </div>
            <Button
              label={isSubmitting ? 'Sending...' : 'Send Message'}
              classN="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              buttonType="submit"
              isDisabled={isSubmitting}
            />
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-serif mb-6">Visit Our Store</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                <span>{STORE_CONTACT.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-600 mr-3" />
                <span>{STORE_CONTACT.mobile}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-600 mr-3" />
                <span>{STORE_CONTACT.email}</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                <div>
                  <p>{STORE_CONTACT.hours.weekDays}</p>
                  <p>{STORE_CONTACT.hours.weekend}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 h-64 rounded-lg overflow-hidden">
              <img
                src={DEFAULT_MEDIA.storeImage}
                alt="Store Location"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
