import { array, z } from 'zod';
import { SearchQueryUnreservedChars } from '../hooks/useQueryParams';
import { isValueInArray } from '../util';
import {
  clothingColumnNames,
  defaultSortOptionValue,
  defaultPriceRange,
  dressStylesColumnNames,
  sizesColumnNamesMap,
  sortOptionValues,
  filterOrderMap,
} from './constants';

export const zParseMultiOptionSearchQuery = (
  targetArray: string[],
  separator: SearchQueryUnreservedChars = '~',
) =>
  z
    .string()
    .transform((value) => value.split(separator))
    .pipe(
      z
        .string()
        .array()
        .transform((array) => {
          const filteredArray = Array.from(
            new Set(
              array.filter((value) => isValueInArray(value, targetArray)),
            ),
          ).toSorted(
            (a, b) =>
              targetArray.findIndex((v) => v === a) -
              targetArray.findIndex((v) => v === b),
          );
          return filteredArray.length === 0 ||
            filteredArray.length >= targetArray.length
            ? undefined
            : filteredArray;
        }),
    );

export const zParsePriceRangeSearchQuery = (
  separator: SearchQueryUnreservedChars = '-',
) =>
  z
    .string()
    .transform((value) => {
      const priceRange = value
        .split(separator)
        .map((numStr) => Number.parseInt(numStr))
        .filter((v) => !Number.isNaN(v));
      if (priceRange.length !== 2) return undefined;
      if (
        priceRange[0] === defaultPriceRange[0] &&
        priceRange[1] === defaultPriceRange[1]
      )
        return undefined;
      if (
        priceRange[0] < defaultPriceRange[0] ||
        priceRange[1] > defaultPriceRange[1]
      )
        return undefined;
      if (priceRange[0] > priceRange[1]) return undefined;
      return priceRange;
    })
    .pipe(z.number().array().nullish());

export const zParseSingleOptionSearchQuery = (
  optionValues: string[],
  defaultSortOptionValue: string,
) =>
  z.string().transform((value) => {
    if (value === defaultSortOptionValue) return undefined;
    if (isValueInArray(value, optionValues)) return value;
    return undefined;
  });

export const FilterSearchQueryValuesSchema = z
  .object({
    sizes: zParseMultiOptionSearchQuery(Array.from(sizesColumnNamesMap.keys())),
    styles: zParseMultiOptionSearchQuery(dressStylesColumnNames),
    clothing: zParseMultiOptionSearchQuery(clothingColumnNames),
    price_range: zParsePriceRangeSearchQuery(),
    sort_by: zParseSingleOptionSearchQuery(
      sortOptionValues,
      defaultSortOptionValue,
    ),
  })
  .partial();

export type FilterSearchQueryValuesType = z.infer<
  typeof FilterSearchQueryValuesSchema
>;

export const FilteredSearchQueryValuesToSearchParams = (
  parsedSearchQueryValues: FilterSearchQueryValuesType,
  currentSearchParamsInstance: URLSearchParams | string,
) => {
  const newSearchQuery = new URLSearchParams(
    currentSearchParamsInstance.toString(),
  );

  const parsedSearchQueryValueEntries = Object.entries(parsedSearchQueryValues);

  for (let i = 0; i < parsedSearchQueryValueEntries.length; i++) {
    let [key, value] = parsedSearchQueryValueEntries[i];

    if (value === undefined) continue;

    if (isValueInArray(key, ['clothing', 'sizes', 'styles'])) {
      const forceArr = value as string[];
      newSearchQuery.set(key, forceArr.join('~'));
      continue;
    }

    if (key === 'price_range') {
      const forceArr = value as number[];
      newSearchQuery.set(key, forceArr.join('-'));
      continue;
    }

    if (key === 'sort_by') {
      newSearchQuery.set(key, value as string);
      continue;
    }
  }
  return newSearchQuery;
};
