import type { LucideIcon } from 'lucide-react';
import { UploadIcon, XIcon } from 'lucide-react';
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
} from '@/components/ui';
import type { ImportFileScreenState } from '../hooks';

type ImportFileCardProps = {
  formId: string;
  title: string;
  description: string;
  fileFieldLabel: string;
  fileHint: string;
  accept: string;
  icon: LucideIcon;
  submitLabel: string;
  pendingLabel: string;
  screen: ImportFileScreenState;
};

export const ImportFileCard = ({
  formId,
  title,
  description,
  fileFieldLabel,
  fileHint,
  accept,
  icon: Icon,
  submitLabel,
  pendingLabel,
  screen,
}: ImportFileCardProps) => {
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
  } = screen;

  return (
    <Card className={'w-full'}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.file}>
              <FieldLabel htmlFor={`${formId}-file`}>
                {fileFieldLabel}
              </FieldLabel>
              <Attachment
                state={errors.file ? 'error' : file ? 'done' : 'idle'}
                className={'w-full'}
              >
                {!file && (
                  <AttachmentTrigger
                    aria-label={fileFieldLabel}
                    onClick={() => fileInputRef.current?.click()}
                  />
                )}
                <AttachmentMedia>
                  <Icon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>
                    {file ? file.name : fileFieldLabel}
                  </AttachmentTitle>
                  <AttachmentDescription>
                    {file ? formatFileSize(file.size) : fileHint}
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
                  id={`${formId}-file`}
                  type={'file'}
                  accept={accept}
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
              <FieldLabel htmlFor={`${formId}-captured-at`}>
                Data da coleta
              </FieldLabel>
              <Input
                id={`${formId}-captured-at`}
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
        <Button type={'submit'} form={formId} disabled={isPending}>
          <UploadIcon />
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
