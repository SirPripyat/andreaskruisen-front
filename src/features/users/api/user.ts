export type UserRole = 'PARTICIPANT' | 'ADMIN';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  PARTICIPANT: 'Participante',
  ADMIN: 'Administrador',
};

export type User = {
  id: string;
  name: string;
  role: UserRole;
};
