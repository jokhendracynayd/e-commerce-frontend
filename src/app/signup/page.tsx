'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
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
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Call the signup function from AuthContext
      const identifier = signupMethod === 'email' ? formData.email : formData.phone;
      const success = await signup(
        formData.name,
        identifier,
        formData.password
      );
      
      console.log('Signup successful', formData);
      
      if (success) {
        // Redirect to login page after successful signup
        router.push('/login');
      } else {
        // Handle signup failure
        if (signupMethod === 'email') {
          setErrors({
            email: 'Failed to create account. Email may already be in use.'
          });
        } else {
          setErrors({
            phone: 'Failed to create account. Phone number may already be in use.'
          });
        }
      }
      
    } catch (error) {
      console.error('Signup failed', error);
      setErrors({
        [signupMethod === 'email' ? 'email' : 'phone']: 'An error occurred during registration'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignupMethod = (method: SignupMethod) => {
    setSignupMethod(method);
    // Clear errors when switching methods
    setErrors({});
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#f5f1ed] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-8 w-full max-w-md space-y-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join our community today</p>
        </div>
        
        {/* Signup method toggle */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
              signupMethod === 'email'
                ? 'text-[#ed875a] border-b-2 border-[#ed875a]'
                : 'text-gray-500 hover:text-[#ed875a]'
            }`}
            onClick={() => toggleSignupMethod('email')}
          >
            Email Signup
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
              signupMethod === 'phone'
                ? 'text-[#ed875a] border-b-2 border-[#ed875a]'
                : 'text-gray-500 hover:text-[#ed875a]'
            }`}
            onClick={() => toggleSignupMethod('phone')}
          >
            Phone Signup
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {signupMethod === 'email' ? (
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#ed875a] border-gray-300 focus:ring-[#ed8c61]"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700 dark:text-gray-300">
                  I agree to the <Link href="/terms" className="text-[#ed875a] hover:text-[#d44506]">Terms of Service</Link> and <Link href="/privacy" className="text-[#ed875a] hover:text-[#d44506]">Privacy Policy</Link>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>
                )}
              </div>
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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#ed875a] hover:text-[#d44506]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 