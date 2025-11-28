import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-gradient-to-br from-white to-light-50 p-3 mt-2 mb-2 rounded-xl border border-primary-200 shadow-light-md">
            <h2 className="h4 text-center py-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-2 text-white font-semibold">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
  <div key={c._id} className="mb-2">
    <div className="flex items-center mr-4">
      <input
        type="checkbox"
        id={`category-${c._id}`}
        onChange={(e) => handleCheck(e.target.checked, c._id)}
        className="w-4 h-4 ..."
      />
      <label
        htmlFor={`category-${c._id}`}
        className="ml-2 text-sm font-medium text-light-800"
      >
        {c.name}
      </label>
    </div>
  </div>
))}
            </div>

            <h2 className="h4 text-center py-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-2 text-white font-semibold">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand, index) => (
  <div className="flex items-center mr-4 mb-5" key={brand}>
    <input
      type="radio"
      id={`brand-${index}`}
      name="brand"
      onChange={() => handleBrandClick(brand)}
      className="w-4 h-4 ..."
    />
    <label
      htmlFor={`brand-${index}`}
      className="ml-2 text-sm font-medium text-light-800"
    >
      {brand}
    </label>
  </div>
))}
            </div>

            <h2 className="h4 text-center py-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-2 text-white font-semibold">
              Filter by Price
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-light-500 bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-light-800 shadow-light"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 my-4 shadow-light-md"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2 text-light-800 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              {products?.length} Products Found
            </h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
