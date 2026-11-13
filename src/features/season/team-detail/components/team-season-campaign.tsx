import type { SeasonCampaign } from '@/features/admin/teams';
import { formatDecimal } from '@/lib';

type TeamSeasonCampaignProps = {
  campaign: SeasonCampaign | null;
};

export const TeamSeasonCampaign = ({ campaign }: TeamSeasonCampaignProps) => {
  if (!campaign) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        Nenhuma partida disputada nesta temporada.
      </p>
    );
  }

  const goalDifference = campaign.goalsFor - campaign.goalsAgainst;
  const maxPoints = campaign.games * 3;

  const kpis = [
    {
      key: 'goalsFor',
      label: 'Gols pró',
      value: campaign.goalsFor,
      sub: `${formatDecimal(campaign.goalsFor / campaign.games)} por jogo`,
    },
    {
      key: 'goalsAgainst',
      label: 'Gols contra',
      value: campaign.goalsAgainst,
      sub: `${formatDecimal(campaign.goalsAgainst / campaign.games)} por jogo`,
    },
    {
      key: 'goalDifference',
      label: 'Saldo de gols',
      value: goalDifference > 0 ? `+${goalDifference}` : goalDifference,
      valueClassName:
        goalDifference > 0
          ? 'text-success'
          : goalDifference < 0
            ? 'text-critical'
            : undefined,
    },
    {
      key: 'pointsPercentage',
      label: 'Aproveitamento',
      value: `${Math.round(campaign.pointsPercentage)}%`,
      sub: `${campaign.points} de ${maxPoints} pts`,
    },
  ];

  return (
    <div className={'flex flex-col gap-1'}>
      <div
        role={'img'}
        aria-label={`${campaign.wins} vitórias, ${campaign.draws} empates e ${campaign.losses} derrotas`}
        className={'flex h-2.5 gap-0.5'}
      >
        <span
          style={{ flex: campaign.wins || 0.0001 }}
          className={'min-w-1 rounded-sm bg-success'}
        />
        <span
          style={{ flex: campaign.draws || 0.0001 }}
          className={'min-w-1 rounded-sm bg-warning'}
        />
        <span
          style={{ flex: campaign.losses || 0.0001 }}
          className={'min-w-1 rounded-sm bg-red-400'}
        />
      </div>

      <div className={'flex flex-wrap gap-7 pt-3'}>
        <div className={'flex flex-col gap-0.5'}>
          <span className={'font-mono font-semibold text-success text-xl'}>
            {campaign.wins}
          </span>
          <span className={'text-muted-foreground text-xs'}>Vitórias</span>
        </div>
        <div className={'flex flex-col gap-0.5'}>
          <span className={'font-mono font-semibold text-warning text-xl'}>
            {campaign.draws}
          </span>
          <span className={'text-muted-foreground text-xs'}>Empates</span>
        </div>
        <div className={'flex flex-col gap-0.5'}>
          <span className={'font-mono font-semibold text-red-400 text-xl'}>
            {campaign.losses}
          </span>
          <span className={'text-muted-foreground text-xs'}>Derrotas</span>
        </div>
      </div>

      <div
        className={'grid grid-cols-2 gap-3 border-t pt-3 mt-3 sm:grid-cols-4'}
      >
        {kpis.map((kpi) => (
          <div key={kpi.key} className={'flex flex-col gap-0.5'}>
            <span
              className={`font-mono font-semibold text-xl ${kpi.valueClassName ?? ''}`}
            >
              {kpi.value}
            </span>
            <span className={'text-muted-foreground text-xs'}>{kpi.label}</span>
            {kpi.sub && (
              <span className={'font-mono text-[11px] text-muted-foreground'}>
                {kpi.sub}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
