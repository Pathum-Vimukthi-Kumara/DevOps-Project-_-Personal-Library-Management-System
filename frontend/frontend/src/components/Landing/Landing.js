import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/library-hero.js';
import { booksOfTheWeek } from '../../assets/images/book-covers';

function StatAvatar({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 w-8 rounded-full border-2 border-white shadow -ml-2 first:ml-0"
    />
  );
}

function BookCard({ book }) {
  return (
    <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-xl p-3 shadow-sm">
      <img src={book.image} alt={book.title} className="h-16 w-12 object-cover rounded" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{book.title}</p>
        <p className="text-xs text-gray-500 truncate">{book.author}</p>
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2 w-2 rounded-full ${i < book.rating ? 'bg-accent' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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

            {/* Search + visitors */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-400">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 104.268 12.003l3.74 3.739a.75.75 0 101.06-1.06l-3.74-3.74A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your fav books"
                  className="ml-2 bg-transparent outline-none w-full placeholder-gray-400 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <StatAvatar src="https://i.pravatar.cc/80?img=12" alt="visitor 1" />
                  <StatAvatar src="https://i.pravatar.cc/80?img=32" alt="visitor 2" />
                  <StatAvatar src="https://i.pravatar.cc/80?img=48" alt="visitor 3" />
                </div>
                <div className="text-sm"><span className="font-semibold text-black">2500+</span> <span className="text-gray-500">Daily Visitors</span></div>
              </div>
            </div>

            {/* Quote card */}
            <div className="mt-10 bg-accent/90 text-white rounded-xl p-5 max-w-lg rotate-2 shadow">
              <p className="text-sm uppercase tracking-wide opacity-90">Quote from Shams Tabrizi</p>
              <p className="mt-2 text-base">
                "Every breath is a chance to reborn spiritually. But to be reborn into a new life, you have to die before dying."
              </p>
            </div>
          </div>

          {/* Right hero visuals */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative bg-gradient-to-b from-gray-100 to-white rounded-3xl p-4 md:p-6 shadow-inner overflow-hidden">
              <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
              <div className="relative rounded-2xl border border-gray-200 overflow-hidden">
                <img src={heroImage} alt="Reading illustration" className="w-full h-[320px] md:h-[420px] object-cover" />
              </div>

              {/* Books of the week */}
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-semibold text-black">
                  Books Of The <span className="text-accent">Week</span>
                </h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {booksOfTheWeek.map((b) => (
                    <BookCard key={b.title} book={b} />
                  ))}
                </div>
              </div>

              {/* Audiobooks CTA */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-black">
                    Enjoy Listening Audiobooks <span className="text-accent">Anywhere</span>
                  </h4>
                  <p className="text-gray-600 mt-1 text-sm">Books are magical. They can teach us, transport us, make us feel safe.</p>
                </div>
                <div className="md:justify-self-end">
                  <Link to="/register" className="inline-flex bg-primary hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg shadow">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;