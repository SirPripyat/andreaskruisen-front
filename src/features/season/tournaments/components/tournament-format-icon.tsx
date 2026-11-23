import { AwardIcon, MedalIcon, TrophyIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import type { TournamentFormat } from '../types';

export const TOURNAMENT_FORMAT_ICONS: Record<
  TournamentFormat,
  ComponentType<{ className?: string }>
> = {
  LEAGUE: TrophyIcon,
  KNOCKOUT: MedalIcon,
  GROUP_STAGE_KNOCKOUT: AwardIcon,
};

export const TournamentFormatIcon = ({
  format,
  className,
}: {
  format: TournamentFormat;
  className?: string;
}) => {
  const Icon = TOURNAMENT_FORMAT_ICONS[format];

  return <Icon className={className} />;
};
