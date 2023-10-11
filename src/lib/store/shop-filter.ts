import { create } from 'zustand';
import {
  defaultPriceRange,
  defaultSortOptionValue,
} from '../validation/constants';
import { ShopFilterState } from '../types/ShopFilter';

type ShopFilterAction = {
  reset: () => void;
  //   update: <K extends keyof ShopFilterState>(
  //     key: K,
  //     value: ShopFilterState[K],
  //   ) => void;
  update: (state: Partial<ShopFilterState>) => void;
};

const initialState: ShopFilterState = {
  sort_by: defaultSortOptionValue,
  sizes: new Set(),
  clothing: new Set(),
  styles: new Set(),
  price_range: defaultPriceRange,
  page: 1,
};

export const useShopFilterStore = create<ShopFilterState & ShopFilterAction>()(
  (set) => ({
    ...initialState,
    reset: () => {
      set(initialState);
    },
    update: (state) => {
      set({ ...state });
    },
    // update: (key, value) => {
    //   set({ [key]: value });
    // },
  }),
);
