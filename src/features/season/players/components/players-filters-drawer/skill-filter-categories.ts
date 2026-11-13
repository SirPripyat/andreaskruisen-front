import type { SkillRatingField } from '@/features/admin/players';

type SkillFilterCategory = {
  label: string;
  fields: { key: SkillRatingField; label: string }[];
};

// Agrupamento dos 42 atributos de PlayerRating filtráveis (SKILL_RATING_FIELDS
// no backend) em seções do drawer, na mesma ordem das categorias do cartão de
// atributos (ritmo/finalização/passe/drible/defesa/físico/goleiro).
export const SKILL_FILTER_CATEGORIES: SkillFilterCategory[] = [
  {
    label: 'Geral',
    fields: [
      { key: 'skillMoves', label: 'Habilidades' },
      { key: 'weakFootAbility', label: 'Pé fraco' },
    ],
  },
  {
    label: 'Ritmo',
    fields: [
      { key: 'pac', label: 'PAC (geral)' },
      { key: 'acceleration', label: 'Aceleração' },
      { key: 'sprintSpeed', label: 'Velocidade' },
    ],
  },
  {
    label: 'Finalização',
    fields: [
      { key: 'sho', label: 'SHO (geral)' },
      { key: 'positioning', label: 'Posicionamento' },
      { key: 'finishing', label: 'Finalização' },
      { key: 'shotPower', label: 'Força do chute' },
      { key: 'longShots', label: 'Chute de longe' },
      { key: 'volleys', label: 'Voleio' },
      { key: 'penalties', label: 'Pênaltis' },
    ],
  },
  {
    label: 'Passe',
    fields: [
      { key: 'pas', label: 'PAS (geral)' },
      { key: 'vision', label: 'Visão' },
      { key: 'crossing', label: 'Cruzamento' },
      { key: 'freeKickAccuracy', label: 'Falta' },
      { key: 'shortPassing', label: 'Passe curto' },
      { key: 'longPassing', label: 'Passe longo' },
      { key: 'curve', label: 'Curva' },
    ],
  },
  {
    label: 'Drible',
    fields: [
      { key: 'dri', label: 'DRI (geral)' },
      { key: 'agility', label: 'Agilidade' },
      { key: 'balance', label: 'Equilíbrio' },
      { key: 'reactions', label: 'Reação' },
      { key: 'ballControl', label: 'Controle de bola' },
      { key: 'dribbling', label: 'Drible' },
      { key: 'composure', label: 'Compostura' },
    ],
  },
  {
    label: 'Defesa',
    fields: [
      { key: 'def', label: 'DEF (geral)' },
      { key: 'interceptions', label: 'Interceptação' },
      { key: 'headingAccuracy', label: 'Cabeceio' },
      { key: 'defensiveAwareness', label: 'Consciência defensiva' },
      { key: 'standingTackle', label: 'Desarme em pé' },
      { key: 'slidingTackle', label: 'Carrinho' },
    ],
  },
  {
    label: 'Físico',
    fields: [
      { key: 'phy', label: 'PHY (geral)' },
      { key: 'jumping', label: 'Impulsão' },
      { key: 'stamina', label: 'Resistência' },
      { key: 'strength', label: 'Força' },
      { key: 'aggression', label: 'Agressividade' },
    ],
  },
  {
    label: 'Goleiro',
    fields: [
      { key: 'gkDiving', label: 'Reflexo (voo)' },
      { key: 'gkHandling', label: 'Manejo' },
      { key: 'gkKicking', label: 'Chute' },
      { key: 'gkPositioning', label: 'Posicionamento' },
      { key: 'gkReflexes', label: 'Reflexos' },
    ],
  },
];
