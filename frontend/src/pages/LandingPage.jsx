import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-40  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                QuickFill
              </span>
              <span className="ml-2 text-sm text-gray-500 hidden sm:block">
                Auto Form Filler
              </span>
            </div>
            <div>
              <ul className="flex items-center space-x-6 gap-10">
                <li>
                  <a href="">Home</a>
                </li>
                <li>
                  <a href="">About</a>
                </li>
                <li>
                  <a href="">
                    <Link to="/logIn">Sign In</Link>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="hero-section"></div>
    </div>
  );
}

export default LandingPage;
