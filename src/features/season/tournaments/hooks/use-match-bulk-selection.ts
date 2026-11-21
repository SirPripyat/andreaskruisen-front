import { useState } from 'react';

export const useMatchBulkSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = (matchId: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(matchId)) next.delete(matchId);
      else next.add(matchId);
      return next;
    });

  const selectMany = (matchIds: string[]) => setSelectedIds(new Set(matchIds));

  const clear = () => setSelectedIds(new Set());

  return { selectedIds, toggle, selectMany, clear };
};
