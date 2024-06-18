"use client";
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 200): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
}
