import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";

const FreshSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Get all products for suggestions
  const { data: allProducts = [] } = useGetProductsQuery({});

  // Memoize the suggestions to prevent unnecessary recalculations
  const suggestions = useMemo(() => {
    if (searchTerm.length > 1 && allProducts.length > 0) {
      return allProducts
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
    }
    return [];
  }, [searchTerm, allProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setSearchTerm("");
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands..."
            className="w-full pl-12 pr-24 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            style={{ backgroundColor: '#ffffff', color: '#111827' }}
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
              Search
            </div>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 !bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
          {suggestions.map((product) => (
            <div
              key={product._id}
              onClick={() => handleSuggestionClick(product)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 border-b border-gray-200 last:border-b-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-lg mr-3"
              />
              <div className="flex-1">
                <h4 className="text-gray-900 font-medium text-sm">{product.name}</h4>
                <p className="text-gray-600 text-xs">{product.brand}</p>
              </div>
              <div className="text-blue-600 font-semibold text-sm">
                ₹{product.price}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {isFocused && searchTerm.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 !bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4" style={{ backgroundColor: '#ffffff' }}>
          <h3 className="text-gray-900 font-medium mb-3">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['Smartphones', 'Laptops', 'Headphones', 'Tablets', 'Cameras'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  navigate(`/search/${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-150"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreshSearchBar;
