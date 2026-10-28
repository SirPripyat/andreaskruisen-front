import { useUserStore } from '@/stores';
import { useSelectedSeason } from '../../seasons';

export const Greeting = () => {
  const { user } = useUserStore();
  const { selectedSeason } = useSelectedSeason();

  const firstName = user?.name.trim().split(/\s+/)[0];

  const nameText = firstName ? `Olá, ${firstName}` : 'Olá';

  const seasonText = selectedSeason
    ? `Resumo da temporada "${selectedSeason.name}".`
    : 'Nenhuma temporada selecionada ainda.';

  return (
    <div className={'flex flex-col gap-1'}>
      <p
        className={
          'font-mono text-xs font-semibold tracking-wider text-accent uppercase'
        }
      >
        Painel
      </p>

      <h1
        className={
          'font-display text-3xl font-extrabold leading-none text-balance'
        }
      >
        {nameText}
      </h1>
      <p className={'max-w-2xl text-sm text-muted-foreground'}>{seasonText}</p>
    </div>
  );
};
