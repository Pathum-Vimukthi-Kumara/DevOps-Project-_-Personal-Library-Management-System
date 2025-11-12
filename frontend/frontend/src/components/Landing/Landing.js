import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/library-hero.js';

// Landing page simplified to show only the main hero photo and primary text

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left hero */}
          <div className="relative z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Home
              <span>/</span>
              <span className="font-medium text-gray-700">Library</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-black">
              Expand your mind,
              <br />
              reading a book
              <span className="text-accent"> →</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Books are magical. They can teach us, transport us, make us feel safe, push us out of our comfort zones,
              and make us feel like we know people and places that have never even existed.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-primary hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-primary hover:text-indigo-700 font-medium"
              >
                Register
              </Link>
            </div>

            {/* Quote card removed to keep only the main hero photo */}
          </div>

          {/* Right hero visuals */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative bg-gradient-to-b from-gray-100 to-white rounded-3xl p-4 md:p-6 shadow-inner overflow-hidden">
              <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
              <div className="relative rounded-2xl border border-gray-200 overflow-hidden">
                <img src={heroImage} alt="Reading illustration" className="w-full h-[320px] md:h-[420px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;