import type { Formation, RosterPlayer } from '@/features/season/squads';
import { FORMATION_LAYOUTS, type FormationSlot } from './formation-layouts';
import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';

export type PitchSlot = { player: RosterPlayer; x: number; y: number };

// Linha vertical de cada posição no campo (0 = goleiro, maior = mais ofensivo).
// Usada como "dica" de onde um jogador naturalmente fica, tanto no layout
// genérico (quando a formação é desconhecida) quanto para encaixar cada
// titular no slot mais próximo do layout específico da formação.
const POSITION_LINE: Record<string, number> = {
  GOL: 0,
  LE: 1,
  ZAG: 1,
  LD: 1,
  VOL: 2,
  MC: 3,
  MD: 3,
  ME: 3,
  MEI: 4,
  PE: 5,
  ATA: 5,
  PD: 5,
};

// Posição sem entrada em POSITION_LINE (ex: sigla nova do SoFIFA) cai no meio-campo.
const DEFAULT_LINE = 3;
const LINE_COUNT = 6;

// Coluna horizontal de cada posição (visão de trás do goleiro: esquerda do
// time = esquerda da tela). Quem não está aqui fica centralizado.
const POSITION_COLUMN: Record<string, number> = {
  LE: 0,
  ME: 0,
  PE: 0,
  LD: 1,
  MD: 1,
  PD: 1,
};
const DEFAULT_COLUMN = 0.5;

// Frações da área jogável no desenho original (canvas 500x700) — aplicadas
// aqui para manter as mesmas margens relativas se PITCH_WIDTH/HEIGHT mudar.
const PITCH_BOUNDS = {
  top: PITCH_HEIGHT * (170 / 700),
  bottom: PITCH_HEIGHT * (600 / 700),
  left: PITCH_WIDTH * (60 / 500),
  right: PITCH_WIDTH * (440 / 500),
};

// ---------------------------------------------------------------------------
// Layout por formação
//
// A disposição dos 10 jogadores de linha (fora o goleiro, que fica sempre
// centralizado no fundo) de cada formação vem de ./formation-layouts —
// edite esse arquivo diretamente pra ajustar qualquer formação, sem mexer
// neste arquivo. Cada slot é { line, column } de 0 a 1:
//   - line:   0 = linha de fundo (perto do próprio gol), 1 = ataque.
//   - column: 0 = extrema esquerda (visão de trás do goleiro), 1 = direita.
// A formação não precisa ter todos os 10 slots nem vir na mesma ordem dos
// titulares: cada titular é encaixado no slot livre mais próximo da sua
// posição natural (ver matchToFormationLayout). Uma formação sem entrada em
// FORMATION_LAYOUTS cai no agrupamento genérico por linha/coluna (buildGenericSlots).
// ---------------------------------------------------------------------------

const naturalSlot = (player: RosterPlayer): FormationSlot => {
  const line = POSITION_LINE[player.position] ?? DEFAULT_LINE;
  return {
    line: line / (LINE_COUNT - 1),
    column: POSITION_COLUMN[player.position] ?? DEFAULT_COLUMN,
  };
};

const toPixels = (slot: FormationSlot): { x: number; y: number } => {
  return {
    x:
      PITCH_BOUNDS.left +
      slot.column * (PITCH_BOUNDS.right - PITCH_BOUNDS.left),
    y:
      PITCH_BOUNDS.bottom -
      slot.line * (PITCH_BOUNDS.bottom - PITCH_BOUNDS.top),
  };
};

const centerOrSpread = (
  count: number,
  index: number,
  from: number,
  to: number,
): number => {
  if (count === 1) return (from + to) / 2;
  return from + index * ((to - from) / (count - 1));
};

// Agrupamento genérico por linha/coluna, usado quando a formação do time não
// tem entrada em FORMATION_LAYOUTS (ex: dado ainda não migrado).
const buildGenericSlots = (outfield: RosterPlayer[]): PitchSlot[] => {
  const byLine = new Map<number, RosterPlayer[]>();
  for (const player of outfield) {
    const line = POSITION_LINE[player.position] ?? DEFAULT_LINE;
    byLine.set(line, [...(byLine.get(line) ?? []), player]);
  }

  return Array.from(byLine.entries()).flatMap(([line, linePlayers]) => {
    const y =
      PITCH_BOUNDS.bottom -
      (line / (LINE_COUNT - 1)) * (PITCH_BOUNDS.bottom - PITCH_BOUNDS.top);

    const players = [...linePlayers].sort(
      (a, b) =>
        (POSITION_COLUMN[a.position] ?? DEFAULT_COLUMN) -
        (POSITION_COLUMN[b.position] ?? DEFAULT_COLUMN),
    );

    return players.map((player, playerIndex) => ({
      player,
      y,
      x: centerOrSpread(
        players.length,
        playerIndex,
        PITCH_BOUNDS.left,
        PITCH_BOUNDS.right,
      ),
    }));
  });
};

// Encaixa cada titular de linha no slot livre mais próximo da sua posição
// natural dentro do layout da formação (busca gulosa: não é um casamento
// ótimo, mas como o layout já segue o formato real da formação, o resultado
// fica correto na prática).
const matchToFormationLayout = (
  outfield: RosterPlayer[],
  template: FormationSlot[],
): PitchSlot[] => {
  const available = [...template];

  return outfield.map((player) => {
    const hint = naturalSlot(player);

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    available.forEach((slot, index) => {
      const distance =
        (slot.line - hint.line) ** 2 + (slot.column - hint.column) ** 2;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const slot =
      available.length > 0 ? available.splice(closestIndex, 1)[0] : hint;
    return { player, ...toPixels(slot) };
  });
};

export const buildPitchSlots = (
  lineup: RosterPlayer[],
  formation: Formation | null,
): PitchSlot[] => {
  const goalkeeper = lineup.filter((player) => player.position === 'GOL');
  const outfield = lineup.filter((player) => player.position !== 'GOL');

  const goalkeeperSlots = goalkeeper.map((player) => ({
    player,
    ...toPixels({ line: 0, column: 0.5 }),
  }));

  const template = formation ? FORMATION_LAYOUTS[formation] : undefined;

  const outfieldSlots =
    template && template.length > 0
      ? matchToFormationLayout(outfield, template)
      : buildGenericSlots(outfield);

  return [...goalkeeperSlots, ...outfieldSlots];
};
