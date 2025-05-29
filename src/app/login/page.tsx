'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

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
      // Call the login function from AuthContext with either email or phone
      const loginIdentifier = loginMethod === 'email' ? formData.email : formData.phone;
      const success = await login(
        loginIdentifier,
        formData.password,
        formData.rememberMe
      );
      
      console.log('Login successful', formData);
      
      if (success) {
        router.push(returnUrl);
      } else {
        // Handle login failure
        setErrors({
          password: `Invalid ${loginMethod} or password`
        });
      }
      
    } catch (error) {
      console.error('Login failed', error);
      setErrors({
        password: 'An error occurred during login'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    // Clear errors when switching methods
    setErrors({});
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#f5f1ed] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-8 w-full max-w-md space-y-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
          {returnUrl && returnUrl !== '/' && (
            <p className="mt-2 text-sm text-[#d44506] dark:text-[#ed875a]">
              You&apos;ll be redirected back after login
            </p>
          )}
        </div>
        
        {/* Login method toggle */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
              loginMethod === 'email'
                ? 'text-[#ed875a] border-b-2 border-[#ed875a]'
                : 'text-gray-500 hover:text-[#ed875a]'
            }`}
            onClick={() => toggleLoginMethod('email')}
          >
            Login with Email
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
              loginMethod === 'phone'
                ? 'text-[#ed875a] border-b-2 border-[#ed875a]'
                : 'text-gray-500 hover:text-[#ed875a]'
            }`}
            onClick={() => toggleLoginMethod('phone')}
          >
            Login with Phone
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {loginMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent`}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-[#ed875a] hover:text-[#d44506]">
                  Forgot your password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-[#ed875a] border-gray-300 focus:ring-[#ed8c61]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white font-medium transition-all hover:shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-[#ed875a] hover:text-[#d44506]">
              Sign up
            </Link>
          </p>
        </div>

        {/* For testing purposes - skip login button */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">For testing purposes only:</p>
          <button
            onClick={() => router.push(returnUrl)}
            className="text-sm text-[#ed875a] hover:text-[#d44506] underline"
          >
            Skip login and continue
          </button>
        </div>
      </div>
    </div>
  );
} 