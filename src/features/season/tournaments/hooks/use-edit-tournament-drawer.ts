import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  type CreateTournamentFormValues,
  createTournamentSchema,
  TOURNAMENT_FORMATS,
} from '../types';
import { useTournament } from './use-tournament';
import { useUpdateTournament } from './use-update-tournament';

type UseEditTournamentDrawerProps = {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useEditTournamentDrawer = ({
  id,
  open,
  onOpenChange,
}: UseEditTournamentDrawerProps) => {
  const { data: tournament } = useTournament(id, open);
  const { mutate, isPending } = useUpdateTournament(id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(createTournamentSchema),
    values: {
      name: tournament?.name ?? '',
      format: tournament?.format ?? TOURNAMENT_FORMATS[0],
      maxTeams: tournament ? String(tournament.maxTeams) : '',
    },
  });

  const onSubmit = (values: CreateTournamentFormValues) => {
    mutate(
      {
        name: values.name,
        format: values.format,
        maxTeams: Number(values.maxTeams),
      },
      {
        onSuccess: () => {
          toast.success(`Torneio "${values.name}" atualizado com sucesso.`);
          onOpenChange(false);
        },
      },
    );
  };

  return {
    tournament,
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    onSubmit,
    errors,
    isPending,
  };
};
