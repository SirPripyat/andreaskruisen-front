import { Separator } from '@/components';
import type { PlayerRating } from '@/features/admin/players';
import { cn, formatDate, getOverallRatingClassName } from '@/lib';
import { PlayerAttributesRadar } from './player-attributes-radar';

type AttributeKey = Exclude<keyof PlayerRating, 'capturedAt'>;

type Category = {
  label: string;
  attributes: { key: AttributeKey; label: string }[];
};

const average = (values: number[]): number =>
  Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

const CATEGORIES: Category[] = [
  {
    label: 'Ritmo',
    attributes: [
      { key: 'acceleration', label: 'Aceleração' },
      { key: 'sprintSpeed', label: 'Velocidade' },
    ],
  },
  {
    label: 'Finalização',
    attributes: [
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
    attributes: [
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
    attributes: [
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
    attributes: [
      { key: 'interceptions', label: 'Interceptação' },
      { key: 'headingAccuracy', label: 'Cabeceio' },
      { key: 'defensiveAwareness', label: 'Consciência defensiva' },
      { key: 'standingTackle', label: 'Desarme em pé' },
      { key: 'slidingTackle', label: 'Carrinho' },
    ],
  },
  {
    label: 'Físico',
    attributes: [
      { key: 'jumping', label: 'Impulsão' },
      { key: 'stamina', label: 'Resistência' },
      { key: 'strength', label: 'Força' },
      { key: 'aggression', label: 'Agressividade' },
    ],
  },
  {
    label: 'Goleiro',
    attributes: [
      { key: 'gkDiving', label: 'Reflexo (voo)' },
      { key: 'gkHandling', label: 'Manejo' },
      { key: 'gkKicking', label: 'Chute' },
      { key: 'gkPositioning', label: 'Posicionamento' },
      { key: 'gkReflexes', label: 'Reflexos' },
    ],
  },
];

type PlayerAttributesPanelProps = {
  rating: PlayerRating;
  isGoalkeeper: boolean;
};

export const PlayerAttributesPanel = ({
  rating,
  isGoalkeeper,
}: PlayerAttributesPanelProps) => {
  const categories = CATEGORIES.filter((category) =>
    isGoalkeeper ? category.label === 'Goleiro' : category.label !== 'Goleiro',
  );

  const categoryOverall = (label: string): number => {
    const category = CATEGORIES.find((item) => item.label === label);

    return average(
      (category?.attributes ?? []).map(
        (attribute) => rating[attribute.key] as number,
      ),
    );
  };

  return (
    <div className={'flex flex-col gap-4'}>
      <div
        className={
          'flex flex-wrap items-center justify-between gap-2 border-b pb-3'
        }
      >
        <h2
          className={'font-display font-bold text-lg uppercase tracking-tight'}
        >
          Atributos
        </h2>
        <div
          className={
            'flex flex-wrap items-center gap-3 text-muted-foreground text-xs'
          }
        >
          <span>Habilidades {rating.skillMoves}★</span>
          <span>Pé fraco {rating.weakFootAbility}★</span>
          <span>Avaliado em {formatDate(rating.capturedAt)}</span>
        </div>
      </div>

      <div className={'flex flex-col gap-4 lg:flex-row lg:items-start'}>
        {!isGoalkeeper && (
          <div
            className={
              'flex shrink-0 items-center justify-center rounded-xl border bg-card p-4 lg:w-80'
            }
          >
            <PlayerAttributesRadar
              pac={categoryOverall('Ritmo')}
              sho={categoryOverall('Finalização')}
              pas={categoryOverall('Passe')}
              dri={categoryOverall('Drible')}
              def={categoryOverall('Defesa')}
              phy={categoryOverall('Físico')}
            />
          </div>
        )}

        <div
          className={
            'grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {categories.map((category) => {
            return (
              <div
                key={category.label}
                className={'flex flex-col gap-3 rounded-xl border bg-card p-4'}
              >
                <div className={'flex  flex-col justify-between gap-2'}>
                  <span
                    className={
                      'font-semibold text-sm text-muted-foreground tracking-wide'
                    }
                  >
                    {category.label}
                  </span>

                  <Separator />
                </div>

                <div className={'flex flex-col gap-1.5'}>
                  {category.attributes.map((attribute) => {
                    const value = rating[attribute.key] as number;

                    return (
                      <div
                        key={attribute.key}
                        className={'flex items-center justify-between gap-2'}
                      >
                        <span
                          className={'truncate text-muted-foreground text-xs'}
                        >
                          {attribute.label}
                        </span>
                        <span
                          className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-md font-display font-bold text-sm',
                            getOverallRatingClassName(value),
                          )}
                        >
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
