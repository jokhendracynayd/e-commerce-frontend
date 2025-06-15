export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  requiresAdditionalInfo: boolean;
  displayOrder: number;
  badges?: PaymentBadge[];
}

export interface PaymentBadge {
  text: string;
  type: 'success' | 'warning' | 'info' | 'neutral';
}

export interface PaymentMethodOption {
  id: string;
  name: string;
  icon?: string;
  value: string;
}

export interface PaymentFormField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'radio' | 'checkbox' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: PaymentMethodOption[];
  validation?: {
    pattern?: string;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface PaymentProcessorConfig {
  processorId: string;
  apiEndpoint?: string;
  publicKey?: string;
  testMode: boolean;
}

export interface PaymentMethodConfig {
  method: PaymentMethod;
  fields: PaymentFormField[];
  processor?: PaymentProcessorConfig;
}

// Payment Intent types
export interface PaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface PaymentInitiateResponse {
  clientSecret?: string;
  paymentId: string;
  orderId: string;
  amount: number;
  paymentData: any;
  provider: string;
  status: string;
}

export interface PaymentVerifyRequest {
  paymentId: string;
  providerPaymentId: string;
  signature?: string;
}

// UPI Payment types
export enum UpiApp {
  GOOGLE_PAY = 'GooglePay',
  PHONE_PE = 'PhonePe',
  PAYTM = 'Paytm',
  BHARAT_PE = 'BharatPe',
  OTHER = 'Other'
}

export interface UpiPaymentData {
  upiId: string;
  upiApp: string;
  amount: number;
  orderId: string;
  transactionId?: string;
  merchantId?: string; 
  description?: string;
}

export interface UpiPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  qrCode?: string;
  transactionId: string;
  status: string;
  message?: string;
  deepLink?: string;
  intentUrl?: string;
}

// Payment provider and method enums
export enum PaymentProvider {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
  PAYPAL = 'PAYPAL',
  COD = 'COD',
  UPI = 'UPI'
}

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  COD = 'COD',
  PAYPAL = 'PAYPAL'
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId: string;
  status: string;
  message?: string;
  transactionId?: string;
  error?: any;
  providerResponse?: any;
} 