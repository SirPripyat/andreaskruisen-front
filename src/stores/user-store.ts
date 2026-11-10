import { create } from 'zustand';
import type { Me } from '../features';

type UserStore = {
  user: Omit<Me, 'id'> | null;
  setUser: (user: Omit<Me, 'id'>) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user: user }),
}));
