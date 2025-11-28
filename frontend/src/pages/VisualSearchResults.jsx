import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaShoppingCart, FaHeart, FaStar, FaCamera } from 'react-icons/fa';

const VisualSearchResults = () => {
  const location = useLocation();
  const { searchResults, uploadedImage } = location.state || {};

  if (!searchResults) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaCamera className="text-6xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No Search Results</h1>
          <p className="text-gray-400 mb-6">Please perform a visual search first</p>
          <Link
            to="/visual-search"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Start Visual Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/visual-search"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Visual Search Results</h1>
              <p className="text-gray-400">
                Found {searchResults.products?.length || 0} similar products
              </p>
            </div>
          </div>
        </div>

        {/* Original Image and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Original Image */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">Your Image</h3>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="mt-4">
                <Link
                  to="/visual-search"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <FaCamera />
                  <span>Search Another Image</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {searchResults.products && searchResults.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.isArray(searchResults.products) ? searchResults.products.map((product) => (
                  <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.confidence}% Match
                      </div>
                      {product.rating > 0 && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          {product.rating}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-400 font-bold text-lg">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                          <FaEye className="inline mr-1" />
                          View
                        </Link>
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
                          <FaShoppingCart />
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : null}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <FaCamera className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Similar Products Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any products similar to your image. Try uploading a different image.
                </p>
                <Link
                  to="/visual-search"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Try Another Image
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search Info */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">About Visual Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">AI-Powered</h4>
              <p>Our AI analyzes colors, textures, and shapes to find visually similar products.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Smart Matching</h4>
              <p>Products are ranked by visual similarity with confidence scores.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Instant Results</h4>
              <p>Get results in seconds with our advanced image processing technology.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSearchResults;
