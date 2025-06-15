import { toast } from 'react-hot-toast';
import { axiosClient } from '@/lib/api/axios-client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/api/error-handler';
import { PAYMENT_CONFIG } from '@/config/constants';
import { UpiApp, UpiPaymentData, UpiPaymentResponse } from '@/types';

// Export constants from PAYMENT_CONFIG for consistency
export const UPI_APPS = PAYMENT_CONFIG.upiApps;

/**
 * Generate a UPI payment intent
 * @param paymentData UPI payment data
 * @returns UPI payment response with relevant data for completing the payment
 */
export const generateUpiPaymentIntent = async (paymentData: UpiPaymentData): Promise<UpiPaymentResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINTS.PAYMENTS.UPI.GENERATE, paymentData);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error generating UPI payment:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Verify UPI payment status
 * @param transactionId Transaction ID to check
 * @returns Payment status response
 */
export const checkUpiPaymentStatus = async (transactionId: string): Promise<UpiPaymentResponse> => {
  try {
    const response = await axiosClient.get(ENDPOINTS.PAYMENTS.UPI.STATUS(transactionId));
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error checking UPI payment status:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Generate a UPI deep link based on the UPI app
 * @param app UPI app name
 * @param upiUri The UPI URI string
 * @returns Deep link URL
 */
export const generateUpiDeepLink = (app: string, upiUri: string): string => {
  switch (app) {
    case UpiApp.GOOGLE_PAY:
      return `gpay://upi/pay?${upiUri}`;
    case UpiApp.PHONE_PE:
      return `phonepe://pay?${upiUri}`;
    case UpiApp.PAYTM:
      return `paytmmp://pay?${upiUri}`;
    case UpiApp.BHARAT_PE:
      return `bharatpe://pay?${upiUri}`;
    default:
      return `upi://pay?${upiUri}`;
  }
};

/**
 * Create a UPI payment URL for mobile and desktop
 * @param data UPI data parameters
 * @returns UPI payment URL string
 */
export const createUpiPaymentUrl = (data: { 
  vpa: string;
  name: string;
  amount: string;
  transactionId: string;
  message?: string;
}): string => {
  const params = new URLSearchParams();
  params.append('pa', data.vpa); // Payee address (UPI ID)
  params.append('pn', data.name); // Payee name
  params.append('am', data.amount); // Amount
  params.append('tr', data.transactionId); // Transaction ID
  params.append('cu', 'INR'); // Currency
  
  if (data.message) {
    params.append('tn', data.message); // Transaction note
  }
  
  return `upi://pay?${params.toString()}`;
};

/**
 * Parse a UPI payment callback response
 * @param queryString Query string from UPI callback
 * @returns Parsed UPI response
 */
export const parseUpiCallbackResponse = (queryString: string): Record<string, string> => {
  const searchParams = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  
  return result;
}; 