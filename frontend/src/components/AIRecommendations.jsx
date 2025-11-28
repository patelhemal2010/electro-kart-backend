import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaStar, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { useChatWithBotMutation } from '../redux/api/chatbotApiSlice';

const AIRecommendations = ({ userId, category, maxProducts = 6 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Chat with bot mutation
  const [chatWithBot] = useChatWithBotMutation();

  // Generate AI recommendations based on category or user preferences
  const getAIRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = '';
      
      if (category) {
        query = `Show me the best ${category} products with high ratings`;
      } else {
        query = 'Recommend trending products that are popular and well-rated';
      }

      // Call the chatbot API using the mutation
      const response = await chatWithBot({
        message: query,
        userId: userId
      }).unwrap();
      
      setRecommendations(response.recommendations || []);
    } catch (err) {
      setError(err.message);
      console.error('Error getting AI recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAIRecommendations();
  }, [category, userId]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FaRobot className="text-purple-500 mr-2" />
          <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-32 bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FaRobot className="text-purple-500 mr-2" />
          <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        </div>
        <div className="text-red-400 text-center py-8">
          <p>Unable to load AI recommendations</p>
          <button 
            onClick={getAIRecommendations}
            className="mt-2 text-purple-400 hover:text-purple-300 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaRobot className="text-purple-500 mr-2" />
          <h3 className="text-xl font-semibold text-white">
            {category ? `${category} Recommendations` : 'AI Recommendations'}
          </h3>
        </div>
        <button 
          onClick={getAIRecommendations}
          className="text-purple-400 hover:text-purple-300 text-sm underline"
        >
          Refresh
        </button>
      </div>

      {(recommendations || []).length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FaRobot className="text-4xl mx-auto mb-4 text-purple-500" />
          <p>No recommendations available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(recommendations) ? recommendations.slice(0, maxProducts).map((product) => (
            <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  AI Recommended
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
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Powered by AI • Recommendations based on popularity, ratings, and user preferences
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations;
