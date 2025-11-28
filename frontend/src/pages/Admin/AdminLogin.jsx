import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/admin/dashboard";

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate(redirect);
    } else if (userInfo && !userInfo.isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/login");
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      
      // Check if the logged-in user is an admin
      if (res.isAdmin) {
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Admin login successful!");
      } else {
        toast.error("Access denied. Admin privileges required.");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white/90 backdrop-blur-xl p-12 rounded-2xl shadow-light-xl w-full max-w-lg border border-primary-200 relative z-10">
        <h1 className="text-4xl font-bold text-center text-light-800 mb-8">
          Admin Sign In
        </h1>

        <form onSubmit={submitHandler} autoComplete="off">
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-light-700"
            >
              Admin Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              className="mt-1 p-3 w-full rounded-lg bg-white text-light-800 border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-light"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-light-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              className="mt-1 p-3 w-full rounded-lg bg-white text-light-800 border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-light"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 rounded-lg font-semibold shadow-light-md transition-all duration-300"
          >
            {isLoading ? "Signing In..." : "Admin Sign In"}
          </button>

          {isLoading && <Loader />}
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-light-600">
            Regular user?{" "}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 hover:underline"
            >
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

