import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import {
  confirmAvatarUpload,
  getAvatarUploadUrl,
  isAvatarContentType,
  uploadAvatarFile,
} from '../api';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      if (!isAvatarContentType(file.type)) {
        return Promise.reject(
          new Error('Formato de imagem não suportado. Use JPEG, PNG ou WEBP.'),
        );
      }

      return getAvatarUploadUrl(file.type)
        .then((uploadUrl) => uploadAvatarFile(uploadUrl, file))
        .then(() => confirmAvatarUpload());
    },
    meta: { errorMessage: 'Não foi possível atualizar a foto de perfil.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.avatar });
    },
  });
};
