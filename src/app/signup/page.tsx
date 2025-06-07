'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

type SignupMethod = 'email' | 'phone';

export default function SignupPage() {
  const [signupMethod, setSignupMethod] = useState<SignupMethod>('email');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (signupMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Enter a valid 10-digit phone number';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Use the updated signup function 
      let success = false;
      
      if (signupMethod === 'email') {
        success = await signup(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password
        );
      } else {
        // For phone signup, we're not supporting it yet through the API
        toast.error('Phone registration is not currently supported');
        setIsLoading(false);
        return;
      }
      
      if (success) {
        // Set success state to trigger UI feedback
        setIsSuccess(true);
        
        // Success message is already shown from the AuthContext
        
        // Delay redirect to allow success UI to be visible
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // If signup returns false, it means there was an error
        // Error toast is already shown from the AuthContext
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Signup failed', error);
      toast.error('Registration failed. Please try again later.');
      setIsLoading(false);
    }
  };

  const toggleSignupMethod = (method: SignupMethod) => {
    setSignupMethod(method);
    // Clear errors when switching methods
    setErrors({});
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#f5f1ed] dark:bg-gray-900 bg-gradient-to-b from-[#f5f1ed] to-[#f9f7f5] dark:from-gray-900 dark:to-gray-800">
      <div 
        className={`bg-white dark:bg-gray-800 shadow-[0_8px_30px_-4px_rgba(237,135,90,0.15)] rounded-lg p-5 sm:p-6 md:p-8 w-full max-w-md space-y-6 sm:space-y-7 md:space-y-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-300 ${
          isSuccess ? 'transform scale-[0.98] opacity-90' : ''
        }`}
      >
        {/* Decorative element */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#ed875a]/10 to-[#ed8c61]/5 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/10"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-tr from-[#ed875a]/10 to-[#ed8c61]/5 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/10"></div>
        
        <div className="text-center relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Create an account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Join our community today</p>
        </div>
        
        {/* Success overlay that appears when signup is successful */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fadeIn">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Registration Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Your account has been created.<br />Redirecting to login...
            </p>
          </div>
        )}
        
        {/* Signup method toggle */}
        <div className="flex p-1 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700 relative">
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-md transition-all duration-300 ${
              signupMethod === 'email'
                ? 'bg-white dark:bg-gray-700 text-[#ed875a] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#ed875a] hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => toggleSignupMethod('email')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Email Signup
            </span>
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-md transition-all duration-300 ${
              signupMethod === 'phone'
                ? 'bg-white dark:bg-gray-700 text-[#ed875a] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#ed875a] hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => toggleSignupMethod('phone')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Phone Signup
            </span>
          </button>
        </div>
        
        <form className="mt-6 sm:mt-7 space-y-5 sm:space-y-6 relative" onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-5">
            {/* First and Last name - side by side for larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full px-3.5 py-2.5 text-gray-900 dark:text-white border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-[#ed875a]/60 focus:border-[#ed875a] dark:bg-gray-700/50`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              
              <div className="group">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full px-3.5 py-2.5 text-gray-900 dark:text-white border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-[#ed875a]/60 focus:border-[#ed875a] dark:bg-gray-700/50`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Email or Phone based on selected method */}
            {signupMethod === 'email' ? (
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full px-3.5 py-2.5 text-gray-900 dark:text-white border ${
                    errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-[#ed875a]/60 focus:border-[#ed875a] dark:bg-gray-700/50`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            ) : (
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full px-3.5 py-2.5 text-gray-900 dark:text-white border ${
                    errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-[#ed875a]/60 focus:border-[#ed875a] dark:bg-gray-700/50`}
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            )}
            
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-3.5 py-2.5 text-gray-900 dark:text-white border ${
                    errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-[#ed875a]/60 focus:border-[#ed875a] dark:bg-gray-700/50`}
                  placeholder="••••••••"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-[#ed875a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-[#ed875a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
              )}
              {!errors.password && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters with a number, uppercase, and lowercase letter
                </p>
              )}
            </div>
            
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-3.5 py-2.5 text-gray-900 dark:text-white border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } rounded-md shadow-sm focus:ring-[#ed875a]/60 focus:border-[#ed875a] dark:bg-gray-700/50`}
                  placeholder="••••••••"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                  onClick={toggleConfirmPasswordVisibility}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-[#ed875a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-[#ed875a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-[#ed875a] border-gray-300 rounded focus:ring-[#ed875a]/60"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-gray-600 dark:text-gray-400">
                I agree to the <a href="#" className="text-[#ed875a] hover:text-[#d57950]">Terms of Service</a> and <a href="#" className="text-[#ed875a] hover:text-[#d57950]">Privacy Policy</a>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSuccess 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-[#ed875a] hover:bg-[#d57950]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed875a]/60 ${
                (isLoading || isSuccess) ? 'opacity-70 cursor-not-allowed' : ''
              } transition-all duration-300`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your account...
                </>
              ) : isSuccess ? (
                <>
                  <svg className="animate-pulse -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Account Created!
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#ed875a] hover:text-[#d57950] font-medium">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 