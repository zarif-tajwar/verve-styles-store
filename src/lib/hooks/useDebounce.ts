import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';

function useDebounce<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  delay: number,
) {
  const callbackRef = useRef<T>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    return debounce((...args: any[]) => {
      (callbackRef.current as T)(...args);
    }, delay);
  }, [delay]);

  return debouncedCallback;
}

export default useDebounce;
