import { Fragment } from 'react';
import { Link, useMatches } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from '@/components/ui';
import { cn } from '@/lib';
import { SeasonSwitcher } from '../features';
import {
  type BreadcrumbItem as BreadcrumbItemData,
  useBreadcrumbStore,
} from '../stores';
import { ThemeToggle } from './theme-toggle';

type RouteHandle = { breadcrumb: string };

const BreadcrumbEntry = ({
  item,
  isLast,
}: {
  item: BreadcrumbItemData;
  isLast: boolean;
}) => {
  if (isLast) return <BreadcrumbPage>{item.label}</BreadcrumbPage>;

  if (item.href)
    return (
      <BreadcrumbLink render={<Link to={item.href} />}>
        {item.label}
      </BreadcrumbLink>
    );

  return item.label;
};

export const Header = () => {
  const { items } = useBreadcrumbStore();

  const matches = useMatches();

  const defaultBreadcrumb = matches
    .map((match) => (match.handle as RouteHandle | undefined)?.breadcrumb)
    .filter(Boolean)
    .pop();

  const breadcrumbItems =
    items ?? (defaultBreadcrumb ? [{ label: defaultBreadcrumb }] : []);

  return (
    <header
      className={cn(
        'flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-10',
      )}
    >
      <SidebarTrigger className={'-ml-1'} />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                <BreadcrumbEntry
                  item={item}
                  isLast={index === breadcrumbItems.length - 1}
                />
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <SeasonSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
};
