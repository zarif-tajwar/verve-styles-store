'use client';

import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation';

export default function useQueryParams<T>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  function setQueryParams(params: Partial<T>, scroll: boolean = false) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        urlSearchParams.delete(key);
      } else {
        urlSearchParams.set(key, String(value));
      }
    });

    const search = urlSearchParams.toString();

    const query = search ? `?${search}` : '';
    // replace since we don't want to build a history
    router.replace(`${pathname}${query}`, { scroll });
  }

  return { queryParams: searchParams, setQueryParams };
}

const searchQueryUnreservedChars = ['-', '.', '_', '~'] as const;

export type SearchQueryUnreservedChars =
  (typeof searchQueryUnreservedChars)[number];
