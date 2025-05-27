'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      const success = await signup(
        formData.name,
        formData.email,
        formData.password
      );
      
      console.log('Signup successful', formData);
      
      if (success) {
        // Redirect to login page after successful signup
        router.push('/login');
      } else {
        // Handle signup failure
        setErrors({
          email: 'Failed to create account. Email may already be in use.'
        });
      }
      
    } catch (error) {
      console.error('Signup failed', error);
      setErrors({
        email: 'An error occurred during registration'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-background">
      <div className="bg-white dark:bg-dark-background p-8 rounded-xl shadow-md max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground dark:text-dark-foreground">Create an account</h1>
          <p className="mt-2 text-muted dark:text-dark-muted">Join our community today</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-dark-foreground">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-border dark:border-dark-border'} rounded-md shadow-sm bg-white dark:bg-dark-background text-foreground dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-dark-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-border dark:border-dark-border'} rounded-md shadow-sm bg-white dark:bg-dark-background text-foreground dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground dark:text-dark-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-border dark:border-dark-border'} rounded-md shadow-sm bg-white dark:bg-dark-background text-foreground dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground dark:text-dark-foreground">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-border dark:border-dark-border'} rounded-md shadow-sm bg-white dark:bg-dark-background text-foreground dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
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
                  className="h-4 w-4 text-primary border-border dark:border-dark-border rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-foreground dark:text-dark-foreground">
                  I agree to the <Link href="/terms" className="text-primary hover:text-primary-dark">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
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
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted dark:text-dark-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 