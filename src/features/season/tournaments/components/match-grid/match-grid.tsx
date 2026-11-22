import type { MatchListItem } from '../../types';
import { MatchCard } from '../match-card/match-card';
import { GroupCard } from './group-card';
import { MatchRoundTitle } from './match-round-title';

type MatchGridProps = {
  matches: MatchListItem[];
  roundLabel?: string;
  isCurrentRound?: boolean;
  onRegisterGoals?: (matchId: string) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (matchId: string) => void;
  onSimulateIds?: (matchIds: string[]) => void;
};

const groupByLabel = (matches: MatchListItem[]) => {
  const groups = new Map<string | null, MatchListItem[]>();

  for (const match of matches) {
    const list = groups.get(match.groupLabel) ?? [];
    list.push(match);
    groups.set(match.groupLabel, list);
  }

  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b);
  });
};

export const MatchGrid = ({
  matches,
  roundLabel,
  isCurrentRound,
  onRegisterGoals,
  selectedIds,
  onToggleSelect,
  onSimulateIds,
}: MatchGridProps) => {
  const pendingInRound = matches
    .filter((match) => match.homeScore === null)
    .map((match) => match.id);

  const groups = groupByLabel(matches);
  // Liga não tem grupos de verdade — o back ainda assim marca um único
  // `groupLabel` em todo mundo. Com um grupo só, não faz sentido empacotar
  // tudo num card "Grupo X" (não há outro grupo pra diferenciar); cada
  // partida vira seu próprio card numa grade, igual mata-mata e híbrido.
  const hasMultipleGroups = groups.length > 1;

  return (
    <div className={'flex flex-col gap-1.5'}>
      <MatchRoundTitle
        roundLabel={roundLabel}
        isCurrentRound={isCurrentRound}
        pendingCount={pendingInRound.length}
        onSimulateRound={
          onSimulateIds ? () => onSimulateIds(pendingInRound) : undefined
        }
      />

      {hasMultipleGroups ? (
        <div
          className={
            'grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]'
          }
        >
          {groups.map(([groupLabel, groupMatches], index) => (
            <GroupCard
              key={groupLabel ?? 'single'}
              index={index}
              groupMatches={groupMatches}
              onRegisterGoals={onRegisterGoals}
              groupLabel={groupLabel}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div
          className={
            'grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-4'
          }
        >
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              variant={'row'}
              onRegisterGoals={onRegisterGoals}
              selected={selectedIds?.has(match.id)}
              onToggleSelect={onToggleSelect}
              cardClassName={'border bg-card'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
