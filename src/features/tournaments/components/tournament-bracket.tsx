import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { MatchListItem, PhaseSummary, TeamOwner } from '../api';
import { KnockoutMatchCard } from './knockout-match-card';

export type BracketRound = {
  phase: PhaseSummary;
  matches: MatchListItem[];
};

// Casa adjacente (ver advanceKnockoutRound no back): o vencedor da partida
// 2i e o da 2i+1 de uma rodada se enfrentam na partida i da rodada seguinte.
// É essa regra que desenha as linhas do chaveamento abaixo.
function buildConnectorPaths(
  container: HTMLDivElement,
  cardsByRound: HTMLDivElement[][],
): string[] {
  const containerBox = container.getBoundingClientRect();
  const paths: string[] = [];

  for (let round = 0; round < cardsByRound.length - 1; round++) {
    const currentCards = cardsByRound[round];
    const nextCards = cardsByRound[round + 1];

    for (let i = 0; i < nextCards.length; i++) {
      const first = currentCards[i * 2];
      const second = currentCards[i * 2 + 1];
      const target = nextCards[i];
      if (!first || !target) continue;

      const firstBox = first.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      const x1 = firstBox.right - containerBox.left;
      const y1 = firstBox.top + firstBox.height / 2 - containerBox.top;
      const x2 = targetBox.left - containerBox.left;
      const y2 = targetBox.top + targetBox.height / 2 - containerBox.top;
      const midX = x1 + (x2 - x1) / 2;
      const secondBox = second?.getBoundingClientRect();
      const y1Second = secondBox
        ? secondBox.top + secondBox.height / 2 - containerBox.top
        : y1;

      paths.push(`M${x1} ${y1} H${midX}`);
      paths.push(`M${x1} ${y1Second} H${midX}`);
      paths.push(`M${midX} ${y1} V${y1Second}`);
      paths.push(`M${midX} ${y2} H${x2}`);
    }
  }

  return paths;
}

function registerCardRef(
  cardRefsByRound: Map<string, HTMLDivElement>[],
  roundIndex: number,
  matchId: string,
  el: HTMLDivElement | null,
): void {
  if (!cardRefsByRound[roundIndex]) {
    cardRefsByRound[roundIndex] = new Map();
  }
  const refsForRound = cardRefsByRound[roundIndex];
  if (el) {
    refsForRound.set(matchId, el);
  } else {
    refsForRound.delete(matchId);
  }
}

export function TournamentBracket({
  rounds,
  ownerByTeamId,
}: {
  rounds: BracketRound[];
  ownerByTeamId?: Map<string, TeamOwner>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefsByRound = useRef<Map<string, HTMLDivElement>[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const recomputePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardsByRound = rounds.map((round, roundIndex) => {
      const refsForRound = cardRefsByRound.current[roundIndex];
      return round.matches
        .map((match) => refsForRound?.get(match.id))
        .filter((el): el is HTMLDivElement => !!el);
    });

    setPaths(buildConnectorPaths(container, cardsByRound));
    const box = container.getBoundingClientRect();
    setSvgSize({ width: box.width, height: box.height });
  }, [rounds]);

  useLayoutEffect(() => {
    recomputePaths();
  }, [recomputePaths]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => recomputePaths());
    observer.observe(container);
    window.addEventListener('resize', recomputePaths);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recomputePaths);
    };
  }, [recomputePaths]);

  if (rounds.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhuma fase de mata-mata ativa neste torneio.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-medium text-muted-foreground text-xs uppercase">
        Chaveamento
      </span>

      <div className="overflow-x-auto pb-2">
        <div ref={containerRef} className="relative flex min-w-fit gap-14">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-visible text-border-strong"
            width={svgSize.width}
            height={svgSize.height}
          >
            {paths.map((d) => (
              <path
                key={d}
                d={d}
                stroke="currentColor"
                strokeWidth={1.5}
                fill="none"
              />
            ))}
          </svg>

          {rounds.map((round, roundIndex) => (
            <div
              key={round.phase.id}
              className="flex min-w-[240px] flex-col justify-around gap-5"
            >
              <span className="text-center font-display font-bold text-muted-foreground text-xs uppercase">
                {round.phase.name}
              </span>
              <div className="flex flex-1 flex-col justify-around gap-5">
                {round.matches.map((match) => (
                  <KnockoutMatchCard
                    key={match.id}
                    match={match}
                    isFinal={round.phase.name === 'Final'}
                    ownerByTeamId={ownerByTeamId}
                    cardRef={(el) =>
                      registerCardRef(
                        cardRefsByRound.current,
                        roundIndex,
                        match.id,
                        el,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
