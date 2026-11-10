import { api } from '@/lib';

export const AVATAR_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AvatarContentType = (typeof AVATAR_CONTENT_TYPES)[number];

export const isAvatarContentType = (type: string): type is AvatarContentType =>
  (AVATAR_CONTENT_TYPES as readonly string[]).includes(type);

export const getAvatarUploadUrl = async (contentType: AvatarContentType) => {
  const { data } = await api.post<{ uploadUrl: string }>(
    '/users/me/avatar/upload-url',
    { contentType },
  );
  return data.uploadUrl;
};

export const uploadAvatarFile = async (uploadUrl: string, file: File) => {
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
};

export const confirmAvatarUpload = async () => {
  await api.patch('/users/me/avatar/confirm');
};

export const getAvatar = async () => {
  const { data } = await api.get<{ url: string }>('/users/me/avatar');
  return data.url;
};
