export type UserRole = 'PARTICIPANT' | 'ADMIN';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  PARTICIPANT: 'Participante',
  ADMIN: 'Administrador',
};

export const USER_ROLE_BADGE_VARIANT: Record<UserRole, 'outline' | 'default'> =
  {
    ADMIN: 'default',
    PARTICIPANT: 'outline',
  };

export type User = {
  id: string;
  name: string;
  role: UserRole;
};
