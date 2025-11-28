import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import { FaStar, FaFire } from "react-icons/fa";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// React Router
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return (
    <div className="mb-6 w-full relative px-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="rounded-2xl shadow-light-lg product-carousel-custom"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              brand,
              numReviews,
              rating,
            }) => (
              <SwiperSlide key={_id}>
                {/* Wrap entire slide in Link */}
                <Link
                  to={`/product/${_id}`}
                  className="group block bg-gradient-to-br from-white to-light-50 rounded-2xl p-6 hover:from-light-50 hover:to-light-100 transition-all duration-300 transform hover:scale-105 border border-primary-200 hover:border-primary-300 shadow-light-lg"
                >
                  {/* Header with Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <FaFire className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-light-800">Hot Deal</h3>
                  </div>

                  {/* Product Image */}
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-contain rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Product Info */}
                  <h4 className="text-lg font-semibold text-light-800 mb-2 truncate">
                    {name}
                  </h4>
                  <p className="text-light-600 text-sm mb-3">{brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <span className="text-light-600 text-sm">
                      ({rating || 4.5})
                    </span>
                  </div>
                  
                  {/* Price and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-bold text-xl">
                      ₹{price.toLocaleString()}
                    </span>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition shadow-light">
                      View Deal
                    </button>
                  </div>
                </Link>
              </SwiperSlide>
            )
          )}
        </Swiper>
      )}
    </div>
  );
};

export default ProductCarousel;
