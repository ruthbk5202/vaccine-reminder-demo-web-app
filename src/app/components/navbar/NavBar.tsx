import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdVaccines } from "react-icons/md";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <MdVaccines className="text-3xl text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              Vaccine Reminder
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a
              href="#"
              className="block text-gray-800 hover:text-blue-600 text-sm font-medium transition duration-300"
            >
              Home
            </a>
            <a
              href="#"
              className="block text-gray-800 hover:text-blue-600 text-sm font-medium transition duration-300"
            >
              About
            </a>
            <a
              href="#"
              className="block text-gray-800 hover:text-blue-600 text-sm font-medium transition duration-300"
            >
              Services
            </a>
            <a
              href="#"
              className="block text-gray-800 hover:text-blue-600 text-sm font-medium transition duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300 text-center"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
