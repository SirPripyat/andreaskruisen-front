import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Skeleton,
} from '@/components/ui';
import type { RosterPlayer } from '@/features/squads';
import { cn, getOverallRatingClassName } from '@/lib';

type FormationSlot = {
  key: string;
  label: string;
  // Posições aceitas pra essa vaga, em ordem de preferência — a primeira é
  // a posição "natural" do esquema; as seguintes são só pra não deixar a
  // vaga vazia quando o elenco não tem ninguém daquela posição exata.
  positions: string[];
  x: number;
  y: number;
};

export type FormationAssignment = {
  slot: FormationSlot;
  player: RosterPlayer | null;
};

// 4-3-3, coordenadas de um campo retrato (viewBox 0 0 500 700, ataque pra
// cima). Códigos de posição são os do backend (ver PositionCode no schema).
const FORMATION_SLOTS: FormationSlot[] = [
  { key: 'gk', label: 'GOL', positions: ['GOL'], x: 250, y: 650 },
  { key: 'lb', label: 'LE', positions: ['LE'], x: 80, y: 540 },
  { key: 'cb1', label: 'ZAG', positions: ['ZAG'], x: 180, y: 568 },
  { key: 'cb2', label: 'ZAG', positions: ['ZAG'], x: 320, y: 568 },
  { key: 'rb', label: 'LD', positions: ['LD'], x: 420, y: 540 },
  { key: 'cdm', label: 'VOL', positions: ['VOL'], x: 250, y: 460 },
  { key: 'cm', label: 'MC', positions: ['MC', 'MD', 'ME'], x: 140, y: 390 },
  { key: 'cam', label: 'MEI', positions: ['MEI'], x: 320, y: 335 },
  { key: 'lw', label: 'PE', positions: ['PE'], x: 90, y: 195 },
  { key: 'st', label: 'ATA', positions: ['ATA'], x: 250, y: 150 },
  { key: 'rw', label: 'PD', positions: ['PD'], x: 410, y: 195 },
];

// Escalação calculada no momento (sem persistência): pra cada vaga do
// 4-3-3, o jogador de melhor overall disponível na posição certa — sem
// candidato na posição, sobra o melhor overall que ainda não entrou em
// nenhuma vaga, pra fechar os 11 mesmo com um elenco desbalanceado.
export function computeBestXi(roster: RosterPlayer[]): FormationAssignment[] {
  const used = new Set<string>();
  const bestAvailable = (pool: RosterPlayer[]) =>
    pool
      .filter((player) => !used.has(player.id))
      .sort((a, b) => b.overallRating - a.overallRating)[0];

  const assignments: FormationAssignment[] = FORMATION_SLOTS.map((slot) => {
    const candidates = roster.filter((player) =>
      slot.positions.includes(player.position),
    );
    const player = bestAvailable(candidates) ?? null;
    if (player) used.add(player.id);
    return { slot, player };
  });

  for (const assignment of assignments) {
    if (assignment.player) continue;
    const fallback = bestAvailable(roster);
    if (fallback) {
      used.add(fallback.id);
      assignment.player = fallback;
    }
  }

  return assignments;
}

function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

function Jersey({ assignment }: { assignment: FormationAssignment }) {
  const { slot, player } = assignment;
  return (
    <g transform={`translate(${slot.x}, ${slot.y})`}>
      <circle r={22} className="fill-card stroke-accent" strokeWidth={2.5} />
      {player ? (
        <>
          <text
            textAnchor="middle"
            dy={4.5}
            className="fill-foreground font-mono font-bold text-[14px]"
          >
            {Math.round(player.overallRating)}
          </text>
          <rect
            x={-38}
            y={27}
            width={76}
            height={15}
            rx={4}
            className="fill-foreground/70"
          />
          <text
            textAnchor="middle"
            y={38}
            className="fill-white font-sans font-semibold text-[10px]"
          >
            {shortName(player.name)}
          </text>
          <text
            textAnchor="middle"
            y={-29}
            className="fill-card font-mono text-[9px]"
          >
            {slot.label}
          </text>
        </>
      ) : (
        <text
          textAnchor="middle"
          dy={4}
          className="fill-muted-foreground font-mono text-[9px]"
        >
          {slot.label}
        </text>
      )}
    </g>
  );
}

export function TeamLineupPitch({
  assignments,
  isPending,
}: {
  assignments: FormationAssignment[];
  isPending: boolean;
}) {
  if (isPending) {
    return <Skeleton className="aspect-[5/7] w-full max-w-xs" />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Badge className="border-transparent bg-accent font-mono text-accent-foreground">
        4-3-3 · melhor overall por posição
      </Badge>
      <svg
        viewBox="0 0 500 700"
        className="w-full max-w-xs overflow-hidden rounded-xl border"
        aria-label="Escalação titular no campo"
      >
        <title>Escalação titular</title>
        <rect width={500} height={700} className="fill-[#2a5f3d]" />
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <rect
            key={row}
            x={0}
            y={row * 100}
            width={500}
            height={100}
            className={cn(
              row % 2 === 0 ? 'fill-white/[0.04]' : 'fill-transparent',
            )}
          />
        ))}
        <g className="stroke-white/40" strokeWidth={2} fill="none">
          <rect x={10} y={10} width={480} height={680} />
          <line x1={10} y1={350} x2={490} y2={350} />
          <circle cx={250} cy={350} r={55} />
          <rect x={140} y={10} width={220} height={90} />
          <rect x={140} y={600} width={220} height={90} />
        </g>
        {assignments.map((assignment) => (
          <Jersey key={assignment.slot.key} assignment={assignment} />
        ))}
      </svg>
    </div>
  );
}

export function TeamBench({
  bench,
  isPending,
}: {
  bench: RosterPlayer[];
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 5 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders, no stable id
          <Skeleton key={index} className="h-32 w-28 shrink-0" />
        ))}
      </div>
    );
  }

  if (bench.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Sem outros jogadores no elenco além dos titulares.
      </p>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto">
      {bench.map((player) => (
        <div
          key={player.id}
          className="flex w-28 shrink-0 flex-col items-center gap-1.5 rounded-lg border bg-card p-2.5 text-center"
        >
          <Avatar>
            <AvatarImage src={player.photoUrl} alt="" />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="w-full truncate text-sm font-medium">
            {player.name}
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            {player.position}
          </span>
          <Badge
            variant="outline"
            className={getOverallRatingClassName(
              Math.round(player.overallRating),
            )}
          >
            {Math.round(player.overallRating)}
          </Badge>
        </div>
      ))}
    </div>
  );
}
