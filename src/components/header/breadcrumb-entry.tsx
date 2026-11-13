import { Link } from 'react-router';
import type { BreadcrumbItem as BreadcrumbItemData } from '@/stores';
import { BreadcrumbLink, BreadcrumbPage } from '../ui';

type BreadcrumbEntryProps = {
  item: BreadcrumbItemData;
  isLast: boolean;
};

export const BreadcrumbEntry = ({ item, isLast }: BreadcrumbEntryProps) => {
  if (isLast) return <BreadcrumbPage>{item.label}</BreadcrumbPage>;

  if (item.href)
    return (
      <BreadcrumbLink render={<Link to={item.href} />}>
        {item.label}
      </BreadcrumbLink>
    );

  return item.label;
};
