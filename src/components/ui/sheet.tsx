'use client';

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { cn } from 'cn';
import { XIcon } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/ui/button';

const Sheet = ({ ...props }: SheetPrimitive.Root.Props) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
};

const SheetTrigger = ({ ...props }: SheetPrimitive.Trigger.Props) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
};

const SheetClose = ({ ...props }: SheetPrimitive.Close.Props) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
};

const SheetPortal = ({ ...props }: SheetPrimitive.Portal.Props) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
};

const SheetOverlay = ({
  className,
  ...props
}: SheetPrimitive.Backdrop.Props) => {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
        className,
      )}
      {...props}
    />
  );
};

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const SHEET_SIDE_CLASSES: Record<SheetSide, string> = {
  bottom:
    'inset-x-0 top-auto bottom-0 h-auto border-t data-ending-style:translate-y-[2.5rem] data-starting-style:translate-y-[2.5rem]',
  top: 'inset-x-0 bottom-auto top-0 h-auto border-t-0 border-b data-ending-style:translate-y-[-2.5rem] data-starting-style:translate-y-[-2.5rem]',
  left: 'inset-y-0 right-auto left-0 h-full w-3/4 max-w-sm border-t-0 border-r data-ending-style:translate-x-[-2.5rem] data-starting-style:translate-x-[-2.5rem]',
  right:
    'inset-y-0 left-auto right-0 h-full w-3/4 max-w-sm border-t-0 border-l data-ending-style:translate-x-[2.5rem] data-starting-style:translate-x-[2.5rem]',
};

const SHEET_SIDE_DESKTOP_CLASSES: Record<SheetSide, string> = {
  bottom: 'sm:h-auto',
  top: 'sm:bottom-auto sm:top-0 sm:h-auto sm:border-t-0 sm:border-b sm:data-ending-style:translate-y-[-2.5rem] sm:data-starting-style:translate-y-[-2.5rem]',
  left: 'sm:inset-y-0 sm:right-auto sm:left-0 sm:h-full sm:w-3/4 sm:max-w-sm sm:border-t-0 sm:border-r sm:data-ending-style:translate-x-[-2.5rem] sm:data-ending-style:translate-y-0 sm:data-starting-style:translate-x-[-2.5rem] sm:data-starting-style:translate-y-0',
  right:
    'sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:w-3/4 sm:max-w-sm sm:border-t-0 sm:border-l sm:data-ending-style:translate-x-[2.5rem] sm:data-ending-style:translate-y-0 sm:data-starting-style:translate-x-[2.5rem] sm:data-starting-style:translate-y-0',
};

const SheetContent = ({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  mobileBottomSheet = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: SheetSide;
  showCloseButton?: boolean;
  mobileBottomSheet?: boolean;
}) => {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0',
          mobileBottomSheet
            ? cn(
                'inset-x-0 bottom-0 h-[90%] w-full border-t',
                'data-ending-style:translate-y-[2.5rem] data-starting-style:translate-y-[2.5rem]',
                SHEET_SIDE_DESKTOP_CLASSES[side],
              )
            : SHEET_SIDE_CLASSES[side],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
};

const SheetHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-0.5 p-4', className)}
      {...props}
    />
  );
};

const SheetFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
};

const SheetTitle = ({ className, ...props }: SheetPrimitive.Title.Props) => {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-base font-medium text-foreground', className)}
      {...props}
    />
  );
};

const SheetDescription = ({
  className,
  ...props
}: SheetPrimitive.Description.Props) => {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
