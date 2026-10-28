import { create } from 'zustand';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbStore = {
  items: BreadcrumbItem[] | null;
  setBreadcrumbItems: (items: BreadcrumbItem[]) => void;
  clearBreadcrumbItems: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  items: null,
  setBreadcrumbItems: (items) => set({ items }),
  clearBreadcrumbItems: () => set({ items: null }),
}));
