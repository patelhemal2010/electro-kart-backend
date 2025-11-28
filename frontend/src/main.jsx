import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminLogin from "./pages/Admin/AdminLogin";

import AdminRoute from "./pages/Admin/AdminRoute";
import Profile from "./pages/User/Profile";
import UserList from "./pages/Admin/UserList";
import CategoryList from "./pages/Admin/CategoryList";
import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import FreshSearchResults from "./pages/FreshSearchResults";
import UserOrder from "./pages/User/userorder.jsx"; // ✅ import here
import VisualSearch from "./pages/VisualSearch";
import VisualSearchResults from "./pages/VisualSearchResults";
import ReturnPolicy from "./pages/ReturnPolicy";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route index element={<Home />} />
      <Route path="favorite" element={<Favorites />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="shop" element={<Shop />} />
      <Route path="search/:keyword" element={<FreshSearchResults />} />
      <Route path="visual-search" element={<VisualSearch />} />
      <Route path="visual-search-results" element={<VisualSearchResults />} />
      <Route path="return-policy" element={<ReturnPolicy />} />
      <Route path="refund" element={<ReturnPolicy />} />

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="user-orders" element={<UserOrder />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="placeorder" element={<PlaceOrder />} />
        <Route path="order/:id" element={<Order />} />
      </Route>

      {/* Admin */}
      <Route path="admin" element={<AdminRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="order/:id" element={<Order />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
