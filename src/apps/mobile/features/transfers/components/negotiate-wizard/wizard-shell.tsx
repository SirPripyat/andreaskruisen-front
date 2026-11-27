import { ChevronLeftIcon, XIcon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';

type WizardShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  title: string;
  isFirstStep: boolean;
  onBack: () => void;
  stepDots: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export const WizardShell = ({
  open,
  onOpenChange,
  trigger,
  title,
  isFirstStep,
  onBack,
  stepDots,
  footer,
  children,
}: WizardShellProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger render={trigger} />
      <SheetContent
        side={'bottom'}
        showCloseButton={false}
        className={'gap-0 p-0'}
      >
        <header
          className={
            'flex h-12 shrink-0 items-center justify-between gap-2 border-b px-2 pt-[env(safe-area-inset-top)]'
          }
        >
          <Button
            type={'button'}
            variant={'ghost'}
            size={'icon-sm'}
            aria-label={'Voltar'}
            disabled={isFirstStep}
            onClick={onBack}
          >
            <ChevronLeftIcon />
          </Button>
          <SheetTitle className={'font-display font-semibold text-sm'}>
            {title}
          </SheetTitle>
          <SheetClose
            render={
              <Button
                type={'button'}
                variant={'ghost'}
                size={'icon-sm'}
                aria-label={'Fechar'}
              />
            }
          >
            <XIcon />
          </SheetClose>
        </header>

        {stepDots}

        <div className={'min-h-0 flex-1 overflow-y-auto px-4 py-3'}>
          {children}
        </div>

        {footer && (
          <footer
            className={
              'flex shrink-0 gap-2 border-t p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]'
            }
          >
            {footer}
          </footer>
        )}
      </SheetContent>
    </Sheet>
  );
};
