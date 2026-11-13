import { api } from '@/lib';

export const AVATAR_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AvatarContentType = (typeof AVATAR_CONTENT_TYPES)[number];

export const isAvatarContentType = (type: string): type is AvatarContentType =>
  (AVATAR_CONTENT_TYPES as readonly string[]).includes(type);

export const getAvatarUploadUrl = (contentType: AvatarContentType) =>
  api
    .post<{ uploadUrl: string }>('/me/avatar/upload-url', {
      contentType,
    })
    .then((res) => res.data.uploadUrl);

export const uploadAvatarFile = (uploadUrl: string, file: File) =>
  fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

export const confirmAvatarUpload = () => api.patch('/me/avatar/confirm');

export const getAvatar = () =>
  api.get<{ url: string }>('/me/avatar').then((res) => res.data.url);
