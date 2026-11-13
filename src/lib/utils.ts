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

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const pluralize = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;

export const formatFileSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export type WithoutNulls<T> = {
  [K in keyof T]: Exclude<T[K], null> | undefined;
};

export const nullsToUndefined = <T extends Record<string, unknown>>(
  obj: T,
): WithoutNulls<T> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ?? undefined]),
  ) as WithoutNulls<T>;

export const serializeQueryParams = <T extends Record<string, unknown>>(
  query: T,
) =>
  Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value.length
          ? value.join(',')
          : undefined
        : value,
    ]),
  );

export const PREFERRED_FOOT_LABELS: Record<string, string> = {
  LEFT: 'Canhoto',
  RIGHT: 'Destro',
  BOTH: 'Ambidestro',
};
