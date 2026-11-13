import type { UserRole } from '@/features/admin/users';
import { api } from '@/lib';

export type Me = {
  id: string;
  name: string;
  role: UserRole;
  selectedSeasonId: string | null;
  teamId: string | null;
};

export const getMe = () => api.get<Me>('/me').then((res) => res.data);
