import { useEffect, useState } from 'react';
import { useDebouncedValue } from './use-debounced-value';

export function useDebouncedSearch(
  value: string,
  onDebouncedChange: (debouncedValue: string) => void,
  delayMs = 400,
) {
  const [draft, setDraft] = useState(value);
  const debouncedValue = useDebouncedValue(draft, delayMs);

  useEffect(() => {
    if (debouncedValue !== value) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, value, onDebouncedChange]);

  return [draft, setDraft] as const;
}
