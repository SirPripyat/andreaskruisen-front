import { zodResolver } from '@hookform/resolvers/zod';
import { UploadIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PageHeader } from '@/components';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from '@/components/ui';
import { getErrorMessage } from '@/lib';
import { type ImportPlayersFormValues, importPlayersSchema } from './api';
import { useImportPlayers } from './hooks';

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function ImportPlayersScreen() {
  const { mutate, isPending } = useImportPlayers();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ImportPlayersFormValues>({
    resolver: zodResolver(importPlayersSchema),
  });

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

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PageHeader
        title="Importar jogadores"
        description="Envie o arquivo JSON exportado pelo scraper para atualizar a base de jogadores, times e avaliações."
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Arquivo do scraper</CardTitle>
          <CardDescription>
            O arquivo deve conter a lista de jogadores no formato gerado pelo
            scraper (até 50 MB).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="import-players-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.file}>
                <FieldLabel htmlFor="import-players-file">
                  Arquivo JSON
                </FieldLabel>
                <Input
                  id="import-players-file"
                  type="file"
                  accept="application/json,.json"
                  aria-invalid={!!errors.file}
                  {...register('file')}
                />
                <FieldError errors={errors.file ? [errors.file] : undefined} />
              </Field>

              <Field data-invalid={!!errors.capturedAt}>
                <FieldLabel htmlFor="import-players-captured-at">
                  Data da coleta
                </FieldLabel>
                <Input
                  id="import-players-captured-at"
                  type="date"
                  aria-invalid={!!errors.capturedAt}
                  {...register('capturedAt')}
                />
                <FieldDescription>
                  Opcional. Se não informada, assume o momento do envio.
                </FieldDescription>
                <FieldError
                  errors={errors.capturedAt ? [errors.capturedAt] : undefined}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" form="import-players-form" disabled={isPending}>
            <UploadIcon />
            {isPending ? 'Importando...' : 'Importar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
