import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { type EditTeamCrestFormValues, editTeamCrestSchema } from '../types';
import { useTeam } from './use-team';
import { useUpdateTeam } from './use-update-team';

type UseEditTeamDrawerProps = {
  id: string;
  open: boolean;
  toggleDrawer: () => void;
};

export const useEditTeamDrawer = ({
  id,
  open,
  toggleDrawer,
}: UseEditTeamDrawerProps) => {
  const { data, isPending: isFetchingTeam } = useTeam(id, open);
  const { mutate, isPending } = useUpdateTeam(id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTeamCrestFormValues>({
    resolver: zodResolver(editTeamCrestSchema),
    values: {
      crestUrl: data?.crestUrl ?? '',
    },
  });

  const crestUrl = useWatch({ control, name: 'crestUrl' });

  const onSubmit = (values: EditTeamCrestFormValues) => {
    mutate(
      { crestUrl: values.crestUrl },
      {
        onSuccess: () => {
          toast.success(`Escudo de "${data?.name}" atualizado com sucesso.`);
          toggleDrawer();
        },
      },
    );
  };

  return {
    team: data,
    handleSubmit,
    onSubmit,
    crestUrl,
    errors,
    isPending,
    register,
    reset,
    isFetchingTeam,
  };
};
