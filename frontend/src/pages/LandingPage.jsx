import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { MdSecurity } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { TbHandClick } from "react-icons/tb";
function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center space-x-10 font-medium text-blue-400">
              <li>
                <a href="#" className="hover:text-blue-700 hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-blue-700 hover:underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-700 hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/logIn"
                  className="hover:text-blue-700 hover:underline"
                >
                  Sign In
                </Link>
              </li>
            </ul>

            {/* Hamburger */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setOpen(!open)}
            >
              <svg
                className="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {open && (
            <ul className="md:hidden bg-white border-t flex flex-col gap-4 py-4 font-medium text-blue-500">
              <li>
                <a
                  href="#"
                  className="block px-4"
                  onClick={() => setOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block px-4"
                  onClick={() => setOpen(false)}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="block px-4"
                  onClick={() => setOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/logIn"
                  className="block px-4"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-40 bg-blue-50">
        <div className="max-w-7xl text-center mx-auto flex items-center  justify-center md:flex-row  px-6">
          {/* Left Text */}
          <div className="md:w-1/2 ">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-700 leading-tight">
              Welcome to QuickFill
              <br />
              <span className="text-gray-700 text-3xl md:text-4xl">
                Get Ride of typing long forms!
              </span>
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Automatically completes repetitive forms with one click. Save
              time. Reduce errors. Work smarter!
            </p>

            <button className="mt-6 px-6 py-3 bg-blue-600 text-white text-md font-bold rounded-md shadow hover:bg-blue-700 hover:cursor-pointer  hover:shadow-xl/30">
              <Link to="/register">Get Started</Link>
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            What is QuickFill?
          </h2>

          <p className="mt-4 text-gray-700 text-lg max-w-3xl mx-auto">
            QuickFill eliminates repetitive typing by auto-filling forms with
            just one click. Create your account, save your information once,
            install our browser extension, and never type the same details
            again. Whether you're applying for jobs, filling registrations, or
            handling routine submissions, QuickFill makes it effortless.
          </p>

          {/* How It Works Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-12">
              How to Use QuickFill
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 border-2 border-indigo-200 h-64 flex flex-col">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </div>
                  <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
                    1
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Create Account
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Sign up for free and create your QuickFill account
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-indigo-400 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 border-2 border-blue-200 h-64 flex flex-col">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                  </div>
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
                    2
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Save Your Info
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Enter your details by creating Templates.
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 border-2 border-green-200 h-64 flex flex-col">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
                    3
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Install Extension
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Add our browser extension to your browser
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 border-2 border-purple-200 h-64 flex flex-col">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
                    4
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Visit Any Form
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Go to any website with a form to fill
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 5 */}
              <div>
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 border-2 border-orange-200 h-64 flex flex-col">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
                    5
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Click & Fill
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Click the extension and watch it auto-fill
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            Features
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-6 bg-white shadow rounded-lg text-center hover:cursor-pointer hover:shadow-xl/30 transform transition duration-300 hover:scale-103">
              <div className="text-blue-600 text-4xl mb-4 flex items-center justify-center">
                <TbHandClick size={50} />
              </div>
              <h3 className="text-xl font-semibold">One-Click Autofill</h3>
              <p className="text-gray-600 mt-2">
                Automatically fill any form with your stored data instantly.
                Save time, reduce repetitive typing, and ensure accuracy across
                all your online forms with just one click.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white shadow rounded-lg text-center hover:cursor-pointer hover:shadow-xl/30 transform transition duration-300 hover:scale-103">
              <div className="text-green-600 text-4xl mb-4 flex items-center justify-center">
                <MdSecurity size={50} />
              </div>
              <h3 className="text-xl font-semibold">Secure Storage</h3>
              <p className="text-gray-600 mt-2">
                Your information is encrypted and safely stored, ensuring that
                your personal data remains private and protected at all times.
                Access it anytime with complete peace of mind.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white shadow rounded-lg text-center hover:cursor-pointer hover:shadow-xl/30 transform transition duration-300 hover:scale-103">
              <div className="text-purple-600 text-4xl mb-4 flex items-center justify-center">
                <IoExtensionPuzzle size={50} />
              </div>
              <h3 className="text-xl font-semibold">Browser Extension</h3>
              <p className="text-gray-600 mt-2">
                Works seamlessly with your web browser to provide real-time
                autofill, saving you time and effort while navigating forms
                across any website. Quick and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <footer class="bg-blue-600 text-white py-6">
          <div class="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <p class="text-lg">&copy; 2025 QuickFill. All rights reserved.</p>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default LandingPage;
