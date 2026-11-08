import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { cn } from 'cn';

const Collapsible = ({ ...props }: CollapsiblePrimitive.Root.Props) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

const CollapsibleTrigger = ({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props) => {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(className)}
      {...props}
    />
  );
};

const CollapsibleContent = ({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) => {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        'h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
        className,
      )}
      {...props}
    />
  );
};

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
