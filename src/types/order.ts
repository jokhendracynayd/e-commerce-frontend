export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  name?: string;
  mobileNumber?: string;
  locality?: string;
  landmark?: string;
  alternatePhone?: string;
  addressType?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
  };
  variant?: {
    id: string;
    variantName: string;
    sku: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface CreateOrderRequest {
  userId?: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod: string;
  discountCode?: string;
}

// Order response
export interface OrderResponse {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  placedAt: string;
  updatedAt: string;
}

// Paginated response
export interface PaginatedOrdersResponse {
  data: OrderResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
} 