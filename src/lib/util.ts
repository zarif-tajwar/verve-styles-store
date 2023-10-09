import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalize = (str: string) =>
  str[0].toUpperCase() + str.slice(1).toLowerCase();

export const isValueInArray = <T>(value: T, array: T[]): boolean =>
  array.some((v) => v === value);

export const isSubset = <T>(subsetArray: T[], targetArray: T[]): boolean =>
  subsetArray.every((v) => isValueInArray(v, targetArray));

export const quickSortValuesByID = <T>(
  values: T[],
  valuesWithID: { id: number; value: T }[],
): T[] => {
  if (values.length <= 1) {
    return values;
  }

  const pivot = valuesWithID.find((item) => item.value === values[0]);
  if (!pivot) {
    return values;
  }

  const pivotId = pivot.id;

  const less: T[] = [];
  const equal: T[] = [];
  const greater: T[] = [];

  for (const item of values) {
    const itemId = valuesWithID.find((clothing) => clothing.value === item)?.id;

    if (itemId !== undefined) {
      if (itemId < pivotId) {
        less.push(item);
      } else if (itemId > pivotId) {
        greater.push(item);
      } else {
        equal.push(item);
      }
    }
  }

  return [
    ...quickSortValuesByID(less, valuesWithID),
    ...equal,
    ...quickSortValuesByID(greater, valuesWithID),
  ];
};
