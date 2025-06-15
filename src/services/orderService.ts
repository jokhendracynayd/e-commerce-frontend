import { toast } from 'react-hot-toast';
import { axiosClient } from '@/lib/api/axios-client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/api/error-handler';
import { 
  CreateOrderRequest, 
  OrderResponse, 
  PaymentInitiateResponse, 
  PaymentIntentRequest,
  PaymentVerifyRequest,
  OrderAddress,
  OrderItem
} from '@/types';

/**
 * Creates a new order in the system
 * @param orderData Order data to be created
 * @returns Created order details
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINTS.ORDERS.CREATE, orderData);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error creating order:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Creates a new order for the authenticated user
 * @param orderData Order data to be created
 * @returns Created order details
 */
export const createUserOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINTS.ORDERS.CREATE_USER_ORDER, orderData);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error creating order:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Initiates payment for an order
 * @param paymentData Payment data
 * @returns Payment initiation response with required client data
 */
export const initiatePayment = async (paymentData: PaymentIntentRequest): Promise<PaymentInitiateResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINTS.PAYMENTS.CREATE_INTENT, paymentData);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error initiating payment:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Verifies a payment after it has been completed by the payment gateway
 * @param verifyData Payment verification data
 * @returns Payment verification result
 */
export const verifyPayment = async (verifyData: PaymentVerifyRequest): Promise<any> => {
  try {
    const response = await axiosClient.post(ENDPOINTS.PAYMENTS.VERIFY, verifyData);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error verifying payment:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Gets order details by ID
 * 
 * @param orderId Order ID
 * @returns Order details
 */
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const response = await axiosClient.get(ENDPOINTS.ORDERS.DETAIL(orderId));
    console.log('Order API response:', response.data);
    // The actual order data is in the 'data' property of the response
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error fetching order details:', error);
    toast.error(apiError.message);
    throw apiError;
  }
};

/**
 * Gets order details by order number
 * @param orderNumber Order number
 * @returns Order details
 */
export const getOrderByNumber = async (orderNumber: string): Promise<OrderResponse> => {
  try {
    const response = await axiosClient.get(ENDPOINTS.ORDERS.BY_NUMBER(orderNumber));
    console.log('Order API response by number:', response.data);
    // The actual order data is in the 'data' property of the response
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error fetching order details by number:', error);
    toast.error(apiError.message);
    throw apiError;
  }
}; 