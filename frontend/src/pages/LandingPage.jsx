import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { MdSecurity } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { TbHandClick } from "react-icons/tb";

function LandingPage() {
  return (
    <div className="bg-white">
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

            {/* Links */}
            <div>
              <ul className="flex items-center space-x-10 gap-10 font-bold text-blue-400">
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
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-40 bg-gray-200">
        <div className="max-w-7xl text-center mx-auto flex items-center  justify-center md:flex-row  px-6">
          {/* Left Text */}
          <div className="md:w-1/2 ">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 leading-tight">
              Welcome to QuickFill
              <br />
              <span className="text-gray-500 text-[30px]">
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
      <section id="about" className="pt-30 pb-30 py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            What is QuickFill?
          </h2>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            QuickFill is a smart form-automation tool designed to save you from
            repetitive typing. It securely stores your essential information and
            auto-fills any form within seconds. Whether you’re applying for
            jobs, filling registrations, or handling routine submissions,
            QuickFill cuts the effort to almost zero. It boosts speed, reduces
            errors, and keeps your workflow smooth and efficient.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-gray-200 ">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900">
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
