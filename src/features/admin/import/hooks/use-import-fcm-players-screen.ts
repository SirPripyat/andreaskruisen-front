import { pluralize } from '@/lib';
import { useImportFcmPlayers } from './use-import-fcm-players';
import { useImportFileScreen } from './use-import-file-screen';

export const useImportFcmPlayersScreen = () => {
  const { mutate, isPending } = useImportFcmPlayers();

  const form = useImportFileScreen({
    mutate,
    getSuccessMessage: (result) =>
      `${result.processed} ${pluralize(result.processed, 'jogador processado', 'jogadores processados')}, ${result.ratingsInserted} ${pluralize(result.ratingsInserted, 'nova avaliação registrada', 'novas avaliações registradas')}.`,
    errorMessage: 'Não foi possível importar os jogadores.',
  });

  return { ...form, isPending };
};
