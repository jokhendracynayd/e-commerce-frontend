import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { 
  OrderStatus, 
  PaymentStatus, 
  OrderResponse, 
  PaginatedOrdersResponse,
  ApiResponse,
  CreateOrderRequest
} from '@/types/order';

// Order-related types
export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'STRIPE' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  productSlug: string;
  quantity: number;
  price: number;
  variantId?: string;
  variantName?: string;
  discount?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress?: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Define tracking event interface
interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  location?: string;
  description: string;
}

// Orders API functions
export const ordersApi = {
  /**
   * Get the current user's orders
   */
  getMyOrders: async (params: OrderFilterParams = {}): Promise<PaginatedOrdersResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<PaginatedOrdersResponse>> = await axiosClient.get(
        ENDPOINTS.ORDERS.MY_ORDERS,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single order by ID
   */
  getOrderById: async (id: string): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await axiosClient.get(
        ENDPOINTS.ORDERS.DETAIL(id)
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get order by order number
   */
  getOrderByNumber: async (orderNumber: string): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await axiosClient.get(
        ENDPOINTS.ORDERS.BY_NUMBER(orderNumber)
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new order
   */
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await axiosClient.post(
        ENDPOINTS.ORDERS.CREATE,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new order for the authenticated user
   */
  createUserOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await axiosClient.post(
        ENDPOINTS.ORDERS.CREATE_USER_ORDER,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Cancel a user's own order
   */
  cancelMyOrder: async (id: string): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await axiosClient.post(
        ENDPOINTS.ORDERS.CANCEL_MY_ORDER(id)
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Track an order
   */
  trackOrder: async (orderNumber: string): Promise<{
    order: OrderResponse;
    trackingEvents: TrackingEvent[];
  }> => {
    try {
      const order = await ordersApi.getOrderByNumber(orderNumber);
      
      // Note: This is a mock implementation.
      // In a real implementation, you would make an API call to a tracking endpoint
      // that would return actual tracking information.
      const trackingEvents: TrackingEvent[] = [
        {
          status: OrderStatus.PENDING,
          timestamp: order.placedAt,
          description: 'Order placed'
        }
      ];
      
      if (order.status !== OrderStatus.PENDING) {
        trackingEvents.push({
          status: OrderStatus.PROCESSING,
          timestamp: new Date(new Date(order.placedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
          description: 'Order confirmed and processing'
        });
      }
      
      if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
        trackingEvents.push({
          status: OrderStatus.SHIPPED,
          timestamp: new Date(new Date(order.placedAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Order shipped',
          location: 'Distribution Center'
        });
      }
      
      if (order.status === OrderStatus.DELIVERED) {
        trackingEvents.push({
          status: OrderStatus.DELIVERED,
          timestamp: new Date(new Date(order.placedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Order delivered',
          location: order.shippingAddress.city
        });
      }
      
      return {
        order,
        trackingEvents
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default ordersApi; 