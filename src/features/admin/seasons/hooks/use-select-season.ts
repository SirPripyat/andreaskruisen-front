import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { selectSeason } from '../api';

export const useSelectSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selectSeason,
    meta: { errorMessage: 'Não foi possível trocar a temporada.' },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.me.detail, data);
      // Temporada é o limite do tenant: nenhuma query fica de fora do
      // invalidate, já que praticamente tudo (time, elenco, torneios,
      // transferências...) é potencialmente escopado por temporada e
      // nenhuma dessas chaves inclui o seasonId.
      queryClient.invalidateQueries();
    },
  });
};
