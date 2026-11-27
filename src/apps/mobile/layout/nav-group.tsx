import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import type { AdminNavItem, NavItem } from '@/shared/layout';

type NavGroupProps = {
  items: (NavItem | AdminNavItem)[];
  onNavigate: () => void;
};

export const NavGroup = ({ items, onNavigate }: NavGroupProps) => {
  return (
    <div
      className={
        'divide-y divide-border overflow-hidden rounded-xl border bg-card'
      }
    >
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.url}
          onClick={onNavigate}
          className={'flex items-center gap-3 px-3 py-2.5 active:bg-muted/60'}
        >
          <span
            className={
              'flex size-7 shrink-0 items-center justify-center rounded-md bg-accent-surface text-accent'
            }
          >
            <item.icon className={'size-4'} />
          </span>
          <span className={'flex-1 text-sm'}>{item.title}</span>
          <ChevronRightIcon
            className={'size-4 shrink-0 text-muted-foreground'}
          />
        </Link>
      ))}
    </div>
  );
};
