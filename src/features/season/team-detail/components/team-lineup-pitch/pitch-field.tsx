import { PITCH_HEIGHT, PITCH_WIDTH } from './pitch-dimensions';

const MARGIN = 10;
const PLAY_WIDTH = PITCH_WIDTH - MARGIN * 2;
const PLAY_HEIGHT = PITCH_HEIGHT - MARGIN * 2;
const CENTER_X = PITCH_WIDTH / 2;
const CENTER_Y = MARGIN + PLAY_HEIGHT / 2;

// Proporções herdadas do desenho original (canvas 500x700) — manter aqui
// garante que a marcação do campo continua correta se PITCH_WIDTH/HEIGHT mudar.
const GOAL_BOX_WIDTH = PLAY_WIDTH * (220 / 480);
const GOAL_BOX_HEIGHT = PLAY_HEIGHT * (90 / 680);
const SIX_YARD_WIDTH = PLAY_WIDTH * (120 / 480);
const SIX_YARD_HEIGHT = PLAY_HEIGHT * (36 / 680);
const CIRCLE_RADIUS = PLAY_WIDTH * (55 / 480);
const PENALTY_SPOT_OFFSET = PLAY_HEIGHT * (70 / 680);
const CORNER_RADIUS = 12;

const GOAL_BOX_X = CENTER_X - GOAL_BOX_WIDTH / 2;
const SIX_YARD_X = CENTER_X - SIX_YARD_WIDTH / 2;
const ARC_HALF_WIDTH = CIRCLE_RADIUS;

const TOP_GOAL_BOX_BOTTOM = MARGIN + GOAL_BOX_HEIGHT;
const BOTTOM_GOAL_BOX_TOP = PITCH_HEIGHT - MARGIN - GOAL_BOX_HEIGHT;

const STRIPE_ROWS = [0, 1, 2, 3, 4, 5, 6];
const STRIPE_HEIGHT = PITCH_HEIGHT / STRIPE_ROWS.length;

export const PitchField = () => {
  return (
    <>
      <defs>
        <linearGradient id="pitch-turf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d6b43" />
          <stop offset="0.55" stopColor="#1f5234" />
          <stop offset="1" stopColor="#123420" />
        </linearGradient>
      </defs>

      <rect width={PITCH_WIDTH} height={PITCH_HEIGHT} fill="url(#pitch-turf)" />
      {STRIPE_ROWS.map((row) => (
        <rect
          key={row}
          x={0}
          y={row * STRIPE_HEIGHT}
          width={PITCH_WIDTH}
          height={STRIPE_HEIGHT}
          className={row % 2 === 0 ? 'fill-white/5' : 'fill-transparent'}
        />
      ))}
      <g className="stroke-white/40" strokeWidth={2} fill="none">
        <rect x={MARGIN} y={MARGIN} width={PLAY_WIDTH} height={PLAY_HEIGHT} />
        <line
          x1={MARGIN}
          y1={CENTER_Y}
          x2={PITCH_WIDTH - MARGIN}
          y2={CENTER_Y}
        />
        <circle cx={CENTER_X} cy={CENTER_Y} r={CIRCLE_RADIUS} />
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={2.5}
          className="fill-white/40"
          stroke="none"
        />

        {/* Grande área, pequena área e meia-lua do gol de cima */}
        <rect
          x={GOAL_BOX_X}
          y={MARGIN}
          width={GOAL_BOX_WIDTH}
          height={GOAL_BOX_HEIGHT}
        />
        <rect
          x={SIX_YARD_X}
          y={MARGIN}
          width={SIX_YARD_WIDTH}
          height={SIX_YARD_HEIGHT}
        />
        <path
          d={`M ${CENTER_X - ARC_HALF_WIDTH} ${TOP_GOAL_BOX_BOTTOM} A ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 0 0 ${CENTER_X + ARC_HALF_WIDTH} ${TOP_GOAL_BOX_BOTTOM}`}
        />
        <circle
          cx={CENTER_X}
          cy={MARGIN + PENALTY_SPOT_OFFSET}
          r={2.5}
          className="fill-white/40"
          stroke="none"
        />

        {/* Grande área, pequena área e meia-lua do gol de baixo */}
        <rect
          x={GOAL_BOX_X}
          y={BOTTOM_GOAL_BOX_TOP}
          width={GOAL_BOX_WIDTH}
          height={GOAL_BOX_HEIGHT}
        />
        <rect
          x={SIX_YARD_X}
          y={PITCH_HEIGHT - MARGIN - SIX_YARD_HEIGHT}
          width={SIX_YARD_WIDTH}
          height={SIX_YARD_HEIGHT}
        />
        <path
          d={`M ${CENTER_X - ARC_HALF_WIDTH} ${BOTTOM_GOAL_BOX_TOP} A ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 0 1 ${CENTER_X + ARC_HALF_WIDTH} ${BOTTOM_GOAL_BOX_TOP}`}
        />
        <circle
          cx={CENTER_X}
          cy={PITCH_HEIGHT - MARGIN - PENALTY_SPOT_OFFSET}
          r={2.5}
          className="fill-white/40"
          stroke="none"
        />

        {/* Escanteios */}
        <path
          d={`M ${MARGIN} ${MARGIN + CORNER_RADIUS} A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${MARGIN + CORNER_RADIUS} ${MARGIN}`}
        />
        <path
          d={`M ${PITCH_WIDTH - MARGIN - CORNER_RADIUS} ${MARGIN} A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${PITCH_WIDTH - MARGIN} ${MARGIN + CORNER_RADIUS}`}
        />
        <path
          d={`M ${MARGIN + CORNER_RADIUS} ${PITCH_HEIGHT - MARGIN} A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${MARGIN} ${PITCH_HEIGHT - MARGIN - CORNER_RADIUS}`}
        />
        <path
          d={`M ${PITCH_WIDTH - MARGIN} ${PITCH_HEIGHT - MARGIN - CORNER_RADIUS} A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${PITCH_WIDTH - MARGIN - CORNER_RADIUS} ${PITCH_HEIGHT - MARGIN}`}
        />
      </g>
    </>
  );
};
