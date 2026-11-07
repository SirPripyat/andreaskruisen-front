import { pluralize } from '@/lib';
import { useImportFileScreen } from './use-import-file-screen';
import { useImportPlayers } from './use-import-players';

export const useImportPlayersScreen = () => {
  const { mutate, isPending } = useImportPlayers();

  const form = useImportFileScreen({
    mutate,
    getSuccessMessage: (result) =>
      `${result.processed} ${pluralize(result.processed, 'jogador processado', 'jogadores processados')}, ${result.ratingsInserted} ${pluralize(result.ratingsInserted, 'nova avaliação registrada', 'novas avaliações registradas')}.`,
    errorMessage: 'Não foi possível importar os jogadores.',
  });

  return { ...form, isPending };
};
