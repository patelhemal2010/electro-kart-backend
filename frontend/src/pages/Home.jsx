import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProductsQuery, useGetRecommendationsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { 
  FaChevronRight,
  FaStar,
  FaFire,
  FaGift,
  FaClock,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const { userInfo } = useSelector((state) => state.auth);
  const { data: recs = [] } = useGetRecommendationsQuery({ userId: userInfo?._id, limit: 12 }, { skip: !!keyword });

  // Features section
  const features = [
    { icon: FaTruck, title: "Free Delivery", desc: "On orders over ₹999" },
    { icon: FaUndo, title: "Easy Returns", desc: "30-day return policy" },
    { icon: FaShieldAlt, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: FaGift, title: "Gift Cards", desc: "Perfect for any occasion" },
  ];

  return (
    <>
      {/* Show hero header only if not searching */}
      {!keyword && <Header />}
      
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error || "Something went wrong"}
        </Message>
      ) : (
        <>
          {/* Hero Banner Section */}
          {!keyword && (
            <div className="bg-gradient-to-r from-light-50 via-white to-light-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-light-800 mb-4">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Electro Kart</span>
                  </h1>
                  <p className="text-xl text-light-600 mb-8">
                    Discover the latest in electronics with unbeatable prices
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link 
                      to="/shop" 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-full font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Shop Now
                    </Link>
                    <Link 
                      to="/visual-search" 
                      className="bg-gradient-to-r from-light-100 to-light-200 text-light-800 px-8 py-3 rounded-full font-semibold hover:from-light-200 hover:to-light-300 transition-all duration-300 border border-primary-300 shadow-light"
                    >
                      Visual Search
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Features Section */}
          {!keyword && (
            <div className="bg-gradient-to-br from-white to-light-50 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="text-white text-2xl" />
                      </div>
                      <h3 className="text-light-800 font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-light-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Flash Sale Section */}
          {!keyword && (
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 mb-12 relative overflow-hidden shadow-light-xl">
              <div className="absolute inset-0 bg-white opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaFire className="text-yellow-400 text-3xl animate-pulse" />
                    <h2 className="text-3xl font-bold text-white">Flash Sale</h2>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <FaClock className="text-white" />
                      <span className="text-white font-semibold">Ends in 24:59:59</span>
                    </div>
                  </div>
                  <Link 
                    to="/shop" 
                    className="text-white hover:text-yellow-300 flex items-center gap-2 font-semibold"
                  >
                    View All <FaChevronRight />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data?.products?.slice(0, 4).map((product) => (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                      className="bg-white rounded-xl shadow-light-lg hover:shadow-light-xl transition-all duration-300 hover:scale-105 cursor-pointer no-underline border border-primary-100"
                    >
                      <div className="p-6">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-48 w-full object-contain rounded-lg"
                          />
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                            -20%
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-light-800 font-semibold text-lg truncate">
                            {product.name}
                          </h3>
                          <p className="text-light-600 text-sm truncate">{product.brand}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 text-sm" />
                              ))}
                            </div>
                            <span className="text-light-600 text-sm">(4.5)</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <span className="text-primary-600 font-bold text-xl">
                                ₹{Math.round(product.price * 0.8).toLocaleString()}
                              </span>
                              <span className="text-light-500 line-through ml-2 text-sm">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <button className="w-full mt-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Deals Section */}
          {!keyword && (
            <div className="bg-gradient-to-br from-light-50 to-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-light-800 flex items-center gap-2">
                    <FaGift className="text-primary-500" />
                    Top Deals of the Day
                  </h2>
                  <Link 
                    to="/shop" 
                    className="text-primary-500 hover:text-primary-600 flex items-center gap-2 font-semibold"
                  >
                    View All <FaChevronRight />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data?.products?.slice(0, 8).map((product) => (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                      className="bg-gradient-to-br from-white to-light-50 rounded-xl shadow-light-lg hover:shadow-light-xl transition-all duration-300 hover:scale-105 cursor-pointer no-underline group border border-primary-200 hover:border-primary-300"
                    >
                      <div className="p-6">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-48 w-full object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="mt-4">
                          <h3 className="text-white font-semibold text-lg truncate">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">{product.brand}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 text-sm" />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">(4.5)</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-primary-600 font-bold text-xl">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition shadow-light">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended For You */}
          {!keyword && recs?.length > 0 && (
            <div className="bg-gradient-to-br from-white to-light-50 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-light-800 flex items-center gap-2">
                    💡 Recommended For You
                  </h2>
                  <Link 
                    to="/shop" 
                    className="text-primary-500 hover:text-primary-600 flex items-center gap-2 font-semibold"
                  >
                    View All <FaChevronRight />
                  </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                  {recs.map((product) => (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                      className="min-w-[280px] bg-gradient-to-br from-white to-light-50 rounded-xl shadow-light-lg hover:shadow-light-xl transition-all duration-300 hover:scale-105 cursor-pointer no-underline group border border-primary-200 hover:border-primary-300"
                    >
                      <div className="p-6">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-48 w-full object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="mt-4">
                          <h3 className="text-white font-semibold text-lg truncate">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">{product.brand}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 text-sm" />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">(4.5)</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-primary-600 font-bold text-xl">₹{product.price.toLocaleString()}</span>
                            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition shadow-light">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </>
  );
};

export default Home;
