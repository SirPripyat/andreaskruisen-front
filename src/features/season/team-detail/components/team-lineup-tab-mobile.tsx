import type { UseMutationResult } from '@tanstack/react-query';
import {
  ArrowLeftRightIcon,
  CheckIcon,
  PencilIcon,
  SquareCheckIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@/components/ui';
import type { PositionCode } from '@/features/admin/players';
import {
  type Formation,
  getFormationLabel,
  getOverallAtPosition,
  type RosterPlayer,
} from '@/features/season/squads';
import {
  cn,
  getInitials,
  getOverallRatingTextClassName,
  getPositionGroupClassName,
} from '@/lib';
import { TeamLineupBenchMobile } from './team-lineup-bench-mobile';
import {
  FORMATION_PREVIEW_HEIGHT,
  FormationPreview,
  PITCH_WIDTH,
  type PitchSlot,
  TeamLineupPitchMobile,
} from './team-lineup-pitch';
import { TeamLineupPlayerDetail } from './team-lineup-player-detail';
import { TeamLineupStrengthMobile } from './team-lineup-strength-mobile';

type SetStarterMutation = UseMutationResult<
  unknown,
  Error,
  { playerId: string; isStarter: boolean; position?: PositionCode }
>;
type SwapStarterMutation = UseMutationResult<
  unknown,
  Error,
  { starterOutId: string; benchInId: string }
>;
type UpdateFormationMutation = UseMutationResult<unknown, Error, Formation>;

type SubstituteCandidateCardProps = {
  candidate: RosterPlayer;
  targetPosition: PositionCode;
  // Preenchido só quando o candidato é titular — mostra o efeito colateral
  // da troca (quem sai da vaga de origem) antes do usuário confirmar, em
  // vez de deixar pra descobrir depois.
  relocationNote?: string;
  onPick: () => void;
};

// Card grande de candidato — nome, posição, status e o overall NA vaga que
// ele vai ocupar (não na posição principal dele), colorido pelo tier, bem
// visível pra escolher rápido com o polegar.
const SubstituteCandidateCard = ({
  candidate,
  targetPosition,
  relocationNote,
  onPick,
}: SubstituteCandidateCardProps) => (
  <button
    type={'button'}
    onClick={onPick}
    className={
      'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted/50'
    }
  >
    <Avatar className={'size-16'}>
      <AvatarImage src={candidate.photoUrl} alt={''} />
      <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
    </Avatar>

    <span className={'flex min-w-0 flex-1 flex-col gap-1'}>
      <span className={'truncate font-semibold text-base'}>
        {candidate.name}
      </span>
      <span className={'flex items-center gap-2'}>
        <span
          className={cn(
            'w-fit rounded px-1.5 py-0.5 font-mono text-[11px]',
            getPositionGroupClassName(candidate.position),
          )}
        >
          {candidate.position}
        </span>
        <span className={'text-muted-foreground text-xs'}>
          {candidate.isStarter ? 'Titular' : 'Banco'}
        </span>
      </span>
      {relocationNote && (
        <span
          className={
            'flex items-center gap-1 font-mono text-[11px] text-accent'
          }
        >
          <ArrowLeftRightIcon className={'size-3'} />
          {relocationNote}
        </span>
      )}
    </span>

    <span
      className={cn(
        'font-display font-bold text-2xl tabular-nums',
        getOverallRatingTextClassName(
          Math.round(getOverallAtPosition(candidate, targetPosition)),
        ),
      )}
    >
      {Math.round(getOverallAtPosition(candidate, targetPosition))}
    </span>
  </button>
);

type SubstituteSheetBodyProps = {
  slot: PitchSlot;
  bench: RosterPlayer[];
  starters: RosterPlayer[];
  onSendToBench: () => void;
  onPickCandidate: (candidateId: string) => void;
};

type CandidateListProps = {
  candidates: RosterPlayer[];
  slot: PitchSlot;
  emptyLabel: string;
  onPickCandidate: (candidateId: string) => void;
};

// Cada aba lista um grupo fixo (recomendação, banco ou outros titulares) —
// só o titular ganha a nota de troca, já que é o único caso com efeito
// colateral numa outra posição.
const CandidateList = ({
  candidates,
  slot,
  emptyLabel,
  onPickCandidate,
}: CandidateListProps) => {
  if (candidates.length === 0) {
    return (
      <p className={'py-6 text-center text-muted-foreground text-sm'}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className={'flex flex-col gap-2'}>
      {candidates.map((candidate) => (
        <SubstituteCandidateCard
          key={candidate.id}
          candidate={candidate}
          targetPosition={slot.position}
          relocationNote={
            candidate.isStarter
              ? slot.player
                ? `${slot.player.name} vai pra ${candidate.position}`
                : `deixa a posição ${candidate.position} vazia`
              : undefined
          }
          onPick={() => onPickCandidate(candidate.id)}
        />
      ))}
    </div>
  );
};

const isFit = (candidate: RosterPlayer, position: PositionCode) =>
  candidate.positions.some(
    (candidatePosition) => candidatePosition.position === position,
  );

const byOverallAtPosition = (
  position: PositionCode,
  a: RosterPlayer,
  b: RosterPlayer,
) => getOverallAtPosition(b, position) - getOverallAtPosition(a, position);

// Três abas fixas em vez de uma lista só ordenada por nota: Recomendação
// junta banco e titulares que de fato encaixam na vaga (quem joga ali de
// verdade, ver `positions[].isPrimary`); Banco e Outros titulares deixam
// navegar o grupo inteiro quando a recomendação não é o que o usuário quer.
const SubstituteSheetBody = ({
  slot,
  bench,
  starters,
  onSendToBench,
  onPickCandidate,
}: SubstituteSheetBodyProps) => {
  const otherStarters = starters.filter(
    (player) => player.id !== slot.player?.id,
  );

  const benchCandidates = [...bench].sort((a, b) =>
    byOverallAtPosition(slot.position, a, b),
  );
  const starterCandidates = [...otherStarters].sort((a, b) =>
    byOverallAtPosition(slot.position, a, b),
  );
  const recommended = [...benchCandidates, ...starterCandidates]
    .filter((candidate) => isFit(candidate, slot.position))
    .sort((a, b) => byOverallAtPosition(slot.position, a, b));

  return (
    <div className={'flex min-h-0 flex-1 flex-col gap-3 px-4'}>
      {slot.player && (
        <Button variant={'outline'} size={'sm'} onClick={onSendToBench}>
          Mandar {slot.player.name} para o banco
        </Button>
      )}

      <Tabs
        defaultValue={'reco'}
        className={'flex min-h-0 flex-1 flex-col gap-3'}
      >
        <TabsList className={'w-full'}>
          <TabsTab value={'reco'}>Recomendação ({recommended.length})</TabsTab>
          <TabsTab value={'bench'}>Banco ({benchCandidates.length})</TabsTab>
          <TabsTab value={'starters'}>
            Titulares ({starterCandidates.length})
          </TabsTab>
        </TabsList>

        <TabsPanel value={'reco'} className={'overflow-y-auto'}>
          <CandidateList
            candidates={recommended}
            slot={slot}
            emptyLabel={'Nenhum jogador encaixa nessa posição.'}
            onPickCandidate={onPickCandidate}
          />
        </TabsPanel>
        <TabsPanel value={'bench'} className={'overflow-y-auto'}>
          <CandidateList
            candidates={benchCandidates}
            slot={slot}
            emptyLabel={'Banco vazio.'}
            onPickCandidate={onPickCandidate}
          />
        </TabsPanel>
        <TabsPanel value={'starters'} className={'overflow-y-auto'}>
          <CandidateList
            candidates={starterCandidates}
            slot={slot}
            emptyLabel={'Nenhum outro titular disponível.'}
            onPickCandidate={onPickCandidate}
          />
        </TabsPanel>
      </Tabs>
    </div>
  );
};

type TeamLineupTabMobileProps = {
  starters: RosterPlayer[];
  bench: RosterPlayer[];
  isPending: boolean;
  isBenchPending: boolean;
  formation: Formation | null;
  formationOptions: { value: Formation; label: string }[];
  xiAverage: number | null;
  canEditLineup: boolean;
  editMode: boolean;
  onToggleEditMode: () => void;
  selectedId: string | null;
  onSelect: (playerId: string) => void;
  allPlayers: Map<string, RosterPlayer>;
  setStarter: SetStarterMutation;
  swapStarter: SwapStarterMutation;
  updateFormation: UpdateFormationMutation;
};

// Sem arraste: tocar num titular (ou vaga livre) no campo, dentro da
// edição, abre um modal com os candidatos pra entrar naquela posição —
// reservas e outros titulares, igual ao conjunto de alvos do drag-and-drop
// do desktop — e tocar num candidato já efetiva a troca. Formação e
// detalhe do jogador saem do dropdown/cartão inline e viram folhas
// inferiores, melhores pro polegar.
export const TeamLineupTabMobile = ({
  starters,
  bench,
  isPending,
  isBenchPending,
  formation,
  formationOptions,
  canEditLineup,
  editMode,
  onToggleEditMode,
  selectedId,
  onSelect,
  allPlayers,
  setStarter,
  swapStarter,
  updateFormation,
}: TeamLineupTabMobileProps) => {
  const [substituteSlot, setSubstituteSlot] = useState<PitchSlot | null>(null);
  const [formationSheetOpen, setFormationSheetOpen] = useState(false);

  const closeSubstituteSheet = () => setSubstituteSlot(null);

  const promote = (playerId: string, position: PositionCode) => {
    const player = allPlayers.get(playerId);
    setStarter.mutate(
      { playerId, isStarter: true, position },
      {
        onSuccess: () =>
          toast.success(
            player
              ? `${player.name} agora é titular.`
              : 'Escalação atualizada.',
          ),
      },
    );
  };

  const swap = (starterOutId: string, benchInId: string) => {
    const incoming = allPlayers.get(benchInId);
    swapStarter.mutate(
      { starterOutId, benchInId },
      {
        onSuccess: () =>
          toast.success(
            incoming
              ? `${incoming.name} agora é titular.`
              : 'Escalação atualizada.',
          ),
      },
    );
  };

  const benchPlayer = (playerId: string) => {
    const player = allPlayers.get(playerId);
    setStarter.mutate(
      { playerId, isStarter: false },
      {
        onSuccess: () =>
          toast.success(
            player
              ? `${player.name} foi para o banco.`
              : 'Escalação atualizada.',
          ),
      },
    );
  };

  const handlePitchTap = (slot: PitchSlot) => {
    if (!editMode) {
      if (slot.player) onSelect(slot.player.id);
      return;
    }
    setSubstituteSlot(slot);
  };

  const handleSendToBench = () => {
    if (!substituteSlot?.player) return;
    benchPlayer(substituteSlot.player.id);
    closeSubstituteSheet();
  };

  const handlePickCandidate = (candidateId: string) => {
    if (!substituteSlot) return;
    if (substituteSlot.player) {
      swap(substituteSlot.player.id, candidateId);
    } else {
      promote(candidateId, substituteSlot.position);
    }
    closeSubstituteSheet();
  };

  const selectedPlayer = selectedId ? allPlayers.get(selectedId) : null;

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-wrap items-center justify-between gap-3'}>
        <div className={'flex flex-wrap items-center gap-2.5'}>
          {editMode && formation ? (
            <Button
              type={'button'}
              variant={'outline'}
              size={'sm'}
              onClick={() => setFormationSheetOpen(true)}
              className={'font-mono'}
            >
              {getFormationLabel(formation)}
            </Button>
          ) : (
            <Badge
              className={
                'border-transparent bg-accent font-mono text-accent-foreground'
              }
            >
              {getFormationLabel(formation)}
            </Badge>
          )}
        </div>

        {canEditLineup && (
          <Button
            type={'button'}
            variant={editMode ? 'secondary' : 'outline'}
            size={'sm'}
            onClick={onToggleEditMode}
          >
            {editMode ? <SquareCheckIcon /> : <PencilIcon />}
            {editMode ? 'Concluir edição' : 'Editar escalação'}
          </Button>
        )}
      </div>

      {editMode && (
        <p className={'text-muted-foreground text-xs'}>
          Toque num titular (ou vaga livre) no campo pra escolher quem entra.
        </p>
      )}

      {!editMode && selectedId && (
        <Sheet open onOpenChange={(open) => !open && onSelect(selectedId)}>
          <SheetContent side={'bottom'} className={'h-auto max-h-[70%] gap-4'}>
            <SheetHeader>
              <SheetTitle>Detalhe do jogador</SheetTitle>
            </SheetHeader>
            {selectedPlayer && (
              <TeamLineupPlayerDetail
                player={selectedPlayer}
                starters={starters}
                onClose={() => onSelect(selectedId)}
              />
            )}
          </SheetContent>
        </Sheet>
      )}

      <Sheet
        open={!!substituteSlot}
        onOpenChange={(open) => !open && closeSubstituteSheet()}
      >
        <SheetContent side={'bottom'} className={'h-[75%] gap-4'}>
          <SheetHeader>
            <SheetTitle>
              {substituteSlot?.player
                ? `Substituir ${substituteSlot.player.name}`
                : `Escolher jogador — ${substituteSlot?.position ?? ''}`}
            </SheetTitle>
          </SheetHeader>

          {substituteSlot && (
            <SubstituteSheetBody
              slot={substituteSlot}
              bench={bench}
              starters={starters}
              onSendToBench={handleSendToBench}
              onPickCandidate={handlePickCandidate}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={formationSheetOpen} onOpenChange={setFormationSheetOpen}>
        <SheetContent side={'bottom'} className={'h-[70%] gap-4'}>
          <SheetHeader>
            <SheetTitle>Selecionar formação</SheetTitle>
          </SheetHeader>
          <div className={'grid grid-cols-3 gap-2 overflow-y-auto px-4'}>
            {formationOptions.map((option) => {
              const isSelected = option.value === formation;

              return (
                <button
                  key={option.value}
                  type={'button'}
                  onClick={() => {
                    updateFormation.mutate(option.value, {
                      onSuccess: () => toast.success('Formação atualizada.'),
                    });
                    setFormationSheetOpen(false);
                  }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-colors hover:bg-muted/50',
                    isSelected && 'border-accent bg-accent/10',
                  )}
                >
                  <div
                    className={
                      'relative w-full overflow-hidden rounded-lg border'
                    }
                    style={{
                      aspectRatio: `${PITCH_WIDTH} / ${FORMATION_PREVIEW_HEIGHT}`,
                    }}
                  >
                    <FormationPreview formation={option.value} />
                    {isSelected && (
                      <span
                        className={
                          'absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-accent text-accent-foreground'
                        }
                      >
                        <CheckIcon className={'size-2.5'} />
                      </span>
                    )}
                  </div>
                  <span className={'text-[11px] leading-tight'}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <TeamLineupPitchMobile
        starters={starters}
        formation={formation}
        isPending={isPending}
        editable={editMode}
        onTapSlot={handlePitchTap}
      />

      <TeamLineupStrengthMobile starters={starters} />

      <TeamLineupBenchMobile
        bench={bench}
        isPending={isBenchPending}
        onTap={onSelect}
      />
    </div>
  );
};
