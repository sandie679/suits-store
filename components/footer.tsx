'use client';

import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
       
        <div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Sandra Luxe Suits</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Redefining elegance and craftsmanship through timeless suit designs for the modern professional.
          </p>
        </div>

       
        <div>
          <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/products" className="hover:text-white transition">Shop</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
            <li><a href="/faq" className="hover:text-white transition">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wide">Customer Care</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/shipping" className="hover:text-white transition">Shipping & Returns</a></li>
            <li><a href="/policy" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white transition">Terms & Conditions</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wide">Follow Us</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" aria-label="Facebook" className="hover:text-white transition"><Facebook size={18} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition"><Twitter size={18} /></a>
          </div>

          <h3 className="text-sm font-semibold text-white mb-2 tracking-wide">Sign up for updates</h3>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm text-white border rounded-l-md focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-gray-200 transition"
            >
                Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Sandra Luxe Suits. All rights reserved.
      </div>
    </footer>
  );
}
