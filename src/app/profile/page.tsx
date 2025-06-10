'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AddressForm from '@/components/address/AddressForm';
import AddressList from '@/components/address/AddressList';
import { Address } from '@/types/address';

export default function ProfilePage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Address management state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  
  // Check if we're on mobile to avoid unnecessary scrolling on desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Function to handle section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Only scroll on mobile devices after the state has updated
    if (isMobile) {
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }, 100);
    }
  };
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    // Only redirect if we're not in a loading state and user is definitely not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/profile');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Show loading state while checking authentication
  if (isLoading || (!isAuthenticated && isLoading)) {
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
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed] dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] border border-gray-100 dark:border-gray-700 max-w-md w-full">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">You need to be logged in to access this page.</p>
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
  
  // Address handlers
  const handleAddNewAddress = () => {
    setAddressToEdit(null);
    setShowAddressForm(true);
  };
  
  const handleEditAddress = (address: Address) => {
    setAddressToEdit(address);
    setShowAddressForm(true);
  };
  
  const handleAddressSave = (address: Address) => {
    setShowAddressForm(false);
    setAddressToEdit(null);
  };
  
  const handleAddressCancel = () => {
    setShowAddressForm(false);
    setAddressToEdit(null);
  };
  
  return (
    <div className="min-h-screen bg-[#f5f1ed] dark:bg-gray-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-5 sm:mb-6 md:mb-8 tracking-tight">My Account</h1>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-4 sm:p-5 mb-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ed875a]/20 to-[#ed8c61]/30 dark:from-[#ed875a]/30 dark:to-[#ed8c61]/40 flex items-center justify-center mr-4 shadow-inner">
                  <span className="text-[#d44506] dark:text-white text-xl font-semibold">
                    {user.initials}
                  </span>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Welcome back,</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-[#ed875a] dark:text-[#ed8c61] mt-0.5">Member since {new Date().getFullYear()}</div>
                </div>
              </div>
            </div>
            
            {/* Menu Section: Orders */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] mb-4 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <Link 
                href="/orders" 
                className="flex items-center justify-between p-4 sm:p-5 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 flex items-center justify-center mr-3 group-hover:bg-[#ed875a]/20 dark:group-hover:bg-[#ed875a]/30 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm sm:text-base">MY ORDERS</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-[#ed875a] transition-colors duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Menu Section: Account Settings */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] mb-4 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center p-4 sm:p-5 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium text-sm sm:text-base">ACCOUNT SETTINGS</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleSectionChange('profile')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'profile' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'profile' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Profile Information
                  </div>
                </button>
                <button
                  onClick={() => handleSectionChange('addresses')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'addresses' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'addresses' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Addresses
                  </div>
                </button>
                <button
                  onClick={() => handleSectionChange('pan')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'pan' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'pan' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PAN Card Information
                  </div>
                </button>
              </div>
            </div>
            
            {/* Menu Section: Payments */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] mb-4 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center p-4 sm:p-5 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="font-medium text-sm sm:text-base">PAYMENTS</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleSectionChange('giftcards')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'giftcards' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'giftcards' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <span>Gift Cards</span>
                    </div>
                    <span className="text-xs bg-[#ed875a]/10 text-[#d44506] dark:text-[#ed875a] px-2 py-0.5 rounded-full">₹0</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSectionChange('upi')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'upi' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'upi' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Saved UPI
                  </div>
                </button>
                <button
                  onClick={() => handleSectionChange('cards')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'cards' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'cards' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Saved Cards
                  </div>
                </button>
              </div>
            </div>
            
            {/* Menu Section: My Stuff */}
            <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] mb-4 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center p-4 sm:p-5 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <span className="font-medium text-sm sm:text-base">MY STUFF</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleSectionChange('coupons')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'coupons' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'coupons' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    My Coupons
                  </div>
                </button>
                <button
                  onClick={() => handleSectionChange('reviews')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'reviews' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'reviews' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    My Reviews & Ratings
                  </div>
                </button>
                <button
                  onClick={() => handleSectionChange('wishlist')}
                  className={`w-full text-left p-3 sm:p-4 pl-12 sm:pl-[3.25rem] text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#f5f1ed]/70 hover:to-[#f5f1ed]/30 dark:hover:from-gray-750/70 dark:hover:to-gray-750/30 transition-all duration-300 ${activeSection === 'wishlist' ? 'bg-gradient-to-r from-[#f5f1ed] to-[#f5f1ed]/60 dark:from-gray-750 dark:to-gray-750/60 text-[#ed875a] dark:text-[#ed8c61] border-l-4 border-[#ed875a] dark:border-[#ed8c61]' : ''}`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeSection === 'wishlist' ? 'text-[#ed875a] dark:text-[#ed8c61]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    My Wishlist
                  </div>
                </button>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 hover:from-[#ed875a]/20 hover:to-[#ed8c61]/20 dark:from-[#ed875a]/5 dark:to-[#ed8c61]/5 dark:hover:from-[#ed875a]/10 dark:hover:to-[#ed8c61]/10 text-[#d44506] dark:text-[#ed875a] font-medium py-3 px-4 rounded-lg border border-[#ed875a]/20 dark:border-[#ed875a]/10 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
          
          {/* Main Content Area */}
          <div ref={mainContentRef} className="flex-1 bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 rounded-lg">
            {/* Wishlist Empty State */}
            {activeSection === 'wishlist' && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="w-52 sm:w-64 h-52 sm:h-64 relative mb-6 sm:mb-8">
                  <div className="absolute top-0 left-0 w-full h-full">
                    {/* Computer with items around it */}
                    <div className="relative">
                      {/* Computer */}
                      <div className="w-40 sm:w-48 h-32 sm:h-36 border-2 border-gray-200 dark:border-gray-600 shadow-md mx-auto bg-white dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r from-[#f5f1ed]/70 to-[#f5f1ed]/30 dark:from-gray-750/50 dark:to-gray-750/20 rounded-md flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#ed875a] opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Stand */}
                      <div className="w-28 sm:w-32 h-5 sm:h-6 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-b-lg mx-auto"></div>
                      <div className="w-14 sm:w-16 h-2 bg-gray-300 dark:bg-gray-600 mx-auto rounded-b-lg"></div>
                    </div>
                    
                    {/* Items around the computer - with improved animations and effects */}
                    <div className="absolute top-0 right-8">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-br from-[#ed875a]/30 to-[#ed875a]/10 dark:from-[#ed875a]/40 dark:to-[#ed875a]/20 animate-pulse-gentle"></div>
                    </div>
                    <div className="absolute top-12 right-0">
                      <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gradient-to-br from-[#ed8c61]/30 to-[#ed8c61]/10 dark:from-[#ed8c61]/40 dark:to-[#ed8c61]/20 animate-pulse-gentle [animation-delay:0.5s]"></div>
                    </div>
                    <div className="absolute bottom-12 right-12">
                      <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-to-br from-[#d44506]/30 to-[#d44506]/10 dark:from-[#d44506]/40 dark:to-[#d44506]/20 animate-pulse-gentle [animation-delay:0.8s]"></div>
                    </div>
                    <div className="absolute top-6 left-6">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-br from-[#ed875a]/30 to-[#ed875a]/10 dark:from-[#ed875a]/40 dark:to-[#ed875a]/20 animate-pulse-gentle [animation-delay:1.2s]"></div>
                    </div>
                    <div className="absolute bottom-4 left-0">
                      <div className="w-9 sm:w-10 h-5 sm:h-6 rounded-full bg-gradient-to-br from-[#ed8c61]/30 to-[#ed8c61]/10 dark:from-[#ed8c61]/40 dark:to-[#ed8c61]/20 animate-pulse-gentle [animation-delay:0.3s]"></div>
                    </div>
                    <div className="absolute top-20 left-0">
                      <div className="w-5 sm:w-6 h-9 sm:h-10 rounded-full bg-gradient-to-br from-[#d44506]/30 to-[#d44506]/10 dark:from-[#d44506]/40 dark:to-[#d44506]/20 animate-pulse-gentle [animation-delay:1.5s]"></div>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-2">Your Wishlist is Empty</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-xs text-center">Save items you love for later and check for special offers.</p>
                <Link 
                  href="/products" 
                  className="flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Explore Products
                </Link>
              </div>
            )}
            
            {/* Profile Information */}
            {activeSection === 'profile' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/20 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/30 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Profile Information</h2>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-[#f5f1ed]/40 dark:bg-gray-750/30 rounded-lg p-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                        <div className="relative">
                          <input 
                            type="text"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                            defaultValue={user.name}
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                        <div className="relative">
                          <input 
                            type="email"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                            defaultValue={user.email}
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <input 
                            type="tel"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                            defaultValue="+91 9876543210"
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                        <div className="relative">
                          <select
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50 appearance-none"
                            defaultValue=""
                          >
                            <option value="" disabled>Not specified</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </select>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                    <div className="flex flex-wrap gap-4 mt-6">
                      <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 transform hover:-translate-y-0.5 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                      </button>
                      <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Change Password
                      </button>
                    </div>
                  </div>
                  
                  {/* Privacy & Notification Settings */}
                  <div className="bg-[#f5f1ed]/40 dark:bg-gray-750/30 rounded-lg p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white mb-4">Privacy & Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates about your orders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ed875a] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ed875a]"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Offers</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about discounts and sales</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ed875a] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ed875a]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Account Section */}
                  <div className="bg-[#d44506]/5 dark:bg-[#d44506]/10 border border-[#d44506]/20 rounded-lg p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-[#d44506] dark:text-[#ed875a] mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 ml-7">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <div className="ml-7">
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-5 py-2.5 bg-[#d44506] hover:bg-[#c13d05] text-white rounded-md transition-all duration-300 hover:shadow-lg flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Manage Addresses */}
            {activeSection === 'addresses' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/20 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/30 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Manage Addresses</h2>
                </div>

                <div className="bg-[#f5f1ed]/40 dark:bg-gray-750/30 rounded-lg p-5 sm:p-6 mb-6">
                  {showAddressForm ? (
                    <AddressForm 
                      initialAddress={addressToEdit || undefined}
                      onSave={handleAddressSave}
                      onCancel={handleAddressCancel}
                      buttonText={addressToEdit ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
                    />
                  ) : (
                    <>
                      <button 
                        onClick={handleAddNewAddress}
                        className="flex items-center p-3 bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 hover:from-[#ed875a]/20 hover:to-[#ed8c61]/20 text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] rounded-md border border-dashed border-[#ed875a]/30 w-full sm:w-auto justify-center transition-all duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">Add a new address</span>
                      </button>
                    
                      <div className="mt-6">
                        <AddressList 
                          showAddNewButton={false}
                          emptyStateMessage="You don't have any saved addresses yet. Add your first address to make checkout faster."
                        />
                      </div>
                    </>
                  )}
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