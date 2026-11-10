import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { Me } from '../api';
import { type UpdateProfileFormValues, updateProfileSchema } from '../api';
import { useUpdateMe } from './use-update-me';

export const useUpdateProfileForm = (me: Me) => {
  const { mutate, isPending } = useUpdateMe();

  const {
    register,
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: { name: me.name, pin: '' },
  });

  const onSubmit = (values: UpdateProfileFormValues) => {
    mutate(
      {
        name: values.name,
        pin: values.pin || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Perfil atualizado com sucesso.');
          resetField('pin');
        },
      },
    );
  };

  return {
    register,
    control,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
  };
};
