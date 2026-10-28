type StatTileProps = {
  label: string;
  value: string;
  sub: string;
};

export function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 bg-muted/40 p-3">
      <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="truncate font-display font-bold text-lg">{value}</span>
      <span className="truncate text-muted-foreground text-xs">{sub}</span>
    </div>
  );
}
