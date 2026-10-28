import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks';
import { cn } from '@/lib';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
      }
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted',
        className,
      )}
    >
      {theme === 'dark' ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
};
