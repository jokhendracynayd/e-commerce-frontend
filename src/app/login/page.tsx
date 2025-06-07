'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

type LoginMethod = 'email' | 'phone';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{email?: string, phone?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/';
  const { login } = useAuth();

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
    const newErrors: {email?: string, phone?: string, password?: string} = {};
    
    if (loginMethod === 'email') {
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Only support email login for now
      let success = false;
      
      if (loginMethod === 'email') {
        success = await login(
          formData.email,
          formData.password,
          formData.rememberMe
        );
      } else {
        // Phone login not supported yet
        toast.error('Phone login is not currently supported');
        setIsLoading(false);
        return;
      }
      
      if (success) {
        // Set success state
        setIsSuccess(true);
        
        // Show success toast (already handled in AuthContext)
        
        // Delay redirect for visual feedback
        setTimeout(() => {
          router.push(returnUrl);
        }, 1500);
      } else {
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Login failed', error);
      setErrors({
        password: 'An error occurred during login'
      });
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    // Clear errors when switching methods
    setErrors({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Sign in to your account</p>
          {returnUrl && returnUrl !== '/' && (
            <div className="mt-2 text-sm inline-flex items-center text-[#d44506] dark:text-[#ed875a] bg-[#ed875a]/5 dark:bg-[#ed875a]/10 py-1 px-2.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You&apos;ll be redirected back after login</span>
            </div>
          )}
        </div>
        
        {/* Success overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fadeIn">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Login Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Welcome back.<br />Redirecting you now...
            </p>
          </div>
        )}
        
        {/* Login method toggle */}
        <div className="flex p-1 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700 relative">
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-md transition-all duration-300 ${
              loginMethod === 'email'
                ? 'bg-white dark:bg-gray-700 text-[#ed875a] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#ed875a] hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => toggleLoginMethod('email')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Login with Email
            </span>
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-md transition-all duration-300 ${
              loginMethod === 'phone'
                ? 'bg-white dark:bg-gray-700 text-[#ed875a] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#ed875a] hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => toggleLoginMethod('phone')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Login with Phone
            </span>
          </button>
        </div>
        
        <form className="mt-6 sm:mt-7 space-y-5 sm:space-y-6 relative" onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-5">
            {loginMethod === 'email' ? (
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-2.5 sm:py-3 border ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 group-hover:border-[#ed875a]/60'} 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-colors duration-200`}
                    placeholder="your@email.com"
                  />
                  {errors.email ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : null}
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
            ) : (
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-2.5 sm:py-3 border ${errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 group-hover:border-[#ed875a]/60'} 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-colors duration-200`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : null}
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>
            )}
            
            <div className="group">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-[#ed875a] hover:text-[#d44506] hover:underline underline-offset-2 transition-all">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 block w-full px-4 py-2.5 sm:py-3 border ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 group-hover:border-[#ed875a]/60'} 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-colors duration-200`}
                  placeholder="••••••••"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-[#ed875a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-[#ed875a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </div>
                {errors.password && !errors.email && !errors.phone ? (
                  <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : null}
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
            
            <div className="flex items-center bg-gray-50 dark:bg-gray-750/50 p-2.5 rounded-md group hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-500 text-[#ed875a] focus:ring-[#ed8c61]/50 focus:ring-offset-0 transition-colors duration-200"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700 dark:text-gray-300 select-none">
                Remember me
              </label>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] rounded-md blur-lg opacity-30 dark:opacity-20 transition-opacity duration-300 group-hover:opacity-40"></div>
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full flex justify-center items-center py-3 md:py-3.5 px-4 ${
                isSuccess
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gradient-to-r from-[#ed875a] to-[#ed8c61]'
              } text-white font-medium rounded-md shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/30 dark:hover:shadow-[#ed875a]/20 hover:-translate-y-0.5 ${
                (isLoading || isSuccess) ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-base">Signing in...</span>
                </>
              ) : isSuccess ? (
                <>
                  <svg className="animate-pulse -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base">Login Success!</span>
                </>
              ) : (
                <span className="text-base">Sign in</span>
              )}
            </button>
          </div>
        </form>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-[#ed875a] hover:text-[#d44506] inline-flex items-center transition-all underline-offset-2 hover:underline">
                Sign up
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </p>
          </div>
          
          <div className="mt-5 flex items-center justify-center">
            <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Secure Login</span>
              <span>•</span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>

        {/* For testing purposes - skip login button */}
        <div className="text-center mt-6 pt-5 border-t border-dashed border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-750 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400">For testing purposes only</p>
          </div>
          <button
            onClick={() => router.push(returnUrl)}
            className="mt-2 text-sm text-[#ed875a] hover:text-[#d44506] flex items-center justify-center mx-auto group"
          >
            <span className="underline-offset-2 group-hover:underline">Skip login and continue</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 