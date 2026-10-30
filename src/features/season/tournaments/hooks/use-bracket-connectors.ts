import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { MatchListItem, PhaseSummary } from '../api';

export type BracketRound = {
  phase: PhaseSummary;
  matches: MatchListItem[];
};

// Casa adjacente (ver advanceKnockoutRound no back): o vencedor da partida
// 2i e o da 2i+1 de uma rodada se enfrentam na partida i da rodada seguinte.
// É essa regra que desenha as linhas do chaveamento abaixo.
const buildConnectorPaths = (
  container: HTMLDivElement,
  cardsByRound: HTMLDivElement[][],
): string[] => {
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
};

// Mede as posições dos cards via DOM (bracket não tem como saber a posição
// deles por dados) e desenha as linhas de conexão entre as rodadas.
export const useBracketConnectors = (rounds: BracketRound[]) => {
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

  const registerCardRef = useCallback(
    (roundIndex: number, matchId: string) => (el: HTMLDivElement | null) => {
      if (!cardRefsByRound.current[roundIndex])
        cardRefsByRound.current[roundIndex] = new Map();

      const refsForRound = cardRefsByRound.current[roundIndex];

      if (el) refsForRound.set(matchId, el);
      else refsForRound.delete(matchId);
    },
    [],
  );

  return { containerRef, paths, svgSize, registerCardRef };
};
