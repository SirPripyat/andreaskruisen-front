import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components';
import type { AdminNavItem, NavItem } from '@/shared/layout';
import { NavGroup } from './nav-group';

type MoreItemsSheetProps = {
  isMoreItemsOpen: boolean;
  toggleMoreItems: () => void;
  overflowMainItems: NavItem[];
  overflowAdminItems: AdminNavItem[];
};

export const MoreItemsSheet = ({
  isMoreItemsOpen,
  toggleMoreItems,
  overflowAdminItems,
  overflowMainItems,
}: MoreItemsSheetProps) => {
  return (
    <Sheet open={isMoreItemsOpen} onOpenChange={toggleMoreItems}>
      <SheetContent className={'bg-muted/30'}>
        <SheetHeader>
          <SheetTitle className={'font-display text-2xl font-extrabold'}>
            Mais
          </SheetTitle>
        </SheetHeader>

        <div
          className={
            'flex flex-col gap-6 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]'
          }
        >
          <NavGroup items={overflowMainItems} onNavigate={toggleMoreItems} />

          {overflowAdminItems.length > 0 && (
            <div className={'flex flex-col gap-1.5'}>
              <p
                className={
                  'px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide'
                }
              >
                Administração
              </p>
              <NavGroup
                items={overflowAdminItems}
                onNavigate={toggleMoreItems}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
