import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaUpload, FaSearch, FaTimes, FaEye, FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { useVisualSearchMutation } from '../redux/api/visualSearchApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const VisualSearch = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  
  const [visualSearch, { isLoading }] = useVisualSearchMutation();

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setError(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  // Handle visual search
  const handleVisualSearch = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await visualSearch(formData).unwrap();
      setSearchResults(response);
    } catch (err) {
      setError(err?.data?.message || 'Error processing image. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSearchResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open camera (for mobile devices)
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 via-white to-light-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-light-800 mb-4">
            🔍 Visual Product Search
          </h1>
          <p className="text-light-600 text-lg">
            Upload an image to find similar products using AI
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-light-lg p-6 mb-8 border border-primary-100">
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-primary-200 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer bg-light-50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FaCamera className="text-6xl text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-light-800 mb-2">
                Upload an Image
              </h3>
              <p className="text-light-600 mb-4">
                Drag and drop an image here, or click to browse
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FaUpload />
                  <span>Browse Files</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCamera();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FaCamera />
                  <span>Take Photo</span>
                </button>
              </div>
              <p className="text-sm text-light-500 mt-4">
                Supports JPG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-light-800">Selected Image</h3>
                <button
                  onClick={clearSearch}
                  className="text-light-600 hover:text-light-800 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-lg font-semibold text-light-800 mb-2">
                    Ready to Search
                  </h4>
                  <p className="text-light-600 mb-4">
                    Click the search button to find similar products using AI
                  </p>
                  
                  <button
                    onClick={handleVisualSearch}
                    disabled={isSearching || isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isSearching || isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <FaSearch />
                        <span>Find Similar Products</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4">
              <Message variant="danger">{error}</Message>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="bg-white rounded-lg shadow-light-lg p-6 border border-primary-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-light-800">
                Similar Products Found
              </h3>
              <div className="text-sm text-light-600">
                {searchResults.products?.length || 0} results
              </div>
            </div>

            {searchResults.products && searchResults.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(searchResults.products) ? searchResults.products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border border-primary-200">
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
                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-light-800 px-2 py-1 rounded-full text-xs flex items-center shadow-md">
                          <FaStar className="text-yellow-400 mr-1" />
                          {product.rating}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-light-800 font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-light-600 text-sm mb-2">{product.brand}</p>
                      <p className="text-light-700 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-primary-600 font-bold text-lg">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-light-600 text-sm">
                          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white text-center py-2 px-3 rounded text-sm font-medium transition-colors"
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
              <div className="text-center py-8">
                <FaSearch className="text-4xl text-light-600 mx-auto mb-4" />
                <p className="text-light-700">No similar products found</p>
                <p className="text-light-500 text-sm mt-2">
                  Try uploading a different image or check back later
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={clearSearch}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
              >
                Search Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearch;
