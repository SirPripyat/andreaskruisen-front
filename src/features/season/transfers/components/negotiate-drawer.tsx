import { Cpu as CpuIcon, HandshakeIcon } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { useMe } from '@/features/auth';
import { DirectNegotiationForm } from '@/features/season/negotiations';
import { cn } from '@/lib';
import { CpuTransferForm } from './cpu-transfer-form';
import {
  type NegotiateMode,
  NegotiateModeSwitch,
} from './negotiate-mode-switch';

const MODE_DESCRIPTION: Record<NegotiateMode, string> = {
  direct:
    'Proponha uma troca, compra ou venda com outro participante. Fica pendente até o outro lado aceitar.',
  cpu: 'Troque jogadores com um time de CPU pelo valor de mercado. Executado na hora, sem necessidade de aceite.',
};

const MODE_NOTE: Record<NegotiateMode, string> = {
  direct:
    'Você propõe, o outro técnico decide — pode envolver jogador, dinheiro, os dois, e até cláusulas como lei do ex ou direito de recompra.',
  cpu: 'Times de CPU não têm técnico pra aceitar propostas — por isso a troca com eles acontece na hora, pela fórmula de overall, e pode usar cupom de isenção.',
};

const MODE_BADGE_LABEL: Record<NegotiateMode, string> = {
  direct: 'Negociação direta',
  cpu: 'Troca com time de CPU',
};

type NegotiateDrawerProps = {
  seasonId: string | undefined;
  windowClosed?: boolean;
  trigger?: ReactElement;
  // Contexto fixo (ex.: botão "Negociar" de um jogador específico — ver
  // NegotiateButton) já sabe se o outro lado é CPU ou participante, então
  // chega aqui com o modo certo e o time/jogador pré-selecionados.
  initialMode?: NegotiateMode;
  counterpartTeamId?: string;
  myPlayerId?: string;
  counterpartPlayerId?: string;
};

export const NegotiateDrawer = ({
  seasonId,
  windowClosed,
  trigger,
  initialMode = 'direct',
  counterpartTeamId,
  myPlayerId,
  counterpartPlayerId,
}: NegotiateDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<NegotiateMode>(initialMode);
  const { data: me } = useMe();
  const isAdmin = me?.role === 'ADMIN';

  // Time já definido de fora — trocar de modo não faz sentido (o outro
  // lado é CPU ou participante, nunca os dois), então o seletor nem
  // aparece, só um selo informativo.
  const modeLocked = Boolean(counterpartTeamId);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          trigger ?? (
            <Button
              disabled={!seasonId || windowClosed || (!isAdmin && !me?.teamId)}
            >
              <HandshakeIcon />
              {'Negociar'}
            </Button>
          )
        }
      />
      <SheetContent className={'w-full data-[side=right]:sm:max-w-3xl'}>
        <SheetHeader>
          <SheetTitle className={'font-display text-2xl'}>
            {'Negociar'}
          </SheetTitle>
          <SheetDescription>{MODE_DESCRIPTION[mode]}</SheetDescription>
        </SheetHeader>

        <div className={'flex flex-col gap-3 px-4'}>
          {modeLocked ? (
            <Badge
              variant={'outline'}
              className={cn(
                'w-fit gap-1.5 border-transparent',
                mode === 'direct'
                  ? 'bg-warning-surface text-warning'
                  : 'bg-value/10 text-value',
              )}
            >
              {mode === 'direct' ? (
                <HandshakeIcon className={'size-3.5'} />
              ) : (
                <CpuIcon className={'size-3.5'} />
              )}
              {MODE_BADGE_LABEL[mode]}
            </Badge>
          ) : (
            <NegotiateModeSwitch mode={mode} onModeChange={setMode} />
          )}

          <p
            className={
              'rounded-lg border bg-muted/30 px-3 py-2 text-muted-foreground text-xs leading-relaxed'
            }
          >
            {MODE_NOTE[mode]}
          </p>
        </div>

        {mode === 'direct' ? (
          <DirectNegotiationForm
            open={open}
            targetTeamId={counterpartTeamId}
            outgoingPlayerId={myPlayerId}
            incomingPlayerId={counterpartPlayerId}
            onSuccess={() => setOpen(false)}
          />
        ) : (
          <CpuTransferForm
            open={open}
            incomingTeamId={counterpartTeamId}
            outgoingPlayerId={myPlayerId}
            incomingPlayerId={counterpartPlayerId}
            onSuccess={() => setOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
