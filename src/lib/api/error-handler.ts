import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// API error interface for consistent error handling
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  details?: any;
}

// API error response formats
interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
  errors?: Record<string, string[]>;
}

/**
 * Handles API errors in a consistent way
 * @param error The error object from axios
 * @returns Structured API error object
 */
export function handleApiError(error: any): ApiError {
  if (error.response) {
    // Server responded with an error status
    const { status, data } = error.response;
    
    // Handle our specific API response format
    let errorMessage: string;
    let errorDetails: any = null;
    let validationErrors: Record<string, string[]> | undefined;
    
    if (data) {
      // Format 1: { statusCode, message, error, path, timestamp }
      if (data.statusCode && data.message) {
        errorMessage = Array.isArray(data.message) 
          ? data.message.join('. ') 
          : data.message;
          
        validationErrors = data.errors;
      } 
      // Format 2: { data: { message, details }, message, code }
      else if (data.data && data.data.message) {
        errorMessage = data.data.message;
        errorDetails = data.data.details;
        validationErrors = data.data.errors;
      } 
      // Format 3: Simple message
      else if (data.message) {
        errorMessage = data.message;
        validationErrors = data.errors;
      } else {
        errorMessage = getDefaultErrorMessage(status);
      }
    } else {
      errorMessage = getDefaultErrorMessage(status);
    }
    
    return {
      status,
      message: errorMessage,
      code: data.code || data.error,
      errors: validationErrors,
      details: errorDetails,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Something else happened while setting up the request
    return {
      status: 0,
      message: error.message || 'An unknown error occurred',
    };
  }
}

/**
 * Returns a default error message based on HTTP status code
 */
export function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request contains invalid data';
    case 401:
      return 'Please login to continue';
    case 403:
      return 'You do not have permission to access this resource';
    case 404:
      return 'The requested resource was not found';
    case 409:
      return 'There was a conflict with the current state of the resource';
    case 422:
      return 'Validation error occurred';
    case 429:
      return 'Too many requests, please try again later';
    case 500:
      return 'An error occurred on the server. Please try again later';
    default:
      return `An error occurred (${status})`;
  }
}

/**
 * Display error toast notification
 * @param error The API error
 * @param defaultMessage Fallback message if error doesn't contain one
 */
export function showErrorToast(error: ApiError | any, defaultMessage = 'An error occurred'): void {
  const message = error.message || defaultMessage;
  toast.error(message);
}

/**
 * Logs API errors to console in development
 */
export function logApiError(error: AxiosError | any): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', error);
    
    if (error.response) {
      console.error('Response:', error.response.data);
    } else if (error.request) {
      console.error('Request:', error.request);
    }
  }
}

/**
 * Format validation errors for form libraries (e.g., react-hook-form)
 * @param apiError The API error object
 * @returns An object mapping field names to error messages
 */
export function formatValidationErrors(apiError?: ApiError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  if (apiError?.errors) {
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages as unknown as string;
    });
  }
  
  return formattedErrors;
} 