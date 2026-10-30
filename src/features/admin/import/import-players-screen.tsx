import { FileJsonIcon, UploadIcon, XIcon } from 'lucide-react';
import { PageHeader } from 'src/components';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
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
} from 'src/components/ui';
import { useImportPlayersScreen } from './hooks';

export function ImportPlayersScreen() {
  const {
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
  } = useImportPlayersScreen();

  return (
    <>
      <PageHeader
        title={'Importar jogadores'}
        description={
          'Envie o arquivo JSON exportado pelo scraper para atualizar a base de jogadores, times e avaliações.'
        }
      />

      <Card className={'max-w-lg'}>
        <CardHeader>
          <CardTitle>Arquivo do scraper</CardTitle>
          <CardDescription>
            O arquivo deve conter a lista de jogadores no formato gerado pelo
            scraper (até 50 MB).
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id={'import-players-form'} onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.file}>
                <FieldLabel htmlFor={'import-players-file'}>
                  Arquivo JSON
                </FieldLabel>
                <Attachment
                  state={errors.file ? 'error' : file ? 'done' : 'idle'}
                  className={'w-full'}
                >
                  {!file && (
                    <AttachmentTrigger
                      aria-label={'Selecionar arquivo JSON'}
                      onClick={() => fileInputRef.current?.click()}
                    />
                  )}
                  <AttachmentMedia>
                    <FileJsonIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>
                      {file ? file.name : 'Selecionar arquivo JSON'}
                    </AttachmentTitle>
                    <AttachmentDescription>
                      {file ? formatFileSize(file.size) : 'Até 50 MB'}
                    </AttachmentDescription>
                  </AttachmentContent>
                  {file && (
                    <AttachmentActions>
                      <AttachmentAction
                        aria-label={'Remover arquivo'}
                        onClick={() => resetField('file')}
                      >
                        <XIcon />
                      </AttachmentAction>
                    </AttachmentActions>
                  )}
                  <input
                    id={'import-players-file'}
                    type={'file'}
                    accept={'application/json,.json'}
                    className={'sr-only'}
                    aria-invalid={!!errors.file}
                    {...fileRegister}
                    ref={(element) => {
                      fileRegister.ref(element);
                      fileInputRef.current = element;
                    }}
                  />
                </Attachment>
                <FieldError errors={errors.file ? [errors.file] : undefined} />
              </Field>

              <Field data-invalid={!!errors.capturedAt}>
                <FieldLabel htmlFor={'import-players-captured-at'}>
                  Data da coleta
                </FieldLabel>
                <Input
                  id={'import-players-captured-at'}
                  type={'date'}
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

        <CardFooter className={'justify-end'}>
          <Button
            type={'submit'}
            form={'import-players-form'}
            disabled={isPending}
          >
            <UploadIcon />
            {isPending ? 'Importando...' : 'Importar'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
