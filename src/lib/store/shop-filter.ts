import { create } from 'zustand';
import {
  defaultPriceRange,
  defaultSortOptionValue,
} from '../validation/constants';

type ShopFilterState = {
  sort_by: string;
  sizes: string[];
  clothing: string[];
  styles: string[];
  price_range: [number, number];
};

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
  sizes: [],
  clothing: [],
  styles: [],
  price_range: defaultPriceRange,
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
