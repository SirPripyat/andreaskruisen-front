import { useEffect } from 'react';
import { type BreadcrumbItem, useBreadcrumbStore } from '../stores';

export const useBreadcrumbItems = (breadcrumbData: BreadcrumbItem[]) => {
  const setBreadcrumbItems = useBreadcrumbStore((s) => s.setBreadcrumbItems);
  const clearBreadcrumbItems = useBreadcrumbStore(
    (s) => s.clearBreadcrumbItems,
  );

  useEffect(() => {
    setBreadcrumbItems(breadcrumbData);

    return () => clearBreadcrumbItems();
  }, [breadcrumbData, setBreadcrumbItems, clearBreadcrumbItems]);
};
