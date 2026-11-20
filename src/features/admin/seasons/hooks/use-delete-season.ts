import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSeason } from '../api';

export const useDeleteSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seasonId: string) => deleteSeason(seasonId),
    meta: { errorMessage: 'Não foi possível excluir a temporada.' },
    onSuccess: () => {
      // Temporada é o limite do tenant: se a temporada excluída era a
      // selecionada, toda query escopada por temporada (elenco,
      // transferências, torneios, active-season...) precisa ser descartada.
      queryClient.invalidateQueries();
    },
  });
};
