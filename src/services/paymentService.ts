import { PaymentMethod, PaymentMethodConfig } from '@/types/payment';

// Default payment methods when API is not available
const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely using your credit or debit card',
    isActive: true,
    requiresAdditionalInfo: true,
    displayOrder: 1,
    badges: [
      { text: 'Secure', type: 'success' }
    ]
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay using your preferred UPI app',
    isActive: true,
    requiresAdditionalInfo: true,
    displayOrder: 2,
    badges: [
      { text: 'Instant', type: 'info' }
    ]
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives at your doorstep',
    isActive: true,
    requiresAdditionalInfo: true,
    displayOrder: 3,
    badges: [
      { text: 'Available', type: 'success' }
    ]
  }
];

/**
 * Get available payment methods from API
 * @returns Array of payment methods
 */
export const getAvailablePaymentMethods = async (): Promise<PaymentMethod[]> => {
  // In a production environment, this would fetch from an API
  // For now, we'll simulate an API call with a delay
  try {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, replace this with actual API call:
    // const response = await fetch('/api/payments/methods');
    // const data = await response.json();
    // return data.methods;
    
    return DEFAULT_PAYMENT_METHODS;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return DEFAULT_PAYMENT_METHODS; // Fallback to default methods
  }
};

/**
 * Get detailed configuration for a specific payment method
 * @param methodId Payment method ID
 * @returns Payment method configuration
 */
export const getPaymentMethodConfig = async (methodId: string): Promise<PaymentMethodConfig | null> => {
  // In a production environment, this would fetch from an API
  // For now, we'll simulate an API call with a delay
  try {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In production, replace with actual API call:
    // const response = await fetch(`/api/payments/methods/${methodId}`);
    // const data = await response.json();
    // return data;
    
    // For now, return a mock configuration
    const method = DEFAULT_PAYMENT_METHODS.find(m => m.id === methodId);
    if (!method) return null;
    
    // Return a mock config
    return {
      method,
      fields: [], // This would be populated from the API
      processor: {
        processorId: methodId === 'card' ? 'stripe' : methodId === 'upi' ? 'razorpay' : 'internal',
        testMode: true
      }
    };
  } catch (error) {
    console.error(`Error fetching configuration for payment method ${methodId}:`, error);
    return null;
  }
};

/**
 * Process a payment using the specified method
 * @param methodId Payment method ID
 * @param data Payment data
 * @param orderId Order ID
 * @returns Success status and transaction details
 */
export const processPayment = async (
  methodId: string, 
  data: Record<string, string>, 
  orderId: string
): Promise<{ success: boolean; transactionId?: string; message?: string }> => {
  // In a production environment, this would call a payment processor API
  // For now, we'll simulate an API call with a delay
  try {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would be a real payment processing call:
    // const response = await fetch('/api/payments/process', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ methodId, data, orderId })
    // });
    // return await response.json();
    
    // For now, simulate a successful payment
    return {
      success: true,
      transactionId: `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      message: 'Payment processed successfully'
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      message: 'Payment processing failed. Please try again.'
    };
  }
};

/**
 * Save payment method for future use
 * @param methodId Payment method ID
 * @param data Payment method data
 * @returns Success status
 */
export const savePaymentMethod = async (
  methodId: string,
  data: Record<string, string>
): Promise<{ success: boolean; message?: string }> => {
  // In production, this would save the payment method to the user's account
  try {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, this would be a real API call:
    // const response = await fetch('/api/user/payment-methods', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ methodId, data })
    // });
    // return await response.json();
    
    return {
      success: true,
      message: 'Payment method saved successfully'
    };
  } catch (error) {
    console.error('Error saving payment method:', error);
    return {
      success: false,
      message: 'Failed to save payment method. Please try again.'
    };
  }
}; 