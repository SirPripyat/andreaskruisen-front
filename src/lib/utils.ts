export { cn } from 'cn';

export const calculateAge = (birthdate: string) => {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  return `${parts[0]?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
};

export const pluralize = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;

export const formatFileSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(2)} MB`;
