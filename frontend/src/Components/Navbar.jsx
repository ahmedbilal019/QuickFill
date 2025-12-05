import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/helpers";
import { Link } from "react-router-dom";

//  * Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-40  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">QuickFill</span>
            <span className="ml-2 text-sm text-gray-500 hidden sm:block">
              Auto Form Filler
            </span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(user?.name || "User")}
              </div>
              {/* Name */}
              <span className="hidden md:block text-gray-700 font-medium">
                {user?.name || "User"}
              </span>
              {/* Dropdown Icon */}
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                ></div>

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <Link to="/">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <svg
                        className="w-3.5 h-3.5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
