import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      {/* <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/5 dark:to-blue-500/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get the latest news, promotions and exclusive offers sent directly to your inbox.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-grow focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> */}
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">E-Commerce</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              A modern multi-tenant e-commerce platform designed to help businesses of all sizes thrive in the digital marketplace.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-5">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products/new" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products/bestsellers" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-5">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  123 Commerce St, Business City, 90210
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">info@example.com</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  Mon-Fri: 9AM - 6PM<br />
                  Sat: 10AM - 4PM<br />
                  Sun: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Payment Methods & Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <img src="https://cdn.jsdelivr.net/gh/greghub/payment-svg-icons/svg/visa.svg" alt="Visa" className="h-8 w-auto bg-white dark:bg-gray-800 p-1 rounded" />
              <img src="https://cdn.jsdelivr.net/gh/greghub/payment-svg-icons/svg/mastercard.svg" alt="Mastercard" className="h-8 w-auto bg-white dark:bg-gray-800 p-1 rounded" />
              <img src="https://cdn.jsdelivr.net/gh/greghub/payment-svg-icons/svg/amex.svg" alt="American Express" className="h-8 w-auto bg-white dark:bg-gray-800 p-1 rounded" />
              <img src="https://cdn.jsdelivr.net/gh/greghub/payment-svg-icons/svg/paypal.svg" alt="PayPal" className="h-8 w-auto bg-white dark:bg-gray-800 p-1 rounded" />
              <img src="https://cdn.jsdelivr.net/gh/greghub/payment-svg-icons/svg/apple-pay.svg" alt="Apple Pay" className="h-8 w-auto bg-white dark:bg-gray-800 p-1 rounded" />
            </div>
            
            <div className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
              <div className="flex gap-4 mt-2 justify-center md:justify-end">
                <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 