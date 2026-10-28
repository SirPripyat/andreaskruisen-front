import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { type LoginFormValues, loginSchema } from '../api';
import { useLogin } from './use-login';

export const useLoginForm = () => {
  const { mutate, isPending } = useLogin();

  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', pin: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => navigate('/'),
    });
  };

  return {
    handleSubmit,
    onSubmit,
    register,
    control,
    errors,
    isPending,
  };
};
