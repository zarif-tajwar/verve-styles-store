import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type OrderFilterStoreAction = {
  setStatus: (status: string) => void;
  setOrderDateRange: (newDateRange: OrderFilterStore['orderDateRange']) => void;
  reset: () => void;
};

type OrderFilterStore = {
  status?: string;
  orderDateRange?: DateRange | undefined;
};

const initialState: OrderFilterStore = {
  status: '',
  orderDateRange: undefined,
};

export const useOrderFilterStore = create<
  OrderFilterStore & OrderFilterStoreAction
>()((set) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  setOrderDateRange: (orderDateRange) => {
    set({ orderDateRange });
  },
  setStatus: (status) => {
    set({ status });
  },
}));
