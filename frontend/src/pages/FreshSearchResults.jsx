import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useSearchProductsQuery } from "../redux/api/productApiSlice";
import { setProducts } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";

const FreshSearchResults = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.shop);
  const { data: categories = [] } = useFetchCategoriesQuery();
  const { data: searchResults = [], isLoading, error } = useSearchProductsQuery(keyword);

  // Debug logging
  console.log('Search keyword:', keyword);
  console.log('Search results:', searchResults);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  // Memoize the filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return Array.isArray(searchResults) ? searchResults : [];
  }, [searchResults]);

  // Load products into Redux when fetched
  useEffect(() => {
    if (Array.isArray(searchResults) && searchResults.length > 0) {
      dispatch(setProducts(searchResults));
    }
  }, [searchResults, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white-900 text-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading search results</h2>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-900 text-black">
      <div className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black   mb-2">
            {keyword === 'Mobiles' || keyword === 'Laptops' || keyword === 'Electronics' || keyword === 'Accessories' 
              ? `${keyword === 'Mobiles' ? 'Smartphones' : keyword === 'Electronics' ? 'Electronics' : keyword} Products` 
              : `Search Results for: "${keyword}"`
            }
          </h1>
          <p className="text-gray-400">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const category = categories.find(cat => cat._id === product.category);
              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {category?.name || 'Product'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Price and Rating */}
                    <div className="flex items-center justify-between">
                      <div className="text-blue-400 font-bold text-xl">
                        ₹{product.price.toLocaleString()}
                      </div>
                      {product.rating > 0 && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-gray-300 text-sm">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mt-2">
                      {product.countInStock > 0 ? (
                        <span className="text-green-400 text-sm">
                          ✓ In Stock ({product.countInStock} available)
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm">✗ Out of Stock</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-4">No products found</h2>
            <p className="text-gray-400 mb-8">
              We couldn't find any products matching "{keyword}". Try searching with different keywords.
            </p>
            
            {/* Search Suggestions */}
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-white font-medium mb-4">Try searching for:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Smartphones', 'Laptops', 'Headphones', 'Tablets', 'Cameras'].map((term) => (
                  <Link
                    key={term}
                    to={`/search/${encodeURIComponent(term)}`}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-full transition-colors duration-150"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreshSearchResults;
