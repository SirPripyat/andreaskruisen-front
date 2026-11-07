export type PositionGroup = 'GOL' | 'DEF' | 'MID' | 'ATT';

export function getPositionGroup(position: string): PositionGroup {
  if (/GOALKEEPER|^GOL$/.test(position)) return 'GOL';

  if (/BACK|DEFENDER|^(ZAG|LE|LD|ADE|ADD)$/.test(position)) return 'DEF';

  if (/MID|^(VOL|MC|MEI|ME|MD|MAE|MAD)$/.test(position)) return 'MID';

  if (/WING|STRIKER|FORWARD|^(PE|PD|ATA)$/.test(position)) return 'ATT';

  return 'MID';
}

const POSITION_GROUP_LABEL: Record<PositionGroup, string> = {
  GOL: 'Goleiro',
  DEF: 'Defesa',
  MID: 'Meio-campo',
  ATT: 'Ataque',
};

export function getPositionGroupLabel(group: PositionGroup): string {
  return POSITION_GROUP_LABEL[group];
}

const POSITION_GROUP_SURFACE_CLASS: Record<PositionGroup, string> = {
  GOL: 'bg-warning-surface text-warning',
  DEF: 'bg-info-surface text-info',
  MID: 'bg-success-surface text-success',
  ATT: 'bg-accent-surface text-accent',
};

export const getPositionGroupClassName = (position: string): string =>
  POSITION_GROUP_SURFACE_CLASS[getPositionGroup(position)];
