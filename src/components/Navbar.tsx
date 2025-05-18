
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, User, Settings } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("sahiraah_user");
    if (userStr) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const handleClick = () => {
    // Close mobile menu when a link is clicked
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sahiraah_user");
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        {user?.profilePicture ? (
                          <AvatarImage src={user.profilePicture} alt={user.name || "User"} />
                        ) : (
                          <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to="/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="cursor-pointer" 
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                <Link 
                  to="/settings" 
                  className="text-blue-900 hover:text-yellow-500 font-medium py-2"
                  onClick={handleClick}
                >
                  Settings
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
