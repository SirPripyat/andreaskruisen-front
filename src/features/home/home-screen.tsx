import {
  ArrowRightIcon,
  ShieldIcon,
  TrophyIcon,
  UserRoundIcon,
  UsersIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { StatTile } from '@/components';
import { usePlayers } from '@/features/players';
import { useSelectedSeason } from '@/features/seasons';
import { useTeams } from '@/features/teams';
import { useTournaments } from '@/features/tournaments';
import { useUserStore } from '../../stores';

const numberFormatter = new Intl.NumberFormat('pt-BR');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

const quickLinks = [
  {
    title: 'Torneios',
    description: 'Fases, jogos, chaveamento e artilheiros da temporada.',
    href: '/tournaments',
    icon: TrophyIcon,
  },
  {
    title: 'Times',
    description: 'Elencos e médias de avaliação por linha do time.',
    href: '/teams',
    icon: ShieldIcon,
  },
  {
    title: 'Jogadores',
    description: 'Base completa de jogadores, posições e avaliações.',
    href: '/players',
    icon: UserRoundIcon,
  },
] as const;

export function HomeScreen() {
  const { user } = useUserStore();
  const { selectedSeason } = useSelectedSeason();
  const { data: players } = usePlayers({
    page: 1,
    pageSize: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const { data: teams } = useTeams({
    page: 1,
    pageSize: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const { data: tournaments } = useTournaments(selectedSeason?.id);

  const firstName = user?.name.trim().split(/\s+/)[0];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <p className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
          Painel
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none text-balance">
          {firstName ? `Olá, ${firstName}` : 'Olá'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {selectedSeason
            ? `Resumo da temporada "${selectedSeason.name}".`
            : 'Nenhuma temporada selecionada ainda.'}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border rounded-xl border sm:grid-cols-4 sm:divide-y-0">
        <StatTile
          label="Jogadores"
          value={players ? numberFormatter.format(players.total) : '-'}
          sub="Na base"
        />
        <StatTile
          label="Times"
          value={teams ? numberFormatter.format(teams.total) : '-'}
          sub="Cadastrados"
        />
        <StatTile
          label="Torneios"
          value={tournaments ? numberFormatter.format(tournaments.length) : '-'}
          sub={selectedSeason ? 'Nesta temporada' : 'Nenhuma temporada'}
        />
        <StatTile
          label="Temporada"
          value={selectedSeason?.name ?? '-'}
          sub={
            selectedSeason
              ? `Desde ${dateFormatter.format(new Date(selectedSeason.startedAt))}`
              : 'Nenhuma selecionada'
          }
        />
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg">Acesso rápido</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group flex flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-accent/40 hover:bg-accent-surface"
            >
              <link.icon className="size-5 text-accent" />
              <span className="font-display font-semibold">{link.title}</span>
              <span className="text-sm text-muted-foreground">
                {link.description}
              </span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Acessar <ArrowRightIcon className="size-3.5" />
              </span>
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link
              to="/users"
              className="group flex flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-accent/40 hover:bg-accent-surface"
            >
              <UsersIcon className="size-5 text-accent" />
              <span className="font-display font-semibold">Usuários</span>
              <span className="text-sm text-muted-foreground">
                Contas com acesso à plataforma e seus papéis.
              </span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Acessar <ArrowRightIcon className="size-3.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
