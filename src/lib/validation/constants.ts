import { Icons } from '@/components/Svgs/icons';

export const defaultPriceRange = [0, 10000];

export const dressStylesOptions = [
  { id: 1, value: 'casual', label: 'Casual' },
  { id: 2, value: 'formal', label: 'Formal' },
  { id: 3, value: 'festival', label: 'Festival' },
  { id: 4, value: 'gym', label: 'Gym' },
];

export const dressStylesColumnNames = dressStylesOptions.map((o) => o.value);

export const sizesOptions = [
  { id: 1, value: 'small', label: 'Small' },
  { id: 2, value: 'medium', label: 'Medium' },
  { id: 3, value: 'large', label: 'Large' },
  { id: 4, value: 'xl', label: 'XL' },
  { id: 5, value: '2xl', label: '2XL' },
];

export const sizesColumnNames = sizesOptions.map((o) => o.value);

// export const sizesColumnNamesMap = new Map<string, string>([
//   ['sm', 'small'],
//   ['md', 'medium'],
//   ['lg', 'large'],
//   ['xl', 'xl'],
//   ['2xl', '2xl'],
// ]);

export const clothingItemsOptions = [
  { id: 1, value: 'tshirts', label: 'T-Shirts', icon: Icons['T-Shirts'] },
  { id: 2, value: 'shorts', label: 'Shorts', icon: Icons.Shorts },
  { id: 3, value: 'shirts', label: 'Shirts', icon: Icons.Shirts },
  { id: 4, value: 'hoodies', label: 'Hoodies', icon: Icons.Hoodies },
  { id: 5, value: 'jeans', label: 'Jeans', icon: Icons.Jeans },
];

export const clothingColumnNames = clothingItemsOptions.map((o) => o.value);

export const sortOptions = [
  { value: 'most recent', title: 'Most Recent' },
  { value: 'most popular', title: 'Most Popular' },
  { value: 'price low to high', title: 'Price (Low to High)' },
  { value: 'price high to low', title: 'Price (High to Low)' },
];

export const sortOptionValues = sortOptions.map((o) => o.value);

export const defaultSortOptionValue = sortOptionValues[0];

export const filterOrderMap = new Map([
  ['clothing', 1],
  ['price_range', 2],
  ['sizes', 3],
  ['styles', 4],
  ['sort_by', 5],
]);

export const URL_QUERY_SEPERATORS = {
  word: '+',
  multipleOption: ',',
  range: '-',
} as const;
