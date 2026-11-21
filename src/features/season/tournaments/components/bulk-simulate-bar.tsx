import { DicesIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui';

type BulkSimulateBarProps = {
  count: number;
  onClear: () => void;
  onSimulate: () => void;
};

export const BulkSimulateBar = ({
  count,
  onClear,
  onSimulate,
}: BulkSimulateBarProps) => {
  if (count === 0) return null;

  return (
    <div
      className={
        'sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border bg-foreground px-4 py-2.5 text-background shadow-lg'
      }
    >
      <span className={'text-sm'}>
        <strong className={'font-semibold'}>{count}</strong>
        {count > 1 ? ' jogos selecionados' : ' jogo selecionado'}
      </span>

      <div className={'flex items-center gap-2'}>
        <Button
          type={'button'}
          variant={'ghost'}
          size={'sm'}
          className={
            'text-background hover:bg-background/10 hover:text-background'
          }
          onClick={onClear}
        >
          <XIcon />
          Limpar
        </Button>
        <Button type={'button'} size={'sm'} onClick={onSimulate}>
          <DicesIcon />
          Simular selecionados
        </Button>
      </div>
    </div>
  );
};
