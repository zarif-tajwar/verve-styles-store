import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type OrderFilterStoreAction = {
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
  setOrderDateRange: (newDateRange: OrderFilterStore['orderDateRange']) => void;
  reset: () => void;
};

type OrderFilterStore = {
  status?: string;
  orderDateRange?: DateRange | undefined;
  page: number;
};

const initialState: OrderFilterStore = {
  status: '',
  orderDateRange: undefined,
  page: 1,
};

export const useOrderFilterStore = create<
  OrderFilterStore & OrderFilterStoreAction
>()((set) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  setOrderDateRange: (orderDateRange) => {
    set({ orderDateRange, page: initialState.page });
  },
  setStatus: (status) => {
    set({ status, page: initialState.page });
  },
  setPage: (page) => {
    set({ page });
  },
}));
