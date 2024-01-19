'use server';
import {
  generateRandomCompletedOrders,
  getOrdersServer,
  addNewAddressServer,
  editAddressServer,
  deleteAddressServer,
} from '@/lib/server/user';

export {
  generateRandomCompletedOrders as generateRandomCompletedOrdersAction,
  getOrdersServer as getOrdersAction,
  addNewAddressServer as addNewAddressAction,
  editAddressServer as editAddressAction,
  deleteAddressServer as deleteAddressAction,
};
