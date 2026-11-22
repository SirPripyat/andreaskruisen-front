import { ChevronDownIcon, DicesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
} from '@/components/ui';
import { cn } from '@/lib';
import type { MatchListItem, PhaseSummary } from '../types';
import { MatchCard } from './match-card';
import { MatchGrid } from './match-grid';

const ROUND_NAV_THRESHOLD = 3;

type PhaseSectionProps = {
  phase: PhaseSummary;
  matches: MatchListItem[];
  isLatestPhase: boolean;
  onRegisterGoals?: (matchId: string) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (matchId: string) => void;
  onSimulateIds?: (matchIds: string[]) => void;
  // Ação extra renderizada na mesma linha dos chips de rodada (ex.: filtro
  // "Meus times") — só faz sentido quando a fase usa navegação por rodada.
  roundNavExtra?: ReactNode;
  // No carrossel de fases do mobile, quem decide qual fase aparece é o
  // carrossel — o próprio cabeçalho (nome da fase, "Encerrada", chevron de
  // colapsar) fica redundante e some.
  hideHeader?: boolean;
};

const groupByRound = (matches: MatchListItem[]) => {
  const rounds = new Map<number | null, MatchListItem[]>();

  for (const match of matches) {
    const list = rounds.get(match.round) ?? [];
    list.push(match);
    rounds.set(match.round, list);
  }

  return Array.from(rounds.entries()).sort(([a], [b]) => {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a - b;
  });
};

export const PhaseSection = ({
  phase,
  matches,
  isLatestPhase,
  onRegisterGoals,
  selectedIds,
  onToggleSelect,
  onSimulateIds,
  roundNavExtra,
  hideHeader,
}: PhaseSectionProps) => {
  const pendingInPhase = matches
    .filter((match) => match.homeScore === null)
    .map((match) => match.id);

  const rounds: Array<[number | null, MatchListItem[]]> =
    phase.type === 'GROUP' ? groupByRound(matches) : [];

  // A vigente é a primeira rodada com jogo pendente — não a última rodada
  // do calendário, que já existe de antemão pra todo o campeonato.
  const currentRound =
    rounds.find(([, roundMatches]) =>
      roundMatches.some((match) => match.homeScore === null),
    )?.[0] ?? rounds[rounds.length - 1]?.[0];

  const isFullyPlayed = matches.length > 0 && pendingInPhase.length === 0;
  // Fase já concluída e que não é mais a vigente — recolhe por padrão pra
  // não empilhar o histórico inteiro do torneio na tela de jogos.
  const collapsible = !isLatestPhase && isFullyPlayed;
  const [open, setOpen] = useState(false);

  // Liga tem muitas rodadas — em vez de empilhar todas (como faz o grupo
  // pequeno do híbrido), mostra uma rodada por vez e troca pelo clique nos
  // botões, com a vigente selecionada por padrão.
  const showRoundNav =
    phase.type === 'GROUP' && rounds.length > ROUND_NAV_THRESHOLD;
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const activeRound = selectedRound ?? currentRound;
  const visibleRounds = showRoundNav
    ? rounds.filter(([round]) => round === activeRound)
    : rounds;

  const simulateButton = isLatestPhase &&
    onSimulateIds &&
    pendingInPhase.length > 0 && (
      <Button
        type={'button'}
        variant={'outline'}
        size={'sm'}
        onClick={() => onSimulateIds(pendingInPhase)}
      >
        <DicesIcon />
        {'Simular pendentes ('}
        {pendingInPhase.length}
        {')'}
      </Button>
    );

  // Liga: "Liga" como nome de fase não agrega nada (só existe essa fase) e
  // o rótulo "Rodada N" repetiria o que o próprio botão já ativo já diz —
  // os chips substituem o cabeçalho por completo.
  const header = showRoundNav ? (
    <div
      className={
        'flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'
      }
    >
      <div className={'flex gap-1.5 overflow-x-auto pb-1'}>
        {rounds.map(([round, roundMatches]) => {
          const isFutureRound = roundMatches.every(
            (match) => match.homeScore === null,
          );

          return (
            <button
              key={round ?? 'single'}
              type={'button'}
              onClick={() => setSelectedRound(round)}
              className={cn(
                'shrink-0 rounded-md border px-2.5 py-1 font-mono text-xs font-semibold transition-colors',
                round === activeRound
                  ? 'border-accent bg-accent text-accent-foreground'
                  : cn(
                      'text-muted-foreground hover:bg-background',
                      isFutureRound
                        ? 'border-dashed border-border-strong'
                        : 'border-border-strong',
                    ),
              )}
            >
              {'R'}
              {round}
            </button>
          );
        })}
      </div>

      <div className={'flex shrink-0 items-center gap-2'}>
        {simulateButton}
        {roundNavExtra}
      </div>
    </div>
  ) : collapsible ? (
    <CollapsibleTrigger
      className={'flex w-full items-center justify-between gap-2'}
    >
      <span className={'flex items-center gap-2'}>
        <span className={'font-display font-bold text-lg uppercase'}>
          {phase.name}
        </span>
        <Badge variant={'secondary'}>Encerrada</Badge>
      </span>

      <ChevronDownIcon
        className={cn(
          'size-4 shrink-0 text-muted-foreground transition-transform',
          open && 'rotate-180',
        )}
      />
    </CollapsibleTrigger>
  ) : (
    <div className={'flex items-center justify-between gap-4'}>
      <Separator className={'shrink'} />

      <h2 className={'shrink-0 font-display font-bold text-lg uppercase'}>
        {phase.name}
      </h2>

      <Separator className={'shrink'} />

      <div className={'flex shrink-0 items-center gap-2'}>{simulateButton}</div>
    </div>
  );

  const body = (
    <div className={'flex flex-col gap-4'}>
      {phase.type === 'GROUP' ? (
        visibleRounds.map(([round, roundMatches]) => (
          <MatchGrid
            key={round ?? 'single'}
            matches={roundMatches}
            roundLabel={
              showRoundNav
                ? undefined
                : round !== null
                  ? `Rodada ${round}`
                  : undefined
            }
            isCurrentRound={round === currentRound}
            onRegisterGoals={onRegisterGoals}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onSimulateIds={onSimulateIds}
          />
        ))
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 gap-2',
            // Fase com um único jogo (ex.: a Final) ocupa a linha toda em
            // vez de ficar espremida numa coluna de 2, com a outra vazia.
            matches.length > 1 && 'md:grid-cols-2',
          )}
        >
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              variant={'row'}
              onRegisterGoals={onRegisterGoals}
              cardClassName={'border bg-card'}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (hideHeader) {
    return (
      <div id={`phase-${phase.id}`} className={'flex flex-col gap-4'}>
        {body}
      </div>
    );
  }

  if (!collapsible) {
    return (
      <div id={`phase-${phase.id}`} className={'flex flex-col gap-4'}>
        {header}
        {body}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div id={`phase-${phase.id}`} className={'flex flex-col gap-4'}>
        {header}
        <CollapsibleContent>{body}</CollapsibleContent>
      </div>
    </Collapsible>
  );
};
