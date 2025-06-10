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