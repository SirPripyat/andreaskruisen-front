import type { Formation } from '@/features/season/squads';
import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';
import { buildPitchSlots } from './pitch-layout';

type FormationPreviewProps = {
  formation: Formation;
};

// Sem o goleiro (sempre no mesmo lugar, não ajuda a diferenciar o esquema),
// a faixa de baixo do campo fica vazia — corta-se essa sobra da altura do
// recorte em vez de desenhar um campo inteiro por uma miniatura mais baixa.
export const FORMATION_PREVIEW_HEIGHT = PITCH_HEIGHT - 80;

// Miniatura do esquema pra um card na lista de formações — reaproveita
// buildPitchSlots sem titulares, que já devolve as 11 posições vazias da
// formação (mesma geometria do campo "de verdade"), só desenhadas como
// pontos num campinho simplificado em vez de avatares.
export const FormationPreview = ({ formation }: FormationPreviewProps) => {
  const slots = buildPitchSlots([], formation);
  const gradientId = `formation-preview-turf-${formation}`;

  return (
    <svg
      viewBox={`0 0 ${PITCH_WIDTH} ${FORMATION_PREVIEW_HEIGHT}`}
      className={'block h-full w-full'}
      aria-hidden={'true'}
    >
      <defs>
        <linearGradient id={gradientId} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
          <stop offset={'0'} stopColor={'#2d6b43'} />
          <stop offset={'0.55'} stopColor={'#1f5234'} />
          <stop offset={'1'} stopColor={'#123420'} />
        </linearGradient>
      </defs>

      <rect
        width={PITCH_WIDTH}
        height={FORMATION_PREVIEW_HEIGHT}
        rx={16}
        fill={`url(#${gradientId})`}
      />
      <line
        x1={10}
        y1={FORMATION_PREVIEW_HEIGHT / 2}
        x2={PITCH_WIDTH - 10}
        y2={FORMATION_PREVIEW_HEIGHT / 2}
        stroke={'#ffffff'}
        strokeOpacity={0.3}
        strokeWidth={4}
      />
      <circle
        cx={PITCH_WIDTH / 2}
        cy={FORMATION_PREVIEW_HEIGHT / 2}
        r={60}
        stroke={'#ffffff'}
        strokeOpacity={0.3}
        strokeWidth={4}
        fill={'none'}
      />

      {slots
        .filter((slot) => slot.position !== 'GOL')
        .map((slot) => (
          <circle
            key={`${slot.position}-${slot.x}-${slot.y}`}
            cx={slot.x}
            cy={slot.y}
            r={22}
            fill={'#ffffff'}
            fillOpacity={0.92}
            stroke={'#123420'}
            strokeWidth={3}
          />
        ))}
    </svg>
  );
};
