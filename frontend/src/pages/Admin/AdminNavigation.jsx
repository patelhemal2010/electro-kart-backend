import { NavLink } from "react-router-dom";

const AdminNavigation = () => {
  return (
    <aside
      style={{ zIndex: 9999 }}
      className="hidden md:flex flex-col justify-between p-4 text-light-800 bg-gradient-to-b from-white to-light-50 w-[15%] h-[calc(100vh-4rem)] fixed left-0 top-16 border-r border-primary-200 shadow-light-lg"
    >
      <div className="mt-24 flex flex-col space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/productlist"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/admin/categorylist"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          Categories
        </NavLink>
        <NavLink
          to="/admin/allproductslist"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          All Products
        </NavLink>
        <NavLink
          to="/admin/orderlist"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/admin/userlist"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition-all duration-300 ${isActive ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500" : "hover:bg-primary-50 hover:text-primary-600"}`
          }
        >
          Profile
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminNavigation;


