import { Fragment } from 'react';
import { useMatches } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from '@/components/ui';
import type { Me } from '@/features/auth';
import { cn } from '@/lib';
import { SeasonSwitcher } from '../../features';
import { useBreadcrumbStore } from '../../stores';
import { UserMenu } from '../user-menu';
import { BreadcrumbEntry } from './breadcrumb-entry';

type RouteHandle = { breadcrumb: string };

type HeaderProps = {
  user: Omit<Me, 'id'>;
};

export const Header = ({ user }: HeaderProps) => {
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
      <Breadcrumb className="min-w-0 overflow-hidden">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumbItems.map((item, index) => (
            <Fragment key={item.label}>
              <BreadcrumbItem
                className={
                  index === breadcrumbItems.length - 1
                    ? 'min-w-0 truncate'
                    : 'shrink-0'
                }
              >
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

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <SeasonSwitcher />
        <UserMenu user={user} />
      </div>
    </header>
  );
};
