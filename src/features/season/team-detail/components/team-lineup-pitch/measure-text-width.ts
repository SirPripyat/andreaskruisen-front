const FONT_FAMILY = '"IBM Plex Sans", -apple-system, "Segoe UI", sans-serif';

let measureContext: CanvasRenderingContext2D | null | undefined;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (measureContext !== undefined) return measureContext;
  measureContext =
    typeof document === 'undefined'
      ? null
      : (document.createElement('canvas').getContext('2d') ?? null);
  return measureContext;
}

// Largura real do texto nessa fonte/tamanho, via canvas offscreen — usado pra
// dimensionar o fundo do nome do jogador no tamanho exato do texto em vez de
// uma largura fixa. Sem canvas (ex: SSR), cai numa estimativa por caractere.
export function measureTextWidth(
  text: string,
  fontSize: number,
  fontWeight: number,
): number {
  const context = getMeasureContext();
  if (!context) return text.length * fontSize * 0.55;

  context.font = `${fontWeight} ${fontSize}px ${FONT_FAMILY}`;
  return context.measureText(text).width;
}
