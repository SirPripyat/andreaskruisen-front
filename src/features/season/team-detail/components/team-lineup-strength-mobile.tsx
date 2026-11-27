import type { RosterPlayer } from '@/features/season/squads';
import { cn, getOverallRatingTextClassName, type PositionGroup } from '@/lib';
import { getLineupStrengthTiles } from './team-lineup-strength';

// Abreviação PT-BR curta pra caber no card — a sigla do grupo (GOL/DEF/MID/
// ATT) já existe no app, mas é em inglês; aqui usamos a mesma abreviação que
// aparece nos badges de posição dos jogadores (ATA, MEI).
const GROUP_SHORT_LABEL: Record<PositionGroup, string> = {
  GOL: 'GOL',
  DEF: 'DEF',
  MID: 'MEI',
  ATT: 'ATA',
};

type TeamLineupStrengthMobileProps = {
  starters: RosterPlayer[];
};

export const TeamLineupStrengthMobile = ({
  starters,
}: TeamLineupStrengthMobileProps) => {
  const tiles = getLineupStrengthTiles(starters);

  if (tiles.length === 0) return null;

  return (
    <div className={'grid grid-cols-4 gap-2'}>
      {tiles.map((tile) => (
        <div
          key={tile.group}
          className={'flex flex-col items-center gap-1.5 rounded-lg border p-2'}
        >
          <span
            className={
              'font-mono text-[10px] text-muted-foreground uppercase tracking-wide'
            }
          >
            {GROUP_SHORT_LABEL[tile.group]}
          </span>
          <span
            className={cn(
              'font-display font-bold text-lg tabular-nums',
              getOverallRatingTextClassName(tile.average),
            )}
          >
            {Math.round(tile.average)}
          </span>
        </div>
      ))}
    </div>
  );
};
