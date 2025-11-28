import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaGift,
  FaStar
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-2xl font-extrabold tracking-wide">
                <span className="text-gray-800">
                  Electro
                </span>
                <span className="text-orange-500">
                  Kart
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your one-stop destination for the latest electronics, gadgets, and tech accessories. 
              We bring you the best deals on smartphones, laptops, cameras, and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors social-icon">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors social-icon">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors social-icon">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors social-icon">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors social-icon">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/visual-search" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Visual Search
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/favorite" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>


          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-500 text-sm" />
                <span className="text-gray-600 text-sm">+91 7778048350/+91 9510579587</span>
                
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-500 text-sm" />
                <span className="text-gray-600 text-sm">support@electrokart.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-gray-500 text-sm mt-1" />
                <span className="text-gray-600 text-sm">
                  123,Arush Complex ,Modhera Road,<br />
                  Mehsana, Gujarat 384310
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 feature-card bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <FaTruck className="text-white text-lg" />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-sm">Free Shipping</h4>
                <p className="text-gray-600 text-xs">On orders over ₹999</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 feature-card bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-sm">Secure Payment</h4>
                <p className="text-gray-600 text-xs">100% secure checkout</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 feature-card bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                <FaHeadset className="text-white text-lg" />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-sm">24/7 Support</h4>
                <p className="text-gray-600 text-xs">Always here to help</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 feature-card bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <FaGift className="text-white text-lg" />
              </div>
              <div>
                <h4 className="text-gray-800 font-semibold text-sm">Gift Cards</h4>
                <p className="text-gray-600 text-xs">Perfect for any occasion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-300 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest deals and offers
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Electro Kart. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/return-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                30-Day Return Policy
              </Link>
              <Link to="/refund" className="text-gray-400 hover:text-white transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <FaStar className="text-yellow-400 text-sm" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
