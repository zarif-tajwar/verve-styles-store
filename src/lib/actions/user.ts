'use server';
import {
  generateRandomCompletedOrders,
  getOrdersServer,
  addNewAddressServer,
  editAddressServer,
  deleteAddressServer,
  getSavedAddressesServer,
  changeDefaultAddressServer,
} from '@/lib/server/user';

export {
  generateRandomCompletedOrders as generateRandomCompletedOrdersAction,
  getOrdersServer as getOrdersAction,
  addNewAddressServer as addNewAddressAction,
  editAddressServer as editAddressAction,
  deleteAddressServer as deleteAddressAction,
  getSavedAddressesServer as getSavedAddressesAction,
  changeDefaultAddressServer as changeDefaultAddressAction,
};
