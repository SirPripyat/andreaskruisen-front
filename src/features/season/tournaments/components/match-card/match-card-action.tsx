import type { VariantProps } from 'class-variance-authority';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { TooltipWrapper } from '@/components';
import { Button, type buttonVariants } from '@/components/ui';

type MatchCardActionProps = {
  matchId: string;
  locked: boolean;
  onRegisterGoals?: (matchId: string) => void;
  size?: VariantProps<typeof buttonVariants>['size'];
  className?: string;
};

export const MatchCardAction = ({
  matchId,
  locked,
  onRegisterGoals,
  size = 'icon',
  className,
}: MatchCardActionProps) => {
  if (!onRegisterGoals) return null;

  if (locked) {
    return (
      <TooltipWrapper label={'Ver detalhes'}>
        <Button
          type="button"
          variant="ghost"
          size={size}
          className={className}
          onClick={() => onRegisterGoals(matchId)}
        >
          <EyeIcon className="size-3.5" />
        </Button>
      </TooltipWrapper>
    );
  }

  return (
    <TooltipWrapper label={'Registrar placar'}>
      <Button
        type="button"
        variant="ghost"
        size={size}
        className={className}
        onClick={() => onRegisterGoals(matchId)}
      >
        <PencilIcon className="size-3.5" />
      </Button>
    </TooltipWrapper>
  );
};
