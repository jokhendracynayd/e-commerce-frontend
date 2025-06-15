'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { PAYMENT_CONFIG } from '@/config/constants';
import { 
  initiatePayment, 
  verifyPayment
} from '@/services/orderService';
import { 
  generateUpiPaymentIntent,
  UPI_APPS
} from '@/services/upiPaymentService';
import {
  PaymentInitiateResponse,
  PaymentVerifyRequest,
  UpiPaymentResponse,
  UpiPaymentData,
  UpiApp,
  PaymentResult
} from '@/types';

interface PaymentProcessorProps {
  orderId: string;
  amount: number;
  paymentMethod: string;
  paymentData: Record<string, string>;
  onPaymentComplete: (success: boolean, data: any) => void;
  onPaymentError: (error: Error) => void;
  customerEmail?: string;
}

const PaymentProcessor = ({
  orderId,
  amount,
  paymentMethod,
  paymentData,
  onPaymentComplete,
  onPaymentError,
  customerEmail,
}: PaymentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentInitiateResponse | null>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const router = useRouter();

  // Map the payment method to the correct provider
  const getProvider = (method: string): string => {
    return PAYMENT_CONFIG.providerMappings[method as keyof typeof PAYMENT_CONFIG.providerMappings] || 'STRIPE';
  };

  // When component mounts, initiate the payment
  useEffect(() => {
    const processPayment = async () => {
      try {
        setIsProcessing(true);

        // Determine the payment provider
        const provider = getProvider(paymentMethod);

        // Handle COD separately as it doesn't require payment intent
        if (provider === 'COD') {
          onPaymentComplete(true, {
            status: 'PENDING',
            orderId,
            paymentMethod,
            message: 'Order placed successfully. You will pay on delivery.'
          });
          return;
        }

        // Create payment intent request
        const paymentIntentRequest = {
          orderId,
          amount,
          currency: PAYMENT_CONFIG.defaultCurrency,
          paymentMethod,
          provider,
          customerEmail,
          metadata: { ...paymentData }
        };

        // UPI specific processing
        if (provider === 'UPI') {
          await processUpiPayment(paymentIntentRequest);
        }
        // Card/Other payment methods
        else {
          const response = await initiatePayment(paymentIntentRequest);
          setPaymentResponse(response);
          
          if (response.paymentData?.clientSecret) {
            // Implement provider-specific payment processing
            switch (provider) {
              case 'STRIPE':
                // Stripe requires client-side JS SDK initialization
                // This would typically be loaded from the head of the document
                handleStripePayment(response.paymentData);
                break;
              case 'RAZORPAY':
                handleRazorpayPayment(response.paymentData);
                break;
              default:
                console.error('Unsupported payment provider');
                onPaymentError(new Error('Unsupported payment provider'));
            }
          } else {
            verifyPaymentStatus(response);
          }
        }
      } catch (error) {
        setIsProcessing(false);
        onPaymentError(error instanceof Error ? error : new Error('Payment processing failed'));
      }
    };

    if (orderId && amount > 0 && !isProcessing) {
      processPayment();
    }

    return () => {
      // Cleanup any payment related resources if needed
    };
  }, [orderId, amount, paymentMethod]);

  // Process UPI payment
  const processUpiPayment = async (paymentIntentRequest: any) => {
    try {
      // First create a payment intent
      const intentResponse = await initiatePayment(paymentIntentRequest);
      setPaymentResponse(intentResponse);

      // If successful, generate UPI details
      if (intentResponse.status === 'PENDING') {
        const upiData: UpiPaymentData = {
          upiId: paymentData.upiId,
          upiApp: paymentData.upiApp || UpiApp.OTHER,
          amount,
          orderId,
          transactionId: intentResponse.paymentId,
          description: `Payment for order ${orderId}`
        };

        const upiResponse = await generateUpiPaymentIntent(upiData);
        
        // Store QR code for display
        if (upiResponse.qrCode) {
          setQrCode(upiResponse.qrCode);
        }
        
        // Mobile device handling - direct to UPI app
        if (upiResponse.deepLink && isMobileDevice()) {
          window.location.href = upiResponse.deepLink;
        }

        // Start polling for payment status
        startUpiStatusPolling(intentResponse.paymentId, upiResponse.transactionId);
      } else {
        onPaymentError(new Error('Failed to create UPI payment intent'));
      }
    } catch (error) {
      setIsProcessing(false);
      onPaymentError(error instanceof Error ? error : new Error('UPI payment failed'));
    }
  };

  // Check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Poll for UPI payment status
  const startUpiStatusPolling = (paymentId: string, transactionId: string) => {
    setVerificationInProgress(true);
    let attempts = 0;
    
    const pollInterval = setInterval(async () => {
      try {
        attempts++;
        
        // Verify payment
        const verifyData: PaymentVerifyRequest = {
          paymentId,
          providerPaymentId: transactionId
        };
        
        const verificationResult = await verifyPayment(verifyData);
        
        // If payment is completed or failed
        if (verificationResult.success || attempts >= 30) {
          clearInterval(pollInterval);
          setVerificationInProgress(false);
          setIsProcessing(false);
          
          if (verificationResult.success) {
            onPaymentComplete(true, verificationResult);
          } else if (attempts >= 30) {
            onPaymentError(new Error('Payment verification timed out. Please check your UPI app.'));
          } else {
            onPaymentError(new Error('Payment failed: ' + verificationResult.message));
          }
        }
      } catch (error) {
        if (attempts >= 30) {
          clearInterval(pollInterval);
          setVerificationInProgress(false);
          setIsProcessing(false);
          onPaymentError(error instanceof Error ? error : new Error('Payment verification failed'));
        }
      }
    }, 3000); // Check every 3 seconds
    
    // Cleanup interval if component unmounts
    return () => clearInterval(pollInterval);
  };

  // Handle Stripe payment
  const handleStripePayment = async (paymentData: any) => {
    try {
      // This would need the Stripe JS SDK to be loaded
      // and would use the client secret from paymentData
      console.log('Processing Stripe payment with:', paymentData);
      
      // In a real implementation, you would use Stripe Elements or Checkout
      // For example:
      // const stripe = window.Stripe(PAYMENT_CONFIG.publicKeys.stripe);
      // const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
      //   payment_method: { ... card details ... }
      // });
      
      // For now, simulate a successful payment
      setTimeout(() => {
        verifyPaymentStatus(paymentResponse!);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      onPaymentError(error instanceof Error ? error : new Error('Stripe payment failed'));
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (paymentData: any) => {
    try {
      // This would need the Razorpay JS SDK to be loaded
      console.log('Processing Razorpay payment with:', paymentData);
      
      // In a real implementation:
      // const options = {
      //   key: PAYMENT_CONFIG.publicKeys.razorpay,
      //   amount: amount * 100, // Razorpay expects amount in paise
      //   currency: PAYMENT_CONFIG.defaultCurrency,
      //   name: 'Your Store Name',
      //   order_id: paymentData.orderId,
      //   handler: function(response: any) {
      //     verifyPaymentWithSignature(response);
      //   },
      // };
      // const razorpay = new (window as any).Razorpay(options);
      // razorpay.open();
      
      // For now, simulate a successful payment
      setTimeout(() => {
        verifyPaymentStatus(paymentResponse!);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      onPaymentError(error instanceof Error ? error : new Error('Razorpay payment failed'));
    }
  };

  // Verify payment status
  const verifyPaymentStatus = async (response: PaymentInitiateResponse) => {
    try {
      setVerificationInProgress(true);
      
      // For real payments, we'd verify with the provider's signature or response
      const verifyData: PaymentVerifyRequest = {
        paymentId: response.paymentId,
        providerPaymentId: response.paymentData?.id || response.paymentId
      };
      
      const verificationResult = await verifyPayment(verifyData);
      
      setVerificationInProgress(false);
      setIsProcessing(false);
      
      if (verificationResult.success) {
        onPaymentComplete(true, verificationResult);
      } else {
        onPaymentError(new Error('Payment verification failed: ' + verificationResult.message));
      }
    } catch (error) {
      setVerificationInProgress(false);
      setIsProcessing(false);
      onPaymentError(error instanceof Error ? error : new Error('Payment verification failed'));
    }
  };

  // UI for payment processing
  if (isProcessing || verificationInProgress) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4">
            <svg className="animate-spin h-full w-full text-[#ed875a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {verificationInProgress ? 'Verifying payment...' : 'Processing your payment...'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {verificationInProgress 
              ? 'Please wait while we confirm your payment.' 
              : 'Please do not close this window or click the back button.'}
          </p>
          
          {/* Display QR code for UPI payments */}
          {qrCode && paymentMethod === 'upi' && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Scan with any UPI app to pay</p>
                <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
                <p className="text-xs text-gray-500 mt-2">Or check your UPI app for payment request</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No UI when not processing - this component is invisible until payment starts
  return null;
};

export default PaymentProcessor; 