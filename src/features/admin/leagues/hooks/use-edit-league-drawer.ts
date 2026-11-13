import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { type EditLeagueFormValues, editLeagueSchema } from '../types';
import { useLeague } from './use-league';
import { useUpdateLeague } from './use-update-league';

type UseEditLeagueDrawerProps = {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useEditLeagueDrawer = ({
  id,
  open,
  onOpenChange,
}: UseEditLeagueDrawerProps) => {
  const { data: league } = useLeague(id, open);
  const { mutate, isPending } = useUpdateLeague(id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditLeagueFormValues>({
    resolver: zodResolver(editLeagueSchema),
    values: {
      name: league?.name ?? '',
      logoUrl: league?.logoUrl ?? '',
      country: league?.country ?? null,
    },
  });
  const logoUrl = useWatch({ control, name: 'logoUrl' });

  const onSubmit = (values: EditLeagueFormValues) => {
    mutate(
      {
        name: values.name,
        logoUrl: values.logoUrl || null,
        countryId: values.country?.id ?? null,
      },
      {
        onSuccess: () => {
          toast.success(`Liga "${values.name}" atualizada com sucesso.`);
          onOpenChange(false);
        },
      },
    );
  };

  return {
    league,
    register,
    control,
    handleSubmit,
    onSubmit,
    reset,
    logoUrl,
    errors,
    isPending,
  };
};
