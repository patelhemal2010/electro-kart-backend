import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/usersApiSlice"; 
import { logout } from "../redux/features/auth/authSlice";
import FreshSearchBar from "./FreshSearchBar";

const TopBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const user = userInfo
    ? {
        name: userInfo.username || userInfo.name || "User",
        avatar: userInfo.avatar || "/default-avatar.png",
      }
    : null;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isAdminContext = location.pathname.startsWith("/admin");
  const profileHref = userInfo?.isAdmin && isAdminContext ? "/admin/profile" : "/profile";

  return (
    <header className="sticky top-0 z-40 bg-gray-800 backdrop-blur border-b border-gray-700 w-full shadow-lg h-16">
      <div className="w-full h-full px-6 py-3 flex items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center text-2xl font-extrabold tracking-wide">
              <span className="text-white">
                Electro
              </span>
              <span className="text-orange-400">
                Kart
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: Fresh Search Bar (hidden on admin pages) */}
        {!isAdminContext && (
          <div className="flex-1 flex justify-center items-center px-6">
            <FreshSearchBar />
          </div>
        )}

        {/* RIGHT: Profile or Login/Register */}
        <div className="flex justify-end items-center space-x-4 relative">
          {user ? (
            <>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <span className="text-gray-200 font-medium hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {/* Dark Themed Profile Dropdown */}
              {showProfile && (
                <div className="absolute top-14 right-0 w-64 bg-gray-900 text-gray-200 rounded-xl shadow-xl border border-gray-700 z-50 animate-fadeIn">
                  <div className="flex flex-col items-center p-6 bg-gradient-to-r from-pink-600 to-purple-700 rounded-t-xl">
                    <div className="w-20 h-20 rounded-full bg-gray-800 overflow-hidden mb-2 border-4 border-pink-400">
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-20 h-20 object-cover rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <div className="text-white text-lg font-semibold">
                      {user.name}
                    </div>
                  </div>

                  <div className="flex justify-between p-4 border-t border-gray-700">
                    <Link
                      to={profileHref}
                      className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition"
                      onClick={() => setShowProfile(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                      onClick={logoutHandler}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-light-100 to-light-200 text-light-800 rounded-lg hover:from-light-200 hover:to-light-300 transition-all duration-300 border border-primary-200 shadow-light"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-light-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
