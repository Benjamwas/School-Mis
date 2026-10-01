import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  const toggleMenu = () => setIsOpen(!isOpen);
  return <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/images/IMG-20250131-WA0025.jpg" 
            alt="Vendramini Schools Logo" 
            className="h-14 w-auto" />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <div className="relative" onMouseEnter={() => setShowCampusDropdown(true)} onMouseLeave={() => setShowCampusDropdown(false)}>
              <Link to="/campuses" className="nav-link flex items-center">
                Campuses
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {showCampusDropdown && <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/campuses#pre-primary-1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-light-blue-100">
                    Pre-Primary Campus 1
                  </Link>
                  <Link to="/campuses#pre-primary-2" className="block px-4 py-2 text-sm text-gray-700 hover:bg-light-blue-100">
                    Pre-Primary Campus 2
                  </Link>
                  <Link to="/campuses#pre-primary-3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-light-blue-100">
                    Pre-Primary Campus 3
                  </Link>
                  <Link to="/campuses#primary" className="block px-4 py-2 text-sm text-gray-700 hover:bg-light-blue-100">
                    Primary School
                  </Link>
                </div>}
            </div>
            <Link to="/blog" className="nav-link">
              Blog
            </Link>
            <Link to="/gallery" className="nav-link">
              Gallery
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <Link to="/contact#enroll" className="btn-primary">
              Enroll Now
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <XIcon className="h-6 w-6 text-gray-800" /> : <MenuIcon className="h-6 w-6 text-gray-800" />}
          </button>
        </div>
        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block py-2 text-gray-800 hover:text-red-600">
              Home
            </Link>
            <Link to="/about" className="block py-2 text-gray-800 hover:text-red-600">
              About Us
            </Link>
            <div>
              <button onClick={() => setShowCampusDropdown(!showCampusDropdown)} className="flex items-center w-full py-2 text-gray-800 hover:text-red-600">
                Campuses
                <svg className={`w-4 h-4 ml-1 transform ${showCampusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCampusDropdown && <div className="pl-4 mt-2 space-y-2">
                  <Link to="/campuses#pre-primary-1" className="block py-1 text-gray-700 hover:text-red-600">
                    Pre-Primary Campus 1
                  </Link>
                  <Link to="/campuses#pre-primary-2" className="block py-1 text-gray-700 hover:text-red-600">
                    Pre-Primary Campus 2
                  </Link>
                  <Link to="/campuses#pre-primary-3" className="block py-1 text-gray-700 hover:text-red-600">
                    Pre-Primary Campus 3
                  </Link>
                  <Link to="/campuses#primary" className="block py-1 text-gray-700 hover:text-red-600">
                    Primary School
                  </Link>
                </div>}
            </div>
            <Link to="/blog" className="block py-2 text-gray-800 hover:text-red-600">
              Blog
            </Link>
            <Link to="/gallery" className="block py-2 text-gray-800 hover:text-red-600">
              Gallery
            </Link>
            <Link to="/contact" className="block py-2 text-gray-800 hover:text-red-600">
              Contact
            </Link>
            <Link to="/contact#enroll" className="block py-2 px-4 bg-red-600 text-white rounded-md text-center hover:bg-red-700 transition">
              Enroll Now
            </Link>
          </div>}
      </div>
    </nav>;
};
export default Navbar;