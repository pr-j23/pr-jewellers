import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircleMore, Phone } from 'lucide-react';
import { TbDeviceLandlinePhone } from 'react-icons/tb';
import { BRAND_INFO, MAP_CONFIG, SOCIAL_LINKS, STORE_CONTACT } from '../../utils/appConfig';

const Footer = () => {
  const handleMapClick = () => {
    window.open(MAP_CONFIG.storeLocationUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMailClick = () => {
    window.location.href = `mailto:${STORE_CONTACT.email}`;
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">{BRAND_INFO.name}</h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <MapPin className="w-7 mr-2 cursor-pointer" onClick={handleMapClick} />
                <span className="text-balance">{STORE_CONTACT.address}</span>
              </p>
              <p className="flex items-center">
                <TbDeviceLandlinePhone className="h-5 w-5 mr-2" />
                <span>{`Landline: ${STORE_CONTACT.landline}`}</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>{`Mobile: ${STORE_CONTACT.mobile}`}</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2 cursor-pointer" onClick={handleMailClick} />
                <span>{STORE_CONTACT.email}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Hours</h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{STORE_CONTACT.hours.weekDays}</span>
              </p>
              <p className="ml-7">{STORE_CONTACT.hours.weekend}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href={SOCIAL_LINKS.instagram}
                className="hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                className="hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={`https://wa.me/${STORE_CONTACT.whatsappNumber}`}
                className="hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircleMore className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {BRAND_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
