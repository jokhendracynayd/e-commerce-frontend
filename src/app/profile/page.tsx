'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/profile');
    }
  }, [isAuthenticated, router]);
  
  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow max-w-md w-full">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would call an API to delete the account
      logout();
      router.push('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-80">
            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-200 dark:bg-yellow-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 font-medium">
                    {user.initials}
                  </span>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">Hello,</div>
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                </div>
              </div>
            </div>
            
            {/* Menu Section: Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm mb-4">
              <Link 
                href="/orders" 
                className="flex items-center justify-between p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="font-medium">MY ORDERS</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Menu Section: Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm mb-4">
              <div className="flex items-center p-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">ACCOUNT SETTINGS</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'profile' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveSection('addresses')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'addresses' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  Manage Addresses
                </button>
                <button
                  onClick={() => setActiveSection('pan')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'pan' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  PAN Card Information
                </button>
              </div>
            </div>
            
            {/* Menu Section: Payments */}
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm mb-4">
              <div className="flex items-center p-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium">PAYMENTS</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('giftcards')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'giftcards' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span>Gift Cards</span>
                    <span className="text-green-600">₹0</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('upi')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'upi' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  Saved UPI
                </button>
                <button
                  onClick={() => setActiveSection('cards')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'cards' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  Saved Cards
                </button>
              </div>
            </div>
            
            {/* Menu Section: My Stuff */}
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm mb-4">
              <div className="flex items-center p-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="font-medium">MY STUFF</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('coupons')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'coupons' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  My Coupons
                </button>
                <button
                  onClick={() => setActiveSection('reviews')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'reviews' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  My Reviews & Ratings
                </button>
                <button
                  onClick={() => setActiveSection('wishlist')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 ${activeSection === 'wishlist' ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  My Wishlist
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left p-4 pl-12 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-md shadow-sm p-6">
            {/* Wishlist Empty State */}
            {activeSection === 'wishlist' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-64 h-64 relative mb-6">
                  <div className="absolute top-0 left-0 w-full h-full">
                    {/* Computer with items around it */}
                    <div className="relative">
                      {/* Computer */}
                      <div className="w-48 h-36 border-2 border-gray-300 dark:border-gray-600 rounded-md mx-auto bg-white dark:bg-gray-700 flex items-center justify-center">
                        <div className="w-24 h-24 border border-gray-200 dark:border-gray-500 rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Stand */}
                      <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 mx-auto rounded-b-md"></div>
                      <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 mx-auto rounded-b-md"></div>
                    </div>
                    
                    {/* Items around the computer */}
                    <div className="absolute top-0 right-8">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md animate-pulse"></div>
                    </div>
                    <div className="absolute top-12 right-0">
                      <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-md animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-12 right-12">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-md animate-pulse"></div>
                    </div>
                    <div className="absolute top-6 left-6">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-4 left-0">
                      <div className="w-10 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-md animate-pulse"></div>
                    </div>
                    <div className="absolute top-20 left-0">
                      <div className="w-6 h-10 bg-red-100 dark:bg-red-900 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Empty Wishlist</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You have no items in your wishlist. Start adding!</p>
                <Link href="/products" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  Browse Products
                </Link>
              </div>
            )}
            
            {/* Profile Information */}
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        defaultValue={user.name}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        defaultValue={user.email}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                      <input 
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        defaultValue="+91 9876543210"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        defaultValue="Not specified"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                      Edit Profile
                    </button>
                  </div>
                  
                  {/* Delete Account Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-3">Delete Account</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Manage Addresses */}
            {activeSection === 'addresses' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Manage Addresses</h2>
                <div className="mb-6">
                  <button className="flex items-center text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add a new address
                  </button>
                </div>
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-md mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white mr-2">{user.name}</h3>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">Home</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">123 Main Street, Apartment 4B</p>
                      <p className="text-gray-600 dark:text-gray-400">Mumbai, Maharashtra - 400001</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Phone: +91 9876543210</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 dark:text-blue-400">Edit</button>
                      <button className="text-red-600 dark:text-red-400">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other sections would be similarly implemented */}
            {(activeSection !== 'wishlist' && activeSection !== 'profile' && activeSection !== 'addresses') && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 