
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("sahiraah_user");
    setIsAuthenticated(!!user);
  }, []);

  const handleClick = () => {
    // Close mobile menu when a link is clicked
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={handleClick}>
            <span className="text-2xl font-bold text-blue-900">Sahi<span className="text-yellow-500">Raah</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-blue-900 hover:text-yellow-500 font-medium">Home</Link>
            <Link to="/about" className="text-blue-900 hover:text-yellow-500 font-medium">About</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-blue-900 hover:text-yellow-500 font-medium">Dashboard</Link>
                <Button 
                  variant="outline" 
                  className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                  onClick={() => {
                    localStorage.removeItem("sahiraah_user");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4 pb-4">
            <Link 
              to="/" 
              className="text-blue-900 hover:text-yellow-500 font-medium py-2"
              onClick={handleClick}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-blue-900 hover:text-yellow-500 font-medium py-2"
              onClick={handleClick}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-blue-900 hover:text-yellow-500 font-medium py-2"
                  onClick={handleClick}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline" 
                  className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full"
                  onClick={() => {
                    localStorage.removeItem("sahiraah_user");
                    window.location.href = "/";
                    handleClick();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={handleClick}
              >
                <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
