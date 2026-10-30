import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib';
import {
  type ImportPlayersFormValues,
  importPlayersSchema,
} from '../../players';
import { useImportPlayers } from './use-import-players';

const pluralize = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;

const formatFileSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export const useImportPlayersScreen = () => {
  const { mutate, isPending } = useImportPlayers();

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    watch,
    formState: { errors },
  } = useForm<ImportPlayersFormValues>({
    resolver: zodResolver(importPlayersSchema),
  });

  const file = watch('file')?.item(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRegister = register('file');

  const onSubmit = (values: ImportPlayersFormValues) => {
    const file = values.file.item(0);
    if (!file) return;

    mutate(
      { file, capturedAt: values.capturedAt || undefined },
      {
        onSuccess: (result) => {
          toast.success(
            `${result.processed} ${pluralize(result.processed, 'jogador processado', 'jogadores processados')}, ${result.ratingsInserted} ${pluralize(result.ratingsInserted, 'nova avaliação registrada', 'novas avaliações registradas')}.`,
          );
          reset();
        },
        onError: (err) => {
          toast.error(
            getErrorMessage(err, 'Não foi possível importar os jogadores.'),
          );
        },
      },
    );
  };

  return {
    isPending,
    handleSubmit,
    onSubmit,
    file,
    fileInputRef,
    resetField,
    errors,
    formatFileSize,
    register,
    fileRegister,
  };
};
