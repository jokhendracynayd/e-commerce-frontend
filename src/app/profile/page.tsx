'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed] dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] border border-gray-100 dark:border-gray-700 max-w-md w-full">
          <div className="animate-pulse flex space-x-4">
            <div className="bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-5/6"></div>
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
    <div className="min-h-screen bg-[#f5f1ed] dark:bg-gray-900 py-4 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-80">
            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-4 mb-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#ed875a]/20 dark:bg-[#ed875a]/30 flex items-center justify-center mr-3">
                  <span className="text-[#d44506] dark:text-white font-medium">
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
            <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] mb-4 border border-gray-100 dark:border-gray-700">
              <Link 
                href="/orders" 
                className="flex items-center justify-between p-4 text-gray-700 dark:text-gray-300 hover:bg-[#f5f1ed] dark:hover:bg-gray-750"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] mb-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center p-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">ACCOUNT SETTINGS</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'profile' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveSection('addresses')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'addresses' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  Manage Addresses
                </button>
                <button
                  onClick={() => setActiveSection('pan')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'pan' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  PAN Card Information
                </button>
              </div>
            </div>
            
            {/* Menu Section: Payments */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] mb-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center p-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium">PAYMENTS</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('giftcards')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'giftcards' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span>Gift Cards</span>
                    <span className="text-[#d44506]">₹0</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('upi')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'upi' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  Saved UPI
                </button>
                <button
                  onClick={() => setActiveSection('cards')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'cards' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  Saved Cards
                </button>
              </div>
            </div>
            
            {/* Menu Section: My Stuff */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] mb-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center p-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="font-medium">MY STUFF</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('coupons')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'coupons' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  My Coupons
                </button>
                <button
                  onClick={() => setActiveSection('reviews')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'reviews' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  My Reviews & Ratings
                </button>
                <button
                  onClick={() => setActiveSection('wishlist')}
                  className={`w-full text-left p-4 pl-12 text-gray-600 dark:text-gray-400 hover:bg-[#f5f1ed] dark:hover:bg-gray-750 ${activeSection === 'wishlist' ? 'bg-[#f5f1ed] dark:bg-gray-750 text-[#ed875a] dark:text-[#ed8c61]' : ''}`}
                >
                  My Wishlist
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left p-4 pl-12 text-[#d44506] dark:text-[#ed875a] hover:bg-[#f5f1ed] dark:hover:bg-gray-750"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-6 border border-gray-100 dark:border-gray-700">
            {/* Wishlist Empty State */}
            {activeSection === 'wishlist' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-64 h-64 relative mb-6">
                  <div className="absolute top-0 left-0 w-full h-full">
                    {/* Computer with items around it */}
                    <div className="relative">
                      {/* Computer */}
                      <div className="w-48 h-36 border-2 border-gray-300 dark:border-gray-600 mx-auto bg-white dark:bg-gray-700 flex items-center justify-center">
                        <div className="w-24 h-24 border border-gray-200 dark:border-gray-500 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Stand */}
                      <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 mx-auto"></div>
                      <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 mx-auto"></div>
                    </div>
                    
                    {/* Items around the computer */}
                    <div className="absolute top-0 right-8">
                      <div className="w-8 h-8 bg-[#ed875a]/20 dark:bg-[#ed875a]/30 animate-pulse"></div>
                    </div>
                    <div className="absolute top-12 right-0">
                      <div className="w-6 h-6 bg-[#ed8c61]/20 dark:bg-[#ed8c61]/30 animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-12 right-12">
                      <div className="w-10 h-10 bg-[#d44506]/20 dark:bg-[#d44506]/30 animate-pulse"></div>
                    </div>
                    <div className="absolute top-6 left-6">
                      <div className="w-8 h-8 bg-[#ed875a]/20 dark:bg-[#ed875a]/30 animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-4 left-0">
                      <div className="w-10 h-6 bg-[#ed8c61]/20 dark:bg-[#ed8c61]/30 animate-pulse"></div>
                    </div>
                    <div className="absolute top-20 left-0">
                      <div className="w-6 h-10 bg-[#d44506]/20 dark:bg-[#d44506]/30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Empty Wishlist</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You have no items in your wishlist. Start adding!</p>
                <Link href="/products" className="px-6 py-2 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white transition-all hover:shadow-lg">
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                        defaultValue={user.name}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                        defaultValue={user.email}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                      <input 
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                        defaultValue="+91 9876543210"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                        defaultValue="Not specified"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="px-4 py-2 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white transition-all hover:shadow-lg">
                      Edit Profile
                    </button>
                  </div>
                  
                  {/* Delete Account Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-[#d44506] dark:text-[#ed875a] mb-3">Delete Account</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-[#d44506] hover:bg-[#c13d05] text-white transition-all hover:shadow-lg"
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
                  <button className="flex items-center text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add a new address
                  </button>
                </div>
                <div className="p-6 border border-gray-200 dark:border-gray-700 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white mr-2">{user.name}</h3>
                        <span className="px-2 py-1 bg-[#f5f1ed] dark:bg-[#ed875a]/10 text-gray-600 dark:text-gray-300 text-xs">Home</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">123 Main Street, Apartment 4B</p>
                      <p className="text-gray-600 dark:text-gray-400">Mumbai, Maharashtra - 400001</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Phone: +91 9876543210</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-[#ed875a] hover:text-[#d44506]">Edit</button>
                      <button className="text-[#d44506] hover:text-[#c13d05]">Remove</button>
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