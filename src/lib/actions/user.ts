'use server';
import {
  generateRandomCompletedOrders,
  getOrdersServer,
} from '@/lib/server/user';

export {
  generateRandomCompletedOrders as generateRandomCompletedOrdersAction,
  getOrdersServer as getOrdersAction,
};
