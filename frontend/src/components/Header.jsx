import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaStar, FaClock, FaGift } from "react-icons/fa";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <h1>ERROR</h1>;

  const dealProduct = data[0];
  const featuredProduct = data[1];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-light-50 via-white to-light-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner with Countdown */}
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-8 mb-12 relative overflow-hidden shadow-light-xl">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <FaFire className="text-yellow-400 text-3xl animate-pulse" />
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    MEGA SALE
                  </h1>
                </div>
                <p className="text-xl text-yellow-100 mb-4">
                  Up to 70% OFF on Electronics
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 border border-primary-200 shadow-light">
                  <FaClock className="text-primary-600" />
                  <span className="text-primary-700 font-bold text-lg">
                    Ends in: {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <img
                  src={dealProduct?.image || "/placeholder-product.jpg"}
                  alt="Deal Product"
                  className="w-48 h-48 lg:w-64 lg:h-64 object-contain mx-auto"
                />
                <div className="mt-4">
                  <h3 className="text-white font-bold text-xl mb-2">
                    {dealProduct?.name || "Special Deal"}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-yellow-300">
                      ₹{dealProduct ? Math.round(dealProduct.price * 0.3).toLocaleString() : "99,999"}
                    </span>
                    <span className="text-lg text-gray-300 line-through">
                      ₹{dealProduct?.price.toLocaleString() || "299,999"}
                    </span>
                  </div>
                  <Link
                    to={dealProduct ? `/product/${dealProduct._id}` : "/shop"}
                    className="inline-block bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-105 shadow-light-lg"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Product 1 */}
          {dealProduct && (
            <Link 
              to={`/product/${dealProduct._id}`} 
              className="group bg-gradient-to-br from-white to-light-50 rounded-2xl p-6 hover:from-light-50 hover:to-light-100 transition-all duration-300 transform hover:scale-105 border border-primary-200 hover:border-primary-300 shadow-light-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <FaGift className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-light-800">Deal of the Day</h3>
              </div>
              <img
                src={dealProduct.image}
                alt={dealProduct.name}
                className="w-full h-48 object-contain rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
              />
              <h4 className="text-lg font-semibold text-light-800 mb-2 truncate">
                {dealProduct.name}
              </h4>
              <p className="text-light-600 text-sm mb-3">{dealProduct.brand}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-light-600 text-sm">(4.5)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-bold text-xl">
                  ₹{dealProduct.price.toLocaleString()}
                </span>
                <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition shadow-light">
                  View Deal
                </button>
              </div>
            </Link>
          )}

          {/* Featured Product 2 */}
          {featuredProduct && (
            <Link 
              to={`/product/${featuredProduct._id}`} 
              className="group bg-gradient-to-br from-white to-light-50 rounded-2xl p-6 hover:from-light-50 hover:to-light-100 transition-all duration-300 transform hover:scale-105 border border-primary-200 hover:border-primary-300 shadow-light-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                  <FaStar className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-light-800">Featured Pick</h3>
              </div>
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-full h-48 object-contain rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
              />
              <h4 className="text-lg font-semibold text-light-800 mb-2 truncate">
                {featuredProduct.name}
              </h4>
              <p className="text-light-600 text-sm mb-3">{featuredProduct.brand}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-light-600 text-sm">(4.8)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600 font-bold text-xl">
                  ₹{featuredProduct.price.toLocaleString()}
                </span>
                <button className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-4 py-2 rounded-lg hover:from-secondary-600 hover:to-primary-600 transition shadow-light">
                  View Deal
                </button>
              </div>
            </Link>
          )}

          {/* Product Carousel */}
          <div className="lg:col-span-1">
            <ProductCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
