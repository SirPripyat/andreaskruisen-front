import { useImportLineups } from '@/features/season/squads/hooks/use-import-lineups';
import { pluralize } from '@/lib';
import { useImportFileScreen } from './use-import-file-screen';

export const useImportLineupsScreen = () => {
  const { mutate, isPending } = useImportLineups();

  const form = useImportFileScreen({
    mutate,
    getSuccessMessage: (result) =>
      `${result.processed} ${pluralize(result.processed, 'time processado', 'times processados')}, ${result.lineupsInserted} ${pluralize(result.lineupsInserted, 'escalação registrada', 'escalações registradas')}.`,
    errorMessage: 'Não foi possível importar as escalações.',
  });

  return { ...form, isPending };
};
