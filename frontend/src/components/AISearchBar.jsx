import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMicrophone, FaStop, FaRobot, FaLightbulb } from 'react-icons/fa';
import { useChatWithBotMutation } from '../redux/api/chatbotApiSlice';

const AISearchBar = ({ placeholder = "Ask AI anything about products...", showSuggestions = true }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  
  // Chat with bot mutation
  const [chatWithBot, { isLoading }] = useChatWithBotMutation();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowAI(false);
        setShowSuggestionsDropdown(false);
        setQuery('');
        setAiResponse(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleAISearch(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // AI-powered search suggestions
  const aiSuggestions = [
    "Show me gaming laptops under ₹80,000",
    "Find wireless headphones with noise cancellation",
    "What are the best smartphones for photography?",
    "Recommend products for home office setup",
    "Show me trending electronics",
    "Find budget-friendly tablets",
    "What are the top-rated smartwatches?",
    "Show me products with 5-star ratings"
  ];

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAISearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setShowAI(true);
    setShowSuggestionsDropdown(false);
    setAiResponse(null);

    try {
      const response = await chatWithBot({
        message: searchQuery,
        userId: null
      }).unwrap();
      
      setAiResponse(response);
    } catch (error) {
      console.error('AI search error:', error);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        handleAISearch(query);
      } else {
        handleSearch(query);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestionsDropdown(false);
    handleAISearch(suggestion);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mb-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 focus-within:border-purple-500 transition-colors">
          <FaSearch className="text-gray-400 ml-4 mr-2" />
          
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              setShowAI(true);
              setShowSuggestionsDropdown(true);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white py-3 px-2 focus:outline-none"
          />
          
          <div className="flex items-center space-x-2 pr-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              disabled={!recognitionRef.current}
              title="Voice Search"
            >
              {isListening ? <FaStop size={16} /> : <FaMicrophone size={16} />}
            </button>
            
            <button
              onClick={() => handleAISearch(query)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-2 rounded-lg transition-all duration-200"
              title="AI Search"
            >
              <FaRobot size={16} />
            </button>
          </div>
        </div>

        {/* Search Instructions */}
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>Press Enter to search • Ctrl+Enter for AI search</span>
          <span className="flex items-center">
            <FaLightbulb className="mr-1" />
            AI-powered search available
          </span>
        </div>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && showAI && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaRobot className="text-purple-500 mr-2" />
              <h3 className="text-white font-semibold">AI Suggestions</h3>
            </div>
            
            {aiResponse ? (
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-white text-sm mb-2">{aiResponse.response}</p>
                  {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-gray-300 text-xs font-medium">Recommended Products:</p>
                      {Array.isArray(aiResponse.recommendations) ? aiResponse.recommendations.slice(0, 3).map((product, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-600 rounded p-2">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{product.name}</p>
                            <p className="text-green-400 text-xs">₹{product.price.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            View
                          </button>
                        </div>
                      )) : null}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300 text-sm mb-3">Try asking:</p>
                {Array.isArray(aiSuggestions) ? aiSuggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                )) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Suggestions */}
      {showSuggestions && showSuggestionsDropdown && !showAI && query.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-[100] max-h-80 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaLightbulb className="text-yellow-500 mr-2" />
              <h3 className="text-white font-semibold">Quick Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.isArray(aiSuggestions) ? aiSuggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-sm transition-colors"
                >
                  {suggestion}
                </button>
              )) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
