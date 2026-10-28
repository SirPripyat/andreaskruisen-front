import { create } from 'zustand';
import type { User } from '../features';

type UserStore = {
  user: Omit<User, 'id'> | null;
  setUser: (user: Omit<User, 'id'>) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user: user }),
}));
