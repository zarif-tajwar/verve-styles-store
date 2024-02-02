import { OrderDetailsSelect } from '../db/schema/orderDetails';
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
