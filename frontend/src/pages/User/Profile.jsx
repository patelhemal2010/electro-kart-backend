import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null); // uploaded file
  const [preview, setPreview] = useState(""); // preview / stored avatar

  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username || "");
      setEmail(userInfo.email || "");
      setPreview(userInfo.avatar || "/default-avatar.png");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      let avatarBase64 = preview;

      // ✅ Convert new file to Base64 only if changed
      if (avatar) {
        const reader = new FileReader();
        avatarBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject("Avatar upload failed");
          reader.readAsDataURL(avatar);
        });
      }

      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        ...(password && { password }), // ✅ only include if filled
        avatar: avatarBase64,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // live preview
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center md:flex md:space-x-4">
        <div className="md:w-1/3 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Update Profile
          </h2>

          {/* ✅ Profile Picture Preview */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border-4 border-pink-500 object-cover mb-3"
            />
            <label className="cursor-pointer text-sm text-gray-300 hover:text-white">
              <span className="bg-pink-600 px-3 py-1 rounded-md hover:bg-pink-700">
                Choose Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={fileChangeHandler}
                className="hidden" // ✅ hide input, only show styled button
              />
            </label>
          </div>

          <form onSubmit={submitHandler}>
            {/* Username */}
            <div className="mb-4">
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="p-3 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-white mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="p-3 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter new password (optional)"
                className="p-3 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="p-3 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className={`flex ${isAdminRoute ? 'justify-center' : 'justify-between'} mt-6`}>
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-6 rounded-lg hover:bg-pink-600 transition"
              >
                Update
              </button>

              {!isAdminRoute && (
                <Link
                  to="/user-orders"
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
                >
                  My Orders
                </Link>
              )}
            </div>

            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
