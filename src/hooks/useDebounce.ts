import { useRef } from 'react';

export default function useDebounce(fn: (...params: any[]) => any, delay: number) {
  const timeoutRef = useRef<number | undefined>(undefined);

  function debouncedFunction(...params: any[]) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fn(...params);
    }, delay);
  }

  return debouncedFunction;
}
