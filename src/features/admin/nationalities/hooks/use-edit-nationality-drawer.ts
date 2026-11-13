import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  type EditNationalityFormValues,
  editNationalitySchema,
} from '../types';
import { useNationality } from './use-nationality';
import { useUpdateNationality } from './use-update-nationality';

type UseEditNationalityDrawerProps = {
  id: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useEditNationalityDrawer = ({
  id,
  open,
  onOpenChange,
}: UseEditNationalityDrawerProps) => {
  const { data: nationality } = useNationality(id, open);
  const { mutate, isPending } = useUpdateNationality(id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditNationalityFormValues>({
    resolver: zodResolver(editNationalitySchema),
    values: {
      name: nationality?.name ?? '',
      flagUrl: nationality?.flagUrl ?? '',
    },
  });
  const flagUrl = useWatch({ control, name: 'flagUrl' });

  const onSubmit = (values: EditNationalityFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(`Nacionalidade "${values.name}" atualizada com sucesso.`);
        onOpenChange(false);
      },
    });
  };

  return {
    nationality,
    register,
    control,
    handleSubmit,
    onSubmit,
    reset,
    flagUrl,
    errors,
    isPending,
  };
};
