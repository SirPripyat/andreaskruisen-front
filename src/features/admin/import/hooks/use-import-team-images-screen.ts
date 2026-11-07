import { useImportTeamImages } from '@/features/admin/teams/hooks/use-import-team-images';
import { pluralize } from '@/lib';
import { useImportFileScreen } from './use-import-file-screen';

export const useImportTeamImagesScreen = () => {
  const { mutate, isPending } = useImportTeamImages();

  const form = useImportFileScreen({
    mutate,
    getSuccessMessage: (result) =>
      `${result.processed} ${pluralize(result.processed, 'time processado', 'times processados')}, ${result.imagesUpdated} ${pluralize(result.imagesUpdated, 'escudo atualizado', 'escudos atualizados')}.`,
    errorMessage: 'Não foi possível importar as imagens dos clubes.',
  });

  return { ...form, isPending };
};
