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
// (FORMATION_SLOT_TEMPLATES) — mesmo casamento global de matchToFormationLayout,
// só que no sentido posição -> slot em vez de titular -> slot. É o que
// permite rotular/segmentar um slot mesmo vazio (sem titular ali) e saber
// pra qual posição mandar o PATCH ao soltar alguém nele.
//
// Importante: a cada passo escolhe o par (slot, posição) mais próximo entre
// TODOS os que sobraram, não só o mais próximo pra cada slot na ordem do
// array — um greedy "em ordem" deixa um slot roubar a posição certa de outro
// slot que viria depois (ex: posições repetidas como VOL/VOL, ou um slot
// lateral avançado competindo com um slot central avançado pela mesma
// posição), sobrando posição errada pro slot que ficou por último.
const assignSlotPositions = (
  formation: Formation,
  template: FormationSlot[],
): PositionCode[] => {
  const remainingPositions = (FORMATION_SLOT_TEMPLATES[formation] ?? [])
    .filter((position) => position !== 'GOL')
    .map((position) => ({ position, anchor: anchorForPosition(position) }));
  const remainingSlots = template.map((slot, index) => ({ slot, index }));

  const assigned = new Map<number, PositionCode>();

  while (remainingSlots.length > 0 && remainingPositions.length > 0) {
    let bestSlot = 0;
    let bestPosition = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    remainingSlots.forEach((slotEntry, slotIndex) => {
      remainingPositions.forEach((positionEntry, positionIndex) => {
        const distance =
          (positionEntry.anchor.line - slotEntry.slot.line) ** 2 +
          (positionEntry.anchor.column - slotEntry.slot.column) ** 2;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestSlot = slotIndex;
          bestPosition = positionIndex;
        }
      });
    });

    assigned.set(
      remainingSlots[bestSlot].index,
      remainingPositions[bestPosition].position,
    );
    remainingSlots.splice(bestSlot, 1);
    remainingPositions.splice(bestPosition, 1);
  }

  return template.map((_, index) => assigned.get(index) ?? 'MC');
};

// Encaixa cada titular de linha no slot livre mais próximo da sua posição
// natural dentro do layout da formação. A cada passo escolhe o par
// (titular, slot) mais próximo entre TODOS os que sobraram — não o slot mais
// próximo de cada titular na ordem do array (ver assignSlotPositions): um
// greedy "em ordem" deixa o primeiro titular roubar o slot certo de outro
// que viria depois (ex: dois titulares na mesma posição, ou um titular de
// lateral competindo com um de ponta avançada pelo mesmo canto), fazendo o
// cartão de um jogador aparecer no lugar geométrico de outra posição no
// campo. O que sobra (formação pede mais slots do que a quantidade de
// titulares de linha) vira slot vazio, nunca é descartado.
const matchToFormationLayout = (
  outfield: RosterPlayer[],
  template: FormationSlot[],
  slotPositions: PositionCode[],
): PitchSlot[] => {
  const remainingSlots = template.map((slot, index) => {
    const position = slotPositions[index];
    return { slot, position, anchor: anchorForPosition(position) };
  });
  const remainingPlayers = outfield.map((player, index) => ({
    player,
    hint: naturalSlot(player),
    index,
  }));

  const placements = new Map<
    number,
    { position: PositionCode } & FormationSlot
  >();

  while (remainingPlayers.length > 0 && remainingSlots.length > 0) {
    let bestPlayer = 0;
    let bestSlot = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    remainingPlayers.forEach((playerEntry, playerIndex) => {
      remainingSlots.forEach((slotEntry, slotIndex) => {
        const distance =
          (slotEntry.anchor.line - playerEntry.hint.line) ** 2 +
          (slotEntry.anchor.column - playerEntry.hint.column) ** 2;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPlayer = playerIndex;
          bestSlot = slotIndex;
        }
      });
    });

    const playerEntry = remainingPlayers[bestPlayer];
    const slotEntry = remainingSlots[bestSlot];
    placements.set(playerEntry.index, {
      position: slotEntry.position,
      ...slotEntry.slot,
    });
    remainingPlayers.splice(bestPlayer, 1);
    remainingSlots.splice(bestSlot, 1);
  }

  // Elenco com titulares a mais pra formação (bug de dados — ex: 2 titulares
  // na mesma posição numa formação com 1 slot só) estoura o template: quem
  // sobra cai na própria dica natural em vez de um slot. Sem esse contador,
  // dois jogadores com a mesma posição cairiam exatamente um em cima do
  // outro, e um deles ficaria impossível de selecionar/arrastar — por isso
  // cada repetição da mesma dica ganha um leve deslocamento.
  const overflowCount = new Map<string, number>();

  const filled = outfield.map((player, index) => {
    const placement = placements.get(index);
    if (placement) {
      return { player, position: placement.position, ...toPixels(placement) };
    }

    const hint = naturalSlot(player);
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

  const empty = remainingSlots.map(({ slot, position }) => ({
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
