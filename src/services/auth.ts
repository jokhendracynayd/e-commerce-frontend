import { User } from '@/types';

// Mock users for development
const mockUsers: Record<string, User> = {
  'user1@example.com': {
    id: 'user1',
    name: 'John Doe',
    email: 'user1@example.com',
    role: 'user',
    tenantId: 'tenant1'
  },
  'admin@example.com': {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    tenantId: 'tenant1'
  }
};

/**
 * Login a user with email and password
 */
export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  // In a real app, this would make an API request to authenticate
  // For development, we'll just check against our mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers[email];
  
  if (!user) {
    return null;
  }
  
  // In a real app, we would validate the password against a hash
  // For development, we'll accept any password
  
  // Generate a fake token
  const token = `fake-token-${Math.random().toString(36).substring(2)}`;
  
  return {
    user,
    token
  };
}

/**
 * Register a new user
 */
export async function register(name: string, email: string, password: string, tenantId: string): Promise<{ user: User; token: string } | null> {
  // In a real app, this would make an API request to create a user
  // For development, we'll just add to our mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  if (mockUsers[email]) {
    return null;
  }
  
  const newUser: User = {
    id: `user-${Math.random().toString(36).substring(2)}`,
    name,
    email,
    role: 'user',
    tenantId
  };
  
  // In a real app, we would hash the password before storing
  
  // Add to mock data
  mockUsers[email] = newUser;
  
  // Generate a fake token
  const token = `fake-token-${Math.random().toString(36).substring(2)}`;
  
  return {
    user: newUser,
    token
  };
}

/**
 * Get the current user from a token
 */
export async function getCurrentUser(token: string): Promise<User | null> {
  // In a real app, this would validate the token and return the user
  // For development, we'll return a mock user
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if token is valid
  if (!token.startsWith('fake-token-')) {
    return null;
  }
  
  // Return a default user for development
  return mockUsers['user1@example.com'];
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  // In a real app, this would invalidate the token on the server
  // For development, we'll just simulate an API call
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear local storage/cookies would be handled by the calling code
} 