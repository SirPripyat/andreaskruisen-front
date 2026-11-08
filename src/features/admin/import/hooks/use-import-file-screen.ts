import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatFileSize, getErrorMessage } from '@/lib';
import { type FileImportFormValues, fileImportSchema } from '../api';

type ImportMutate<TResult> = (
  payload: { file: File; capturedAt?: string },
  options: {
    onSuccess: (result: TResult) => void;
    onError: (error: unknown) => void;
  },
) => void;

type UseImportFileScreenOptions<TResult> = {
  mutate: ImportMutate<TResult>;
  getSuccessMessage: (result: TResult) => string;
  errorMessage: string;
};

export const useImportFileScreen = <TResult>({
  mutate,
  getSuccessMessage,
  errorMessage,
}: UseImportFileScreenOptions<TResult>) => {
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    watch,
    formState: { errors },
  } = useForm<FileImportFormValues>({
    resolver: zodResolver(fileImportSchema),
  });

  const file = watch('file')?.item(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRegister = register('file');

  const onSubmit = (values: FileImportFormValues) => {
    const file = values.file.item(0);
    if (!file) return;

    mutate(
      { file, capturedAt: values.capturedAt || undefined },
      {
        onSuccess: (result) => {
          toast.success(getSuccessMessage(result));
          reset();
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, errorMessage));
        },
      },
    );
  };

  return {
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

export type ImportFileScreenState = ReturnType<typeof useImportFileScreen> & {
  isPending: boolean;
};
