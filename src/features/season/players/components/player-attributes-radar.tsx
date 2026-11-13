type RadarCategory = {
  key: string;
  label: string;
  value: number;
};

type PlayerAttributesRadarProps = {
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
};

const CENTER = 190;
const MAX_RADIUS = 120;
const LABEL_RADIUS = 138;
const RINGS = [20, 40, 60, 80, 100];

const point = (angleDeg: number, radius: number) => {
  const rad = (angleDeg * Math.PI) / 180;

  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
};

const toPolygonPoints = (categories: RadarCategory[], radiusForValue: number) =>
  categories
    .map((category, index) => {
      const { x, y } = point(
        index * 60,
        radiusForValue * (category.value / 100),
      );
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

const getTierColor = (value: number) => {
  if (value >= 90) return 'var(--color-info)';
  if (value >= 80) return 'var(--color-success)';
  if (value >= 65) return 'var(--color-warning)';
  return 'var(--color-critical)';
};

export const PlayerAttributesRadar = ({
  pac,
  sho,
  pas,
  dri,
  def,
  phy,
}: PlayerAttributesRadarProps) => {
  const categories: RadarCategory[] = [
    { key: 'pac', label: 'Ritmo', value: pac },
    { key: 'sho', label: 'Finalização', value: sho },
    { key: 'pas', label: 'Passe', value: pas },
    { key: 'dri', label: 'Drible', value: dri },
    { key: 'def', label: 'Defesa', value: def },
    { key: 'phy', label: 'Físico', value: phy },
  ];

  return (
    <svg
      viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
      className={'h-auto w-full max-w-72 overflow-visible'}
      role={'img'}
      aria-label={'Radar de atributos principais'}
    >
      {RINGS.map((level) => (
        <polygon
          key={level}
          points={toPolygonPoints(
            categories.map((category) => ({ ...category, value: level })),
            MAX_RADIUS,
          )}
          fill={'none'}
          stroke={'var(--color-border-strong)'}
          strokeWidth={level === 100 ? 1.4 : 1}
          opacity={level === 100 ? 0.9 : 0.5}
        />
      ))}

      {categories.map((category, index) => {
        const edge = point(index * 60, MAX_RADIUS);

        return (
          <line
            key={category.key}
            x1={CENTER}
            y1={CENTER}
            x2={edge.x}
            y2={edge.y}
            stroke={'var(--color-border-strong)'}
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      <polygon
        points={toPolygonPoints(categories, MAX_RADIUS)}
        fill={'var(--color-accent)'}
        fillOpacity={0.16}
        stroke={'var(--color-accent)'}
        strokeWidth={2}
      />

      {categories.map((category, index) => {
        const vertex = point(index * 60, MAX_RADIUS * (category.value / 100));
        const label = point(index * 60, LABEL_RADIUS);
        const angleSin = Math.sin((index * 60 * Math.PI) / 180);
        const anchor =
          Math.abs(angleSin) < 0.2
            ? 'middle'
            : label.x > CENTER
              ? 'start'
              : 'end';

        return (
          <g key={category.key}>
            <circle
              cx={vertex.x}
              cy={vertex.y}
              r={4}
              fill={getTierColor(category.value)}
              stroke={'var(--color-surface)'}
              strokeWidth={1.5}
            />
            <text
              x={label.x}
              y={label.y - 4}
              textAnchor={anchor}
              fontFamily={'var(--font-sans)'}
              fontWeight={600}
              fontSize={11}
              fill={'var(--color-foreground)'}
            >
              {category.label}
            </text>
            <text
              x={label.x}
              y={label.y + 12}
              textAnchor={anchor}
              fontFamily={'var(--font-mono)'}
              fontSize={11}
              fill={'var(--color-muted-foreground)'}
            >
              {category.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
