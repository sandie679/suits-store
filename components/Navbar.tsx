'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session,  } = useSession();

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-900 shadow-2xl sticky top-0 z-50 border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <Image
                src="/logo.png"
                alt="Suits Store Logo"
                width={140}
                height={140}
                className="transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
              />
            </Link>
          </div>

       
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/5">
              Home
            </Link>
            <Link href="/trending" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/5">
              Trending
            </Link>
            <Link href="/cart" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/5">
              Wedding
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/5">
              Womenswear
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/5">
              Menswear
            </Link>
          </div>

        
          <div className="hidden md:flex items-center space-x-4">
           
            <button className="text-gray-300 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

         
            <Link href="/cart" className="text-gray-300 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition-all duration-300 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            
             
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm hover:bg-amber-600 transition-all duration-300"
                >
                  {session.user?.name?.charAt(0).toUpperCase()}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                    <button
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signup" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25">
                <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Sign Up
              </Link>
            )}
          </div>

        
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

   
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900 border-t border-gray-700">
            <Link href="/" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium transition duration-200">
              Home
            </Link>
            <Link href="/product" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium transition duration-200">
              Shop
            </Link>
            <Link href="/cart" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium transition duration-200">
              Cart
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium transition duration-200">
              Profile
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium transition duration-200">
              Admin
            </Link>
       
            <div className="flex items-center space-x-4 py-2">
              <button className="text-gray-300 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              <Link href="/cart" className="text-gray-300 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition-all duration-300 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </Link>
            </div>
            <div className="pt-2">
              {session ? (
                <div className="text-center space-y-2">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm mx-auto hover:bg-amber-600 transition-all duration-300"
                  >
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2 w-full bg-slate-800 rounded-md shadow-lg py-1 border border-gray-700">
                      <button
                        onClick={() => {
                          signOut();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/signup" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25 block text-center">
                  <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}