import { useParams } from 'react-router';
import { Skeleton } from 'src/components/ui';
import { useTeam } from 'src/features/admin/teams';
import { RatingTile } from '../rating-tile';
import { TeamHeadToHead } from '../team-head-to-head';
import { TeamLeadersList } from '../team-leaders-list';
import { TeamRecentForm, TeamRecentFormChips } from '../team-recent-form';
import { TeamSeasonCampaign } from '../team-season-campaign';
import { Section } from './section';

export const TeamOverviewTab = () => {
  const { id } = useParams<{ id: string }>();
  const { data: team, isPending } = useTeam(id);

  if (isPending || !team) {
    return (
      <div className={'flex flex-col gap-4'}>
        <Skeleton className={'h-24 w-full'} />
        <Skeleton className={'h-24 w-full'} />
        <Skeleton className={'h-24 w-full'} />
      </div>
    );
  }

  return (
    <div className={'flex flex-col gap-6 lg:flex-row'}>
      <div className={'flex flex-1 flex-col gap-6 lg:w-1/2'}>
        <Section
          title={'Campanha da Temporada'}
          meta={
            team.seasonCampaign && (
              <span className={'font-mono text-muted-foreground text-xs'}>
                {team.seasonCampaign.games} jogos · {team.seasonCampaign.points}{' '}
                pontos
              </span>
            )
          }
        >
          <TeamSeasonCampaign campaign={team.seasonCampaign} />
        </Section>

        <Section
          title={'Últimos Jogos'}
          meta={<TeamRecentFormChips matches={team.lastMatches} />}
        >
          <TeamRecentForm matches={team.lastMatches} />
        </Section>

        <Section title={'Artilheiros'}>
          <TeamLeadersList
            leaders={team.topScorers}
            countLabel={'gols'}
            emptyLabel={'Nenhum gol marcado nesta temporada.'}
          />
        </Section>

        <Section title={'Líder de Assistências'}>
          <TeamLeadersList
            leaders={team.topAssists}
            countLabel={'assist.'}
            emptyLabel={'Nenhuma assistência registrada nesta temporada.'}
          />
        </Section>
      </div>

      <div className={'flex w-full flex-col gap-6 lg:w-1/2'}>
        <Section title={'Perfil de Atributos'}>
          <div className={'grid grid-cols-2 gap-3'}>
            <RatingTile label={'Geral'} value={team.averageOverallRating} />
            <RatingTile label={'Ataque'} value={team.averageAttackRating} />
            <RatingTile
              label={'Meio-campo'}
              value={team.averageMidfieldRating}
            />
            <RatingTile label={'Defesa'} value={team.averageDefenseRating} />
          </div>
        </Section>

        <Section title={'Confrontos Diretos'}>
          <TeamHeadToHead
            biggestVictim={team.biggestVictim}
            biggestTormentor={team.biggestTormentor}
          />
        </Section>
      </div>
    </div>
  );
};
