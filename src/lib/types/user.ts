import { AddressSelect } from '../db/schema/address';
import { OrderSelect } from '../db/schema/orders';

export type UserOrderedProduct = {
  quantity: number;
  total: number;
  name: string;
  size: string;
  image: string;
};

export type UserOrder = {
  orderId: OrderSelect['id'];
  status: string;
  orderDate?: string | null;
  deliveryDate?: string | null;
  deliveredAt?: string | null;
  orderedProducts: UserOrderedProduct[];
};

export type UserAddress = {
  id: string;
  address: AddressSelect['address'];
  city: AddressSelect['city'];
  country: AddressSelect['country'];
  phone: AddressSelect['phone'];
  type: AddressSelect['type'];
  isDefault: AddressSelect['isDefault'];
  label: AddressSelect['label'];
};
