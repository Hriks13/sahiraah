
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Sahi<span className="text-yellow-500">Raah</span></h3>
            <p className="text-blue-200 mb-4">
              AI-powered career guidance tailored to Indian students' interests and learning style.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-200 hover:text-yellow-500">Home</Link></li>
              <li><Link to="/about" className="text-blue-200 hover:text-yellow-500">About</Link></li>
              <li><Link to="/login" className="text-blue-200 hover:text-yellow-500">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <p className="text-blue-200">support@sahiraah.com</p>
            <p className="text-blue-200">+91 98765 43210</p>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} SahiRaah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
