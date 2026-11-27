import { useParams } from 'react-router';
import { Skeleton, Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui';
import {
  type PlayerDetailTab,
  PlayerPositionRatings,
  SimilarPlayersPanel,
  usePlayer,
  usePlayerDetailTabs,
} from '@/features/season/players';
import { useBreadcrumbItems } from '@/hooks';
import {
  calculateAge,
  getOverallRatingTier,
  getPositionGroup,
  type OverallRatingTier,
} from '@/lib';
import { PlayerAttributesPanel, PlayerInfoPanel } from './components';

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
        goalsScored={player.stats.goalsScored}
        goalsAssisted={player.stats.goalsAssisted}
        statTierClassName={statTierClassName}
      />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as PlayerDetailTab)}
        className={'w-full items-stretch'}
      >
        <div className={'sticky -top-5 z-10 flex flex-col bg-card'}>
          <div className={'flex justify-center py-2'}>
            <TabsList>
              <TabsTab value={'attributes'}>{'Atributos'}</TabsTab>
              <TabsTab value={'positions'}>{'Posições'}</TabsTab>
              <TabsTab value={'players'}>{'Jogadores Semelhantes'}</TabsTab>
            </TabsList>
          </div>
        </div>

        <TabsPanel value={'attributes'}>
          {player.latestRating && (
            <PlayerAttributesPanel
              rating={player.latestRating}
              isGoalkeeper={isGoalkeeper}
            />
          )}
        </TabsPanel>

        <TabsPanel value={'positions'}>
          {player.latestRating && (
            <PlayerPositionRatings
              positionRatings={player.latestRating.positionRatings}
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
