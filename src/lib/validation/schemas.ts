import { z } from 'zod';
import { isValueInArray, quickSortByReference } from '../util';
import {
  URL_QUERY_SEPERATORS,
  clothingValues,
  defaultPriceRange,
  defaultSortOptionValue,
  dressStylesValues,
  sizesValues,
  sortOptionValues,
} from './constants';

export const zParseMultiOptionSearchQuery = (targetArray: string[]) =>
  z
    .string()
    .transform((value) => value.split(URL_QUERY_SEPERATORS.multipleOption))
    .pipe(
      z
        .string()
        .array()
        .transform((array) => {
          const filteredArray = [
            ...new Set(
              array.filter((value) => isValueInArray(value, targetArray)),
            ),
          ];

          const sortedArray = quickSortByReference(filteredArray, targetArray);

          return sortedArray.length === 0 ||
            sortedArray.length >= targetArray.length
            ? undefined
            : sortedArray;
        }),
    );

export const zParsePriceRangeSearchQuery = () =>
  z
    .string()
    .transform((value) => {
      const priceRange = value
        .split(URL_QUERY_SEPERATORS.range)
        .map((numStr) => Number.parseInt(numStr))
        .filter((v) => !Number.isNaN(v));
      if (priceRange.length !== 2) return undefined;
      if (
        priceRange[0] === defaultPriceRange[0] &&
        priceRange[1] === defaultPriceRange[1]
      )
        return undefined;
      if (
        priceRange[0]! < defaultPriceRange[0] ||
        priceRange[1]! > defaultPriceRange[1]
      )
        return undefined;
      if (priceRange[0]! > priceRange[1]!) return undefined;
      return priceRange;
    })
    .pipe(z.number().array().length(2).nullish());

export const zParseSingleOptionSearchQuery = (
  optionValues: string[],
  defaultSortOptionValue: string,
) =>
  z.string().transform((value) => {
    if (value === defaultSortOptionValue) return undefined;
    if (isValueInArray(value, optionValues)) return value;
    return undefined;
  });

export const zParsePageNumber = () =>
  z.string().transform((value) => {
    const valueToNumber = Number.parseInt(value);
    if (Number.isNaN(valueToNumber)) return undefined;
    return valueToNumber;
  });

export const FilterSearchQueryValuesSchema = z
  .object({
    sizes: zParseMultiOptionSearchQuery(sizesValues),
    styles: zParseMultiOptionSearchQuery(dressStylesValues),
    clothing: zParseMultiOptionSearchQuery(clothingValues),
    price_range: zParsePriceRangeSearchQuery(),
    sort_by: zParseSingleOptionSearchQuery(
      sortOptionValues,
      defaultSortOptionValue,
    ),
    page: zParsePageNumber(),
  })
  .partial();

export type FilterSearchQueryValuesType = z.infer<
  typeof FilterSearchQueryValuesSchema
>;

export const shopFilterKeys = [
  'sizes',
  'styles',
  'clothing',
  'price_range',
  'sort_by',
  'page',
] as const;

// export const FilteredSearchQueryValuesToSearchParams = (
//   parsedSearchQueryValues: FilterSearchQueryValuesType,
//   currentSearchParamsInstance: URLSearchParams | string,
// ) => {
//   const newSearchQuery = new URLSearchParams(
//     currentSearchParamsInstance.toString(),
//   );

//   const parsedSearchQueryValueEntries = Object.entries(parsedSearchQueryValues);

//   for (let i = 0; i < parsedSearchQueryValueEntries.length; i++) {
//     let [key, value] = parsedSearchQueryValueEntries[i];

//     if (value === undefined) continue;

//     if (isValueInArray(key, ['clothing', 'sizes', 'styles'])) {
//       const forceArr = value as string[];
//       newSearchQuery.set(
//         key,
//         forceArr.join(URL_QUERY_SEPERATORS.multipleOption),
//       );
//       continue;
//     }

//     if (key === 'price_range') {
//       const forceArr = value as number[];
//       newSearchQuery.set(key, forceArr.join(URL_QUERY_SEPERATORS.range));
//       continue;
//     }

//     if (key === 'sort_by') {
//       newSearchQuery.set(key, value as string);
//       continue;
//     }
//   }
//   return newSearchQuery;
// };
