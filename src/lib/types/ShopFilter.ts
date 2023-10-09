export type ShopFilterState = {
  sort_by: string;
  sizes: Set<string>;
  clothing: Set<string>;
  styles: Set<string>;
  price_range: PriceRange;
};

export type PriceRange = [number, number];

export type ShopFilterQueryParams = Partial<
  Record<keyof ShopFilterState, string>
>;
