'use server';
import {
  generateRandomCompletedOrders,
  getOrdersServer,
  addNewAddressServer,
} from '@/lib/server/user';

export {
  generateRandomCompletedOrders as generateRandomCompletedOrdersAction,
  getOrdersServer as getOrdersAction,
  addNewAddressServer as addNewAddressAction,
};
