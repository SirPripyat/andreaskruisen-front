import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SeasonStore = {
  selectedSeasonId: string | null;
  setSelectedSeasonId: (seasonId: string) => void;
};

export const useSeasonStore = create<SeasonStore>()(
  persist(
    (set) => ({
      selectedSeasonId: null,
      setSelectedSeasonId: (seasonId) => set({ selectedSeasonId: seasonId }),
    }),
    { name: 'season_state' },
  ),
);
