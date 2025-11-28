import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUpload, FaTimes } from 'react-icons/fa';
import { useVisualSearchMutation } from '../redux/api/visualSearchApiSlice';

const VisualSearchButton = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  
  const [visualSearch] = useVisualSearchMutation();

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle visual search
  const handleVisualSearch = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    console.log('Starting visual search with image:', selectedImage);
    setIsSearching(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      console.log('FormData created, sending request...');

      const response = await visualSearch(formData).unwrap();
      console.log('Visual search response:', response);
      
      // Navigate to visual search results page
      navigate('/visual-search', { 
        state: { 
          searchResults: response,
          uploadedImage: imagePreview 
        } 
      });
      
      // Close modal
      setIsOpen(false);
      setSelectedImage(null);
      setImagePreview(null);
      
    } catch (err) {
      console.error('Visual search error:', err);
      console.error('Error details:', err?.data || err?.message || err);
      setError(err?.data?.message || err?.message || 'Error processing image. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Clear and close
  const handleClose = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open camera
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* Visual Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${className}`}
        title="Visual Search"
      >
        <FaCamera />
        <span className="hidden sm:inline">Visual Search</span>
      </button>

      {/* Modal */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={handleClose}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            ref={modalRef}
            className="bg-gray-800 rounded-lg w-full max-w-md max-h-[85vh] overflow-hidden relative shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full overflow-y-auto flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Visual Search</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                {!imagePreview ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-3">
                      Upload an image to find similar products
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <FaUpload />
                        <span>Browse</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCamera();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <FaCamera />
                        <span>Camera</span>
                      </button>
                    </div>
                  </div>
                  
                    <p className="text-xs text-gray-500 text-center">
                      Supports JPG, PNG, GIF, WebP (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 flex flex-col">
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                  </div>
                  
                  <button
                    onClick={handleVisualSearch}
                    disabled={isSearching}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <span>Find Similar Products</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                      Choose Different Image
                    </button>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
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
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default VisualSearchButton;
