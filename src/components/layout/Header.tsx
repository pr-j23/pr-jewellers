import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../../assets';
import { useGlobalValue } from '../../context/GlobalContext';
import MetalPrices from '../home/MetalPrices';
import Button from '../shared/Button';
import NavLinks from './NavLinks';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { renderMetalPrices } = useGlobalValue();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Pavan Jewellers logo" className="w-14" />
            <span className="ml-2 text-xl font-serif font-semibold">Pavan Jewellers</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks className="px-3 py-2" />
          </nav>

          <Button
            label={
              isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )
            }
            onClick={toggleMobileMenu}
            classN="md:hidden p-2"
            ariaLabel="Toggle navigation menu"
          />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <NavLinks className="block px-3 py-2" toggleMobileMenu={toggleMobileMenu} />
          </div>
        </div>
      )}
      {renderMetalPrices && !isMobileMenuOpen && <MetalPrices />}
    </header>
  );
};

export default Header;
