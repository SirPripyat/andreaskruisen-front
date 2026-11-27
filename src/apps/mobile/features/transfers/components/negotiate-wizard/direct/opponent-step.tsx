import { useState } from 'react';
import { SearchInput } from '@/components';
import { FieldError } from '@/components/ui';
import { TeamSearchCard } from '../team-search-card';
import type { useDirectNegotiationWizard } from './use-direct-negotiation-wizard';

type OpponentStepProps = {
  wizard: ReturnType<typeof useDirectNegotiationWizard>;
};

export const OpponentStep = ({ wizard }: OpponentStepProps) => {
  const [search, setSearch] = useState('');
  const {
    squads,
    myTeam,
    targetSquad,
    selectOpponent,
    isOpponentLocked,
    errors,
  } = wizard;

  if (isOpponentLocked && targetSquad) {
    return (
      <div className={'flex flex-col gap-3'}>
        <p className={'text-muted-foreground text-xs'}>
          {'Adversário definido a partir do jogador escolhido.'}
        </p>
        <TeamSearchCard
          name={targetSquad.team.name}
          crestUrl={targetSquad.team.crestUrl}
          subtitle={targetSquad.user.name}
          selected
          onSelect={() => {}}
        />
      </div>
    );
  }

  const candidates = (squads ?? []).filter(
    (squad) => squad.team.id !== myTeam?.id,
  );
  const filtered = candidates.filter(
    (squad) =>
      !search || squad.team.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={'flex flex-col gap-3'}>
      <p className={'text-muted-foreground text-xs'}>
        {
          'Só participantes com elenco entram aqui — times de CPU usam a troca instantânea, fora desse fluxo.'
        }
      </p>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={'Buscar time...'}
        className={'max-w-none'}
      />

      {filtered.length === 0 ? (
        <div
          className={
            'rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
          }
        >
          {'Nenhum participante encontrado.'}
        </div>
      ) : (
        <div className={'flex flex-col gap-2'}>
          {filtered.map((squad) => (
            <TeamSearchCard
              key={squad.id}
              name={squad.team.name}
              crestUrl={squad.team.crestUrl}
              subtitle={squad.user.name}
              selected={squad.id === targetSquad?.id}
              onSelect={() => selectOpponent(squad)}
            />
          ))}
        </div>
      )}

      <FieldError
        errors={errors.targetTeamId ? [errors.targetTeamId] : undefined}
      />
    </div>
  );
};
