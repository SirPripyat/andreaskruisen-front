import type { PositionCode } from '@/features/admin/players';
import type { Formation, RosterPlayer } from '@/features/season/squads';
import { FORMATION_LAYOUTS, type FormationSlot } from './formation-layouts';
import { FORMATION_SLOT_TEMPLATES } from './formation-slot-templates';
import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';

// player: null = slot vazio (sem titular ali) — ainda assim tem uma posição
// definida, pra poder ser rotulado no campo e servir de alvo de drop (ver
// matchToFormationLayout) quando o elenco tem menos jogadores que a
// formação pede.
export type PitchSlot = {
  player: RosterPlayer | null;
  position: PositionCode;
  x: number;
  y: number;
};

// Linha vertical de cada posição no campo (0 = goleiro, maior = mais ofensivo).
// Usada como "dica" de onde um jogador naturalmente fica, tanto no layout
// genérico (quando a formação é desconhecida) quanto para encaixar cada
// titular no slot mais próximo do layout específico da formação — e também
// pra rotular os slots da formação com uma posição (ver assignSlotPositions).
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
// posição natural (ver matchToFormationLayout), e o que sobra vira slot
// vazio — nunca descartado, pra sempre mostrar os 11 lugares da formação
// (como o editor de escalação do FIFA). Uma formação sem entrada em
// FORMATION_LAYOUTS cai no agrupamento genérico por linha/coluna
// (buildGenericSlots), que não tem como sintetizar slots vazios.
// ---------------------------------------------------------------------------

const naturalSlot = (player: RosterPlayer): FormationSlot => {
  const line = POSITION_LINE[player.position] ?? DEFAULT_LINE;
  return {
    line: line / (LINE_COUNT - 1),
    column: POSITION_COLUMN[player.position] ?? DEFAULT_COLUMN,
  };
};

const anchorForPosition = (position: PositionCode): FormationSlot => {
  const line = POSITION_LINE[position] ?? DEFAULT_LINE;
  return {
    line: line / (LINE_COUNT - 1),
    column: POSITION_COLUMN[position] ?? DEFAULT_COLUMN,
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
// tem entrada em FORMATION_LAYOUTS (ex: dado ainda não migrado). Sem um
// template não dá pra saber quantos slots a formação tem, então aqui só os
// titulares que já existem aparecem — nenhum slot vazio é sintetizado.
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
      position: player.position as PositionCode,
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

// Rotula cada slot geométrico da formação (FORMATION_LAYOUTS) com a posição
// que ele representa, usando o conjunto de posições verificado do backend
// (FORMATION_SLOT_TEMPLATES) — mesma busca gulosa por vizinho mais próximo
// de matchToFormationLayout, só que no sentido posição -> slot em vez de
// titular -> slot. É o que permite rotular/segmentar um slot mesmo vazio
// (sem titular ali) e saber pra qual posição mandar o PATCH ao soltar
// alguém nele.
const assignSlotPositions = (
  formation: Formation,
  template: FormationSlot[],
): PositionCode[] => {
  const available = (FORMATION_SLOT_TEMPLATES[formation] ?? []).filter(
    (position) => position !== 'GOL',
  );

  return template.map((slot) => {
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    available.forEach((position, index) => {
      const anchor = anchorForPosition(position);
      const distance =
        (anchor.line - slot.line) ** 2 + (anchor.column - slot.column) ** 2;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return available.length > 0 ? available.splice(closestIndex, 1)[0] : 'MC';
  });
};

// Encaixa cada titular de linha no slot livre mais próximo da sua posição
// natural dentro do layout da formação (busca gulosa: não é um casamento
// ótimo, mas como o layout já segue o formato real da formação, o resultado
// fica correto na prática). O que sobra (formação pede mais slots do que a
// quantidade de titulares de linha) vira slot vazio, nunca é descartado.
const matchToFormationLayout = (
  outfield: RosterPlayer[],
  template: FormationSlot[],
  slotPositions: PositionCode[],
): PitchSlot[] => {
  const available = template.map((slot, index) => ({
    slot,
    position: slotPositions[index],
  }));

  // Elenco com titulares a mais pra formação (bug de dados — ex: 2 titulares
  // na mesma posição numa formação com 1 slot só) estoura o template: quem
  // sobra cai na própria dica natural em vez de um slot. Sem esse contador,
  // dois jogadores com a mesma posição cairiam exatamente um em cima do
  // outro, e um deles ficaria impossível de selecionar/arrastar — por isso
  // cada repetição da mesma dica ganha um leve deslocamento.
  const overflowCount = new Map<string, number>();

  const filled = outfield.map((player) => {
    const hint = naturalSlot(player);

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    available.forEach((entry, index) => {
      const distance =
        (entry.slot.line - hint.line) ** 2 +
        (entry.slot.column - hint.column) ** 2;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (available.length > 0) {
      const entry = available.splice(closestIndex, 1)[0];
      return { player, position: entry.position, ...toPixels(entry.slot) };
    }

    const hintKey = `${hint.line},${hint.column}`;
    const repeat = overflowCount.get(hintKey) ?? 0;
    overflowCount.set(hintKey, repeat + 1);

    const offsetSlot: FormationSlot = {
      line: hint.line,
      column: Math.min(1, hint.column + repeat * 0.06),
    };

    return {
      player,
      position: player.position as PositionCode,
      ...toPixels(offsetSlot),
    };
  });

  const empty = available.map(({ slot, position }) => ({
    player: null,
    position,
    ...toPixels(slot),
  }));

  return [...filled, ...empty];
};

export const buildPitchSlots = (
  starters: RosterPlayer[],
  formation: Formation | null,
): PitchSlot[] => {
  const goalkeeper =
    starters.find((player) => player.position === 'GOL') ?? null;
  const outfield = starters.filter((player) => player.position !== 'GOL');

  const goalkeeperSlot: PitchSlot = {
    player: goalkeeper,
    position: 'GOL',
    ...toPixels({ line: 0, column: 0.5 }),
  };

  const template = formation ? FORMATION_LAYOUTS[formation] : undefined;

  const outfieldSlots =
    formation && template && template.length > 0
      ? matchToFormationLayout(
          outfield,
          template,
          assignSlotPositions(formation, template),
        )
      : buildGenericSlots(outfield);

  return [goalkeeperSlot, ...outfieldSlots];
};
