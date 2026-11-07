import { useState } from 'react';
import { useParams } from 'react-router';
import { Badge, Tabs, TabsList, TabsTab } from 'src/components/ui';
import { useSelectedSeason } from 'src/features/admin';
import { getFormationLabel, useLineup } from 'src/features/season/squads';
import { cn, getOverallRatingClassName } from 'src/lib';
import { TeamLineupBench } from '../team-lineup-bench';
import { TeamLineupList } from '../team-lineup-list';
import { TeamLineupPitch } from '../team-lineup-pitch';
import { TeamLineupStrength } from '../team-lineup-strength';

type LineupView = 'pitch' | 'list';

export const TeamLineupTab = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedSeason } = useSelectedSeason();
  const { data, isPending } = useLineup(selectedSeason?.id, id);

  const [view, setView] = useState<LineupView>('pitch');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const starters = data?.starters ?? [];
  const bench = data?.bench ?? [];

  const xiAverage = starters.length
    ? starters.reduce((sum, player) => sum + player.overallRating, 0) /
      starters.length
    : null;

  if (!isPending && starters.length === 0) {
    return (
      <p className={'text-center text-muted-foreground text-sm'}>
        Escalação titular ainda não foi importada para esse time.
      </p>
    );
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-wrap items-center justify-between gap-3'}>
        <div className={'flex flex-wrap items-center gap-2.5'}>
          <Badge
            className={
              'border-transparent bg-accent font-mono text-accent-foreground'
            }
          >
            {getFormationLabel(data?.formation ?? null)}
          </Badge>

          {xiAverage !== null && (
            <span
              className={
                'flex items-center gap-1.5 text-muted-foreground text-xs'
              }
            >
              Força média do XI
              <Badge
                variant={'outline'}
                className={cn(
                  'font-mono',
                  getOverallRatingClassName(Math.round(xiAverage)),
                )}
              >
                {Math.round(xiAverage)}
              </Badge>
            </span>
          )}
        </div>

        <Tabs
          value={view}
          onValueChange={(value) => setView(value as LineupView)}
        >
          <TabsList>
            <TabsTab value={'pitch'}>Campo</TabsTab>
            <TabsTab value={'list'}>Lista</TabsTab>
          </TabsList>
        </Tabs>
      </div>

      {/*{selectedPlayer && (*/}
      {/*  <TeamLineupPlayerDetail*/}
      {/*    player={selectedPlayer}*/}
      {/*    starters={starters}*/}
      {/*    onClose={() => setSelectedId(null)}*/}
      {/*  />*/}
      {/*)}*/}

      <div className={'grid grid-cols-1 items-start gap-4 lg:grid-cols-2'}>
        {view === 'pitch' ? (
          <TeamLineupPitch
            lineup={starters}
            formation={data?.formation ?? null}
            isPending={isPending}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <TeamLineupList
            starters={starters}
            isPending={isPending}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        <div className={'flex flex-col gap-4'}>
          <TeamLineupStrength starters={starters} />
          <TeamLineupBench
            bench={bench}
            isPending={isPending}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
};
