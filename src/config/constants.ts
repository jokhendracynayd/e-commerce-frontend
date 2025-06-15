// Payment gateway configuration
export const PAYMENT_CONFIG = {
  supportedMethods: ['card', 'upi', 'cod'],
  defaultCurrency: 'INR',
  gatewayUrls: {
    razorpay: process.env.NEXT_PUBLIC_RAZORPAY_URL,
    stripe: process.env.NEXT_PUBLIC_STRIPE_URL,
    upi: process.env.NEXT_PUBLIC_UPI_URL,
  },
  publicKeys: {
    razorpay: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    stripe: process.env.NEXT_PUBLIC_STRIPE_KEY,
  },
  providerMappings: {
    card: 'STRIPE',
    upi: 'UPI',
    cod: 'COD',
  },
  upiApps: {
    GOOGLE_PAY: 'GooglePay',
    PHONE_PE: 'PhonePe',
    PAYTM: 'Paytm',
    BHARAT_PE: 'BharatPe',
    OTHER: 'Other'
  }
};

// Security settings
export const SECURITY = {
  tokenExpiry: 60 * 60 * 24, // 24 hours in seconds
  csrfEnabled: true,
  privateAPIs: ['/api/orders', '/api/payments', '/api/user'],
};

// Default shipping costs
export const SHIPPING = {
  freeShippingThreshold: 500,
  standardShippingCost: 40,
};

// Order statuses mapping
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
  REFUNDED: 'Refunded',
}; 