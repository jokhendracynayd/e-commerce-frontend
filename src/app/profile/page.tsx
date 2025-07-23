'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import AddressForm from '@/components/address/AddressForm';
import AddressList from '@/components/address/AddressList';
import { Address } from '@/types/address';
import { WishlistItemWithProduct } from '@/types/wishlist';
import { Review, UpdateReviewRequest } from '@/types/review';
import { getUserAddresses } from '@/services/addressService';
import { reviewService } from '@/services/reviewService';
import WriteReviewModal from '@/components/review/WriteReviewModal';
import Image from 'next/image';
import { debounce } from 'lodash';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { isAuthenticated, user, logout, isLoading, fetchUserProfile } = useAuth();
  const { items: wishlistItems, loading: wishlistLoading, error: wishlistError, refreshWishlist, removeItem } = useWishlist();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Address management state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  
  // Reviews management state
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [genderInput, setGenderInput] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  
  const validateProfile = (): boolean => {
    const newErrors: { fullName?: string; phone?: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (phoneInput && !phoneRegex.test(phoneInput.trim())) {
      newErrors.phone = 'Enter a valid phone number (e.g. +1234567890)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const startEditingProfile = () => {
    setFullName(user?.name || '');
    setPhoneInput(user?.phone || '');
    setGenderInput(((user as any)?.gender as string) || '');
    setIsEditingProfile(true);
  };
  
  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
  };
  
  const saveProfileChanges = async () => {
    if (savingProfile) return;
    if (!validateProfile()) {
      return;
    }
    setSavingProfile(true);
    try {
      const [firstName, ...rest] = fullName.trim().split(' ');
      const payload = {
        firstName: firstName || undefined,
        lastName: rest.length ? rest.join(' ') : undefined,
        phone: "+91"+phoneInput.trim() || undefined,
        gender: genderInput || undefined,
      };
      await userService.updateProfile(payload);
      await fetchUserProfile();
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };
  
  // Effect to log wishlist rendering for debugging
  useEffect(() => {
    if (activeSection === 'wishlist') {
      console.log('Current wishlist items state:', wishlistItems.length, 'items');
    }
  }, [wishlistItems, activeSection]);
  
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
  
  // Fetch addresses when addresses section is active
  const fetchAddresses = useCallback(async () => {
    try {
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }, []);

  // Fetch user reviews when reviews section is active
  const fetchUserReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const response = await reviewService.getMyReviews();
      setUserReviews(response.data);
    } catch (error: any) {
      setReviewsError(error.message || 'Failed to fetch reviews');
      console.error('Error fetching user reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  // Fetch addresses when addresses section becomes active
  useEffect(() => {
    if (activeSection === 'addresses') {
      fetchAddresses();
    }
  }, [activeSection, fetchAddresses]);

  // Fetch reviews when reviews section becomes active
  useEffect(() => {
    if (activeSection === 'reviews') {
      fetchUserReviews();
    }
  }, [activeSection, fetchUserReviews]);

  // Simplified wishlist data fetching using context
  const fetchWishlistData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    console.log('Refreshing wishlist data via context...');
    await refreshWishlist();
  }, [isAuthenticated, refreshWishlist]);

  // Create a debounced version of fetchWishlistData
  const debouncedFetchWishlist = useRef(
    debounce(() => {
      fetchWishlistData();
    }, 300)
  ).current;
  
  // Check for section parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get('section');
      if (sectionParam) {
        setActiveSection(sectionParam);
        console.log('Setting active section from URL parameter:', sectionParam);
        
        // If the section is wishlist, trigger data fetch
        if (sectionParam === 'wishlist' && isAuthenticated) {
          console.log('Triggering wishlist data fetch from URL parameter');
          debouncedFetchWishlist();
        }
      }
      
      // Check for session storage flag indicating redirection from login
      const loadWishlistAfterLogin = sessionStorage.getItem('load_wishlist_after_login');
      if (loadWishlistAfterLogin === 'true' && isAuthenticated) {
        // Clear the flag
        sessionStorage.removeItem('load_wishlist_after_login');
        
        // Set active section to wishlist
        setActiveSection('wishlist');
        
        // Fetch wishlist data
        console.log('Loading wishlist data after login redirect');
        fetchWishlistData();
      }
    }
  }, [isAuthenticated, debouncedFetchWishlist, fetchWishlistData]);
  
  // Function to handle section changes with debouncing
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
    
    // Fetch wishlist data when switching to wishlist section
    if (section === 'wishlist') {
      debouncedFetchWishlist();
    }
  };
  
  // Fetch wishlist data when the component mounts or when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      // If we're on the wishlist section, fetch data immediately
      if (activeSection === 'wishlist') {
        console.log('Initial wishlist fetch due to authentication or section change');
        debouncedFetchWishlist();
      }
    }
    
    // Cleanup function to cancel any pending requests when unmounting
    return () => {
      debouncedFetchWishlist.cancel();
    };
  }, [activeSection, isAuthenticated, debouncedFetchWishlist]);
  
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
    // Refresh addresses after save
    fetchAddresses();
  };
  
  const handleAddressCancel = () => {
    setShowAddressForm(false);
    setAddressToEdit(null);
  };

  // Review handlers
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await reviewService.deleteReview(reviewId);
        setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      } catch (error: any) {
        alert('Failed to delete review: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleUpdateReview = async (reviewId: string, data: UpdateReviewRequest) => {
    try {
      const updatedReview = await reviewService.updateReview(reviewId, data);
      setUserReviews(prev => prev.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
      setShowEditModal(false);
      setEditingReview(null);
    } catch (error: any) {
      alert('Failed to update review: ' + (error.message || 'Unknown error'));
    }
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
            {/* Wishlist Section */}
            {activeSection === 'wishlist' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/20 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/30 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">My Wishlist</h2>
                  
                  <button 
                    onClick={() => fetchWishlistData()}
                    className="ml-auto p-2 text-sm text-[#ed875a] hover:bg-[#ed875a]/10 rounded-full flex items-center"
                    aria-label="Refresh wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-1">Refresh</span>
                  </button>
                </div>
                
                {/* Loading State */}
                {wishlistLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-pulse space-y-4 w-full">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="bg-gray-200 dark:bg-gray-700 h-24 w-24 rounded"></div>
                          <div className="ml-4 flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Error State */}
                {wishlistError && !wishlistLoading && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 text-center">
                    <p className="text-red-600 dark:text-red-400">{wishlistError}</p>
                    <button 
                      onClick={fetchWishlistData}
                      className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
                
                {/* Empty State */}
                {!wishlistLoading && !wishlistError && wishlistItems.length === 0 && (
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
                
                {/* Wishlist Items List */}
                {!wishlistLoading && !wishlistError && Array.isArray(wishlistItems) && wishlistItems.length > 0 && (
                  <div className="space-y-4">
                    {wishlistItems.map((item, index) => (
                      <div 
                        key={item.id || `wishlist-item-${index}`} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-[#ed875a]/30 dark:hover:border-[#ed875a]/20 flex flex-col sm:flex-row"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-32 mb-4 sm:mb-0 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-750">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]} 
                              alt={item.product.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 128px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Debug info */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs p-1 rounded">
                            ID: {item.id} | Product ID: {item.productId}
                          </div>
                        )}
                        
                        {/* Product Details */}
                        <div className="flex-1 sm:ml-4 flex flex-col">
                          <Link 
                            href={`/product/${item.product.slug}`}
                            className="text-base sm:text-lg font-medium text-gray-900 dark:text-white hover:text-[#ed875a] dark:hover:text-[#ed8c61] transition-colors duration-300 line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          
                          <div className="flex items-center mt-1 mb-2">
                            {item.product.brand && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                {item.product.brand}
                              </span>
                            )}
                            
                            {item.product.rating > 0 && (
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                  {item.product.rating} ({item.product.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center mt-auto">
                            {item.product.discountPercentage ? (
                              <div className="flex items-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white mr-2">
                                  ₹{(item.product.price - (item.product.price * item.product.discountPercentage / 100)).toFixed(0)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ₹{item.product.price}
                                </span>
                                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                  {item.product.discountPercentage}% OFF
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ₹{item.product.price}
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-4">
                            <Link 
                              href={`/product/${item.product.slug}`}
                              className="px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded transition-all duration-300 hover:shadow-md hover:shadow-[#ed875a]/20 flex-1 text-center"
                            >
                              View Details
                            </Link>
                            <button 
                              onClick={async () => {
                                try {
                                  const result = await removeItem(item.productId);
                                  if (result.success) {
                                    // Item is automatically removed from context state
                                    console.log('Item removed from wishlist successfully');
                                  } else if (result.error === 'Authentication required') {
                                    router.push('/login?returnUrl=/profile');
                                  } else {
                                    console.error('Failed to remove item:', result.error);
                                  }
                                } catch (error) {
                                  console.error('Error removing wishlist item:', error);
                                }
                              }}
                              className="px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Remove from wishlist"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Added Date */}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Added on {new Date(item.addedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Continue Shopping Button */}
                    <div className="flex justify-center mt-8">
                      <Link 
                        href="/products" 
                        className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-700 text-[#ed875a] dark:text-[#ed8c61] border border-[#ed875a]/30 dark:border-[#ed8c61]/30 rounded-md transition-all duration-300 hover:bg-[#ed875a]/5 dark:hover:bg-[#ed8c61]/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                )}
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
                            value={isEditingProfile ? fullName : user?.name || ''}
                            onChange={isEditingProfile ? (e) => setFullName(e.target.value) : undefined}
                            readOnly={!isEditingProfile}
                          />
                          {errors.fullName && (
                            <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                          )}
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
                            value={isEditingProfile ? phoneInput : (user?.phone || '')}
                            onChange={isEditingProfile ? (e) => setPhoneInput(e.target.value) : undefined}
                            readOnly={!isEditingProfile}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                          )}
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
                            value={isEditingProfile ? genderInput : (user?.gender || '')}
                            onChange={isEditingProfile ? (e) => setGenderInput(e.target.value) : undefined}
                            disabled={!isEditingProfile}
                          >
                            <option value="" disabled>Not specified</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
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
                      {isEditingProfile ? (
                        <>
                          <button
                            onClick={saveProfileChanges}
                            disabled={savingProfile || Object.keys(errors).length>0}
                            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {savingProfile ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={cancelEditingProfile}
                            disabled={savingProfile}
                            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-650"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={startEditingProfile}
                            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 transform hover:-translate-y-0.5 flex items-center"
                          >
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
                        </>
                      )}
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
                      {/* Address Limit Message */}
                      {addresses.length >= 3 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800 mb-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                              You've reached the maximum limit of 3 addresses. To add a new address, please delete an existing one first.
                            </p>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={addresses.length >= 3 ? undefined : handleAddNewAddress}
                        disabled={addresses.length >= 3}
                        className={`flex items-center p-3 rounded-md border border-dashed w-full sm:w-auto justify-center transition-all duration-300 ${
                          addresses.length >= 3 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60' 
                            : 'bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 hover:from-[#ed875a]/20 hover:to-[#ed8c61]/20 text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] border-[#ed875a]/30'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">
                          {addresses.length >= 3 ? 'Address limit reached (3/3)' : 'Add a new address'}
                        </span>
                      </button>
                    
                      <div className="mt-6">
                        <AddressList 
                          showAddNewButton={false}
                          emptyStateMessage="You don't have any saved addresses yet. Add your first address to make checkout faster."
                          onAddressChange={fetchAddresses}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* My Reviews Section */}
            {activeSection === 'reviews' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/20 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/30 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">My Reviews & Ratings</h2>
                  
                  <button 
                    onClick={() => fetchUserReviews()}
                    className="ml-auto p-2 text-sm text-[#ed875a] hover:bg-[#ed875a]/10 rounded-full flex items-center"
                    aria-label="Refresh reviews"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-1">Refresh</span>
                  </button>
                </div>

                {/* Loading State */}
                {reviewsLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-pulse space-y-4 w-full">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="bg-gray-200 dark:bg-gray-700 h-24 w-24 rounded"></div>
                          <div className="ml-4 flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error State */}
                {reviewsError && !reviewsLoading && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 text-center">
                    <p className="text-red-600 dark:text-red-400">{reviewsError}</p>
                    <button 
                      onClick={fetchUserReviews}
                      className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!reviewsLoading && !reviewsError && userReviews.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <div className="w-52 sm:w-64 h-52 sm:h-64 relative mb-6 sm:mb-8">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="relative">
                          {/* Review icon with stars */}
                          <div className="w-40 sm:w-48 h-32 sm:h-36 border-2 border-gray-200 dark:border-gray-600 shadow-md mx-auto bg-white dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r from-[#f5f1ed]/70 to-[#f5f1ed]/30 dark:from-gray-750/50 dark:to-gray-750/20 rounded-md flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#ed875a] opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                          </div>
                          {/* Stars around the review icon */}
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
                    </div>
                    <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-2">No Reviews Yet</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-xs text-center">Start reviewing products you've purchased to help other customers.</p>
                    <Link 
                      href="/orders" 
                      className="flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 transform hover:-translate-y-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      View Orders
                    </Link>
                  </div>
                )}

                {/* Reviews List */}
                {!reviewsLoading && !reviewsError && userReviews.length > 0 && (
                  <div className="space-y-4">
                    {userReviews.map((review) => (
                      <div 
                        key={review.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-[#ed875a]/30 dark:hover:border-[#ed875a]/20"
                      >
                        {/* Product Info */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start">
                            {review.product?.imageUrl && (
                              <div className="flex-shrink-0 w-16 h-16 mr-3 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-750">
                                <Image
                                  src={review.product.imageUrl} 
                                  alt={review.product.title || 'Product'}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                {review.product?.title || 'Product'}
                              </h3>
                              {review.isVerifiedPurchase && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 mt-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="p-2 text-xs text-[#ed875a] hover:bg-[#ed875a]/10 rounded-full transition-colors"
                              aria-label="Edit review"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-2 text-xs text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                              aria-label="Delete review"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {review.rating} out of 5 stars
                          </span>
                        </div>

                        {/* Review Title */}
                        {review.title && (
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {review.title}
                          </h4>
                        )}

                        {/* Review Comment */}
                        {review.comment && (
                          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {review.comment}
                          </p>
                        )}

                        {/* Review Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.helpfulCount > 0 && (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              {review.helpfulCount} found helpful
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Other sections would be similarly implemented */}
            {(activeSection !== 'wishlist' && activeSection !== 'profile' && activeSection !== 'addresses' && activeSection !== 'reviews') && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Edit Review Modal */}
        {showEditModal && editingReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Review</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingReview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const rating = parseInt(formData.get('rating') as string);
                  const title = formData.get('title') as string;
                  const comment = formData.get('comment') as string;
                  
                  handleUpdateReview(editingReview.id, {
                    rating: rating || editingReview.rating,
                    title: title || undefined,
                    comment: comment || undefined,
                  });
                }}
                className="space-y-4"
              >
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={star}
                          defaultChecked={star === editingReview.rating}
                          className="sr-only"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-yellow-400 hover:text-yellow-500 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingReview.title || ''}
                    placeholder="Give your review a title"
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    name="comment"
                    defaultValue={editingReview.comment || ''}
                    placeholder="Share your experience with this product"
                    rows={4}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingReview(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white rounded-md hover:shadow-md transition-all duration-300 text-sm"
                  >
                    Update Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 