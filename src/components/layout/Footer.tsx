import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircleMore, Phone } from 'lucide-react';
import { TbDeviceLandlinePhone } from 'react-icons/tb';
import {
  landlineNumber,
  mobileNumber,
  shopAddress,
  shopEmailId,
  shopOpenTime,
  whatAppNumber,
} from '../../mockData';

const Footer = () => {
  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/o8qayPeMpNYDTNZ49', '_blank', 'noopener,noreferrer');
  };

  const handleMailClick = () => {
    window.location.href = `mailto:${shopEmailId}`;
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Pavan Jewellers</h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <MapPin className="w-7 mr-2 cursor-pointer" onClick={handleMapClick} />
                <span className="text-balance">{shopAddress}</span>
              </p>
              <p className="flex items-center">
                <TbDeviceLandlinePhone className="h-5 w-5 mr-2" />
                <span>{landlineNumber}</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>{mobileNumber}</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2 cursor-pointer" onClick={handleMailClick} />
                <span>{shopEmailId}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Hours</h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{shopOpenTime.weekDays}</span>
              </p>
              <p className="ml-7">{shopOpenTime.weekend}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/pavanjewellers/"
                className="hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.facebook.com/groups/69151418603232"
                className="hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={`https://wa.me/${whatAppNumber}`}
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
          <p>&copy; {new Date().getFullYear()} Pavan Jewellers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
