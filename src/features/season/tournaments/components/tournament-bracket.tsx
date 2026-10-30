import { useParams } from 'react-router';
import { useBracketConnectors, useTournamentBracket } from '../hooks';
import { MatchCard } from './match-card/match-card';

export const TournamentBracket = () => {
  const { id } = useParams<{ id: string }>();
  const { rounds } = useTournamentBracket(id);
  const { containerRef, paths, svgSize, registerCardRef } =
    useBracketConnectors(rounds);

  if (rounds.length === 0)
    return (
      <p className={'text-center text-muted-foreground text-sm'}>
        Nenhuma fase de mata-mata ativa neste torneio.
      </p>
    );

  return (
    <div className={'flex flex-col gap-3'}>
      <span className={'font-medium text-muted-foreground text-xs uppercase'}>
        Chaveamento
      </span>

      <div className={'overflow-x-auto pb-2'}>
        <div ref={containerRef} className={'relative flex min-w-fit gap-14'}>
          <svg
            aria-hidden={true}
            className={
              'pointer-events-none absolute inset-0 overflow-visible text-border-strong'
            }
            width={svgSize.width}
            height={svgSize.height}
          >
            {paths.map((d) => (
              <path
                key={d}
                d={d}
                stroke={'currentColor'}
                strokeWidth={1.5}
                fill={'none'}
              />
            ))}
          </svg>

          {rounds.map((round, roundIndex) => (
            <div
              key={round.phase.id}
              className={'flex min-w-60 flex-col justify-around gap-5'}
            >
              <span
                className={
                  'text-center font-display font-bold text-muted-foreground text-xs uppercase'
                }
              >
                {round.phase.name}
              </span>
              <div className={'flex flex-1 flex-col justify-around gap-5'}>
                {round.matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isFinal={round.phase.name === 'Final'}
                    cardRef={registerCardRef(roundIndex, match.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
