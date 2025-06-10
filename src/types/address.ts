export interface Address {
  id?: string;
  name: string;
  mobileNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  locality: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: 'Home' | 'Work';
  country: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressFormData extends Omit<Address, 'id' | 'createdAt' | 'updatedAt'> {} 