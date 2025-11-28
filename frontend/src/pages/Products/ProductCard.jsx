import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const buyNowHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="max-w-sm relative bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            className="cursor-pointer w-full"
            src={p.image}
            alt={p.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        {/* Brand Name */}
        <p className="text-sm text-gray-500 mb-1">
          {p?.brand}
        </p>

        {/* Product Name */}
        <h5 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">
          {p?.name}
        </h5>

        {/* Price - Vibrant Blue */}
        <p className="mb-3 text-xl font-bold text-[#0ea5e9]">
          ₹{p?.price?.toLocaleString()}
        </p>

        {/* Action Buttons */}
        <section className="flex justify-between items-center gap-2 mt-4">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View
          </Link>

          {/* Cart button with proper styling */}
          <button
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to Cart"
          >
            <AiOutlineShoppingCart size={20} />
          </button>

          {/* Buy Now button */}
          <button
            onClick={() => buyNowHandler(p)}
            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none transition-all shadow-md hover:shadow-lg"
          >
            Buy Now
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
