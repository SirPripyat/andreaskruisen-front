import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  confirmAvatarUpload,
  getAvatarUploadUrl,
  isAvatarContentType,
  uploadAvatarFile,
} from '../api';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!isAvatarContentType(file.type)) {
        throw new Error(
          'Formato de imagem não suportado. Use JPEG, PNG ou WEBP.',
        );
      }

      const uploadUrl = await getAvatarUploadUrl(file.type);
      await uploadAvatarFile(uploadUrl, file);
      await confirmAvatarUpload();
    },
    meta: { errorMessage: 'Não foi possível atualizar a foto de perfil.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatar'] });
    },
  });
};
