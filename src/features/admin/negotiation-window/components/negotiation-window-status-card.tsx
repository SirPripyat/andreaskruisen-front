import { DoorClosedIcon, DoorOpenIcon, TicketPercentIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Switch,
} from '@/components/ui';
import { formatDateTime, getErrorMessage } from '@/lib';
import { useCloseNegotiationWindow, useOpenNegotiationWindow } from '../hooks';
import type { NegotiationWindow } from '../types';

type NegotiationWindowStatusCardProps = {
  open: NegotiationWindow | null;
};

export const NegotiationWindowStatusCard = ({
  open,
}: NegotiationWindowStatusCardProps) => {
  const [feeEnabled, setFeeEnabled] = useState(true);
  const openMutation = useOpenNegotiationWindow();
  const closeMutation = useCloseNegotiationWindow();

  if (open) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={'flex items-center gap-2'}>
            <DoorOpenIcon className={'size-4 text-success'} />
            {'Janela aberta'}
          </CardTitle>

          <CardAction>
            <Button
              variant={'destructive'}
              size={'sm'}
              onClick={() => closeMutation.mutate()}
              disabled={closeMutation.isPending}
            >
              {closeMutation.isPending ? 'Fechando...' : 'Fechar janela'}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className={'flex flex-col gap-2'}>
          <div className={'flex items-center gap-2'}>
            <Badge
              variant={open.feeEnabled ? 'secondary' : 'outline'}
              className={'gap-1.5'}
            >
              <TicketPercentIcon className={'size-3.5'} />
              {open.feeEnabled
                ? 'Taxa de negociação ativada'
                : 'Taxa de negociação desativada'}
            </Badge>
          </div>

          <p className={'text-muted-foreground text-xs'}>
            {`Aberta por ${open.openedBy.name} em ${formatDateTime(open.openedAt)}.`}
          </p>

          {closeMutation.isError && (
            <p className={'text-destructive text-xs'}>
              {getErrorMessage(
                closeMutation.error,
                'Não foi possível fechar a janela.',
              )}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={'flex items-center gap-2'}>
          <DoorClosedIcon className={'size-4 text-muted-foreground'} />
          {'Janela fechada'}
        </CardTitle>
      </CardHeader>

      <CardContent className={'flex flex-col gap-4'}>
        <p className={'text-muted-foreground text-sm'}>
          {
            'Enquanto a janela estiver fechada, ninguém consegue criar transferências ou negociações diretas nessa temporada.'
          }
        </p>

        <div className={'flex items-center gap-2'}>
          <Switch
            id={'fee-enabled'}
            checked={feeEnabled}
            onCheckedChange={setFeeEnabled}
          />
          <Label htmlFor={'fee-enabled'} className={'text-sm'}>
            {'Cobrar taxa de negociação nessa janela'}
          </Label>
        </div>

        <Button
          className={'w-fit'}
          onClick={() => openMutation.mutate({ feeEnabled })}
          disabled={openMutation.isPending}
        >
          {openMutation.isPending ? 'Abrindo...' : 'Abrir janela'}
        </Button>

        {openMutation.isError && (
          <p className={'text-destructive text-xs'}>
            {getErrorMessage(
              openMutation.error,
              'Não foi possível abrir a janela.',
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
