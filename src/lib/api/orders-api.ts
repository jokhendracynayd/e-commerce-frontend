import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { CartItem } from './cart-api';

// Order-related types
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
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

export interface CreateOrderRequest {
  userId?: string;
  items?: CartItem[];
  shippingAddressId?: string;
  shippingAddress?: Address;
  billingAddressId?: string;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  userId?: string;
}

export interface OrderListResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Orders API functions
export const ordersApi = {
  /**
   * Get a paginated list of all orders (for admins)
   */
  getAllOrders: async (params: OrderFilterParams = {}): Promise<OrderListResponse> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.ORDERS.BASE,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get the current user's orders
   */
  getMyOrders: async (params: OrderFilterParams = {}): Promise<OrderListResponse> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.ORDERS.MY_ORDERS,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.ORDERS.DETAIL(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new order
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.ORDERS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new order for the authenticated user
   */
  createUserOrder: async (data: CreateOrderRequest): Promise<Order> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.ORDERS.CREATE_USER_ORDER,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Cancel an order
   */
  cancelOrder: async (id: string): Promise<Order> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.ORDERS.CANCEL(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Cancel a user's own order
   */
  cancelMyOrder: async (id: string): Promise<Order> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.ORDERS.CANCEL_MY_ORDER(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Track an order
   */
  trackOrder: async (orderNumber: string): Promise<{
    order: Order;
    trackingEvents: Array<{
      status: OrderStatus;
      timestamp: string;
      location?: string;
      description: string;
    }>;
  }> => {
    try {
      const order = await ordersApi.getOrderById(orderNumber);
      
      // Note: This is a mock implementation.
      // In a real implementation, you would make an API call to a tracking endpoint
      // that would return actual tracking information.
      const trackingEvents = [
        {
          status: 'PENDING' as OrderStatus,
          timestamp: order.createdAt,
          description: 'Order placed'
        }
      ];
      
      if (order.status !== 'PENDING') {
        trackingEvents.push({
          status: 'PROCESSING' as OrderStatus,
          timestamp: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
          description: 'Order confirmed and processing'
        });
      }
      
      if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
        trackingEvents.push({
          status: 'SHIPPED' as OrderStatus,
          timestamp: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Order shipped',
          // location: 'Distribution Center'
        });
      }
      
      if (order.status === 'DELIVERED') {
        trackingEvents.push({
          status: 'DELIVERED' as OrderStatus,
          timestamp: new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Order delivered',
          // location: order.shippingAddress.city
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