import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GemIcon } from "lucide-react";
import NavLinks from "./NavLinks";
import logo from "../../assets/images/pr-logo.png";
import MetalPrices from "../home/MetalPrices";
import { useGlobalValue } from "../../context/GlobalContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { renderMetalPrices } = useGlobalValue();

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            {/* <GemIcon className="h-8 w-8 text-purple-600" /> */}
            <img src={logo} alt="logo" className="w-14" />
            <span className="ml-2 text-xl font-serif font-semibold">
              Pavan Jewellers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks className="px-3 py-2" />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <NavLinks
              className="block px-3 py-2"
              toggleMobileMenu={toggleMobileMenu}
            />
          </div>
        </div>
      )}
      {renderMetalPrices && <MetalPrices />}
    </header>
  );
}
