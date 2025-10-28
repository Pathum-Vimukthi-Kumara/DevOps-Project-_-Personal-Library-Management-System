import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/library-hero.js';

function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left Column (Text) */}
        <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center bg-white">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Manage your books with ease
          </h1>
          <p className="text-gray-600 mb-8">
            Keep track of your personal library, manage borrowed books, and organize your collection all in one place.
          </p>
          <div className="space-y-3">
            <div>
              <Link
                to="/login"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
              >
                Sign in
              </Link>
            </div>
            <div>
              <Link
                to="/register"
                className="inline-block text-blue-500 hover:text-blue-600 font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column (Image) */}
        <div className="w-full md:w-1/2 bg-gray-200">
          <img
            className="h-full w-full object-cover"
            src={heroImage}
            alt="Library with bookshelves and hanging lights"
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;