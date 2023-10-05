import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalize = (str: string) =>
  str[0].toUpperCase() + str.slice(1).toLowerCase();

export const isValueInArray = <T>(value: T, array: T[]): boolean =>
  array.some((v) => v === value);

export const isSubset = <T>(subsetArray: T[], targetArray: T[]): boolean =>
  subsetArray.every((v) => isValueInArray(v, targetArray));
