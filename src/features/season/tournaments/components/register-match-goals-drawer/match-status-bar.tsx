import { CalendarCheckIcon, ClockIcon, DicesIcon } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib';
import type { MatchDetail } from '../../api';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

type MatchStatusBarProps = {
  match: MatchDetail;
  readOnly: boolean;
  isSimulating: boolean;
  isSaving: boolean;
  onSimulate: () => void;
};

export const MatchStatusBar = ({
  match,
  readOnly,
  isSimulating,
  isSaving,
  onSimulate,
}: MatchStatusBarProps) => (
  <div className={'mt-3 flex items-center justify-between gap-3'}>
    <Badge
      variant={'outline'}
      className={cn(
        'gap-1 border-transparent',
        match.playedAt
          ? 'bg-muted text-muted-foreground'
          : 'bg-info-surface text-info',
      )}
    >
      {match.playedAt ? (
        <>
          <CalendarCheckIcon className="size-3" />
          Disputada em {dateFormatter.format(new Date(match.playedAt))}
        </>
      ) : (
        <>
          <ClockIcon className="size-3" />
          Ainda não disputada
        </>
      )}
    </Badge>

    {!match.playedAt && !readOnly && (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSimulating || isSaving}
        onClick={onSimulate}
      >
        <DicesIcon />
        {isSimulating ? 'Simulando...' : 'Simular resultado'}
      </Button>
    )}
  </div>
);
