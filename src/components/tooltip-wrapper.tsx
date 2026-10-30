import type { ReactElement } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui';

type TooltipWrapperProps = {
  children: ReactElement;
  label: string;
};

export const TooltipWrapper = ({ children, label }: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
