import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type CreateSeasonFormValues, createSeasonSchema } from '../types';
import { useSeason } from './use-season';
import { useUpdateSeason } from './use-update-season';

type UseEditSeasonDrawerProps = {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useEditSeasonDrawer = ({
  id,
  open,
  onOpenChange,
}: UseEditSeasonDrawerProps) => {
  const { data: season } = useSeason(id, open);
  const { mutate, isPending } = useUpdateSeason(id);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSeasonFormValues>({
    resolver: zodResolver(createSeasonSchema),
    values: { name: season?.name ?? '' },
  });

  const onSubmit = (values: CreateSeasonFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(`Temporada "${values.name}" atualizada com sucesso.`);
        onOpenChange(false);
      },
    });
  };

  return {
    season,
    register,
    reset,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
  };
};
