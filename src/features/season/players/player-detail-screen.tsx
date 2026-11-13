import { useParams } from 'react-router';
import { Skeleton, Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui';
import { useBreadcrumbItems } from '@/hooks';
import {
  calculateAge,
  getOverallRatingTier,
  getPositionGroup,
  type OverallRatingTier,
} from '@/lib';
import {
  PlayerAttributesPanel,
  PlayerInfoPanel,
  PlayerStatSquare,
  SimilarPlayersPanel,
} from './components';
import { type PlayerDetailTab, usePlayer, usePlayerDetailTabs } from './hooks';

const RATING_TIER_BORDER_LEFT_CLASS: Record<OverallRatingTier, string> = {
  info: 'border border-l-3 border-l-info',
  success: 'border border-l-3 border-l-success',
  warning: 'border border-l-3 border-l-warning',
  critical: 'border border-l-3 border-l-critical',
};

const leftBorderColor = (overall: number) =>
  RATING_TIER_BORDER_LEFT_CLASS[getOverallRatingTier(overall)];

export const PlayerDetailScreen = () => {
  const { id } = useParams<{ id: string }>();

  const { data: player, isPending } = usePlayer(id);
  const { tab, setTab } = usePlayerDetailTabs('attributes');

  useBreadcrumbItems([{ label: player?.name ?? '' }]);

  if (isPending || !player) {
    return (
      <div className={'flex flex-col gap-4'}>
        <Skeleton className={'h-24 w-full'} />
        <Skeleton className={'h-32 w-full'} />
      </div>
    );
  }

  const isGoalkeeper = player.positions.some(
    ({ position }) => getPositionGroup(position) === 'GOL',
  );

  const overall = player.latestRating?.overallRating ?? null;
  const statTierClassName =
    overall !== null
      ? leftBorderColor(Math.round(overall))
      : 'bg-muted/40 text-foreground';

  return (
    <div className={'flex flex-col gap-4'}>
      <PlayerInfoPanel
        playerId={player.id}
        photoUrl={player.photoUrl}
        name={player.name}
        team={player.team}
        nationality={player.nationality}
        positions={player.positions}
        preferredFoot={player.preferredFoot}
        age={calculateAge(player.birthdate)}
        overall={overall}
        isFavorite={player.isFavorite}
      />

      <div className={'grid grid-cols-3 gap-3'}>
        <PlayerStatSquare
          label={'Gols'}
          value={String(player.stats.goalsScored)}
          sub={'Na temporada'}
          tierClassName={statTierClassName}
        />
        <PlayerStatSquare
          label={'Assistências'}
          value={String(player.stats.goalsAssisted)}
          sub={'Na temporada'}
          tierClassName={statTierClassName}
        />
        <PlayerStatSquare
          label={'G + A'}
          value={String(player.stats.goalsScored + player.stats.goalsAssisted)}
          sub={'Participação direta'}
          tierClassName={statTierClassName}
        />
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as PlayerDetailTab)}
        className={'w-full items-center'}
      >
        <TabsList>
          <TabsTab value={'attributes'}>{'Atributos'}</TabsTab>
          <TabsTab value={'players'}>{'Jogadores'}</TabsTab>
        </TabsList>

        <TabsPanel value={'attributes'}>
          {player.latestRating && (
            <PlayerAttributesPanel
              rating={player.latestRating}
              isGoalkeeper={isGoalkeeper}
            />
          )}
        </TabsPanel>

        <TabsPanel value={'players'}>
          <SimilarPlayersPanel playerId={player.id} />
        </TabsPanel>
      </Tabs>
    </div>
  );
};
