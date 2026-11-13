export type UserRole = 'PARTICIPANT' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  avatarPath: string | null;
};
