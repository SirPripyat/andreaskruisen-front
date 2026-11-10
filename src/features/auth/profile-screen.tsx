import { PageHeader } from '@/components';
import { Skeleton } from '@/components/ui';
import { UpdateProfileForm } from './components';
import { useMe } from './hooks';

export const ProfileScreen = () => {
  const { data: me, isPending } = useMe();

  return (
    <>
      <PageHeader
        title={'Meu perfil'}
        description={'Gerencie seus dados de acesso à aplicação.'}
      />

      {isPending || !me ? (
        <Skeleton className={'h-96 w-full max-w-md'} />
      ) : (
        <UpdateProfileForm me={me} />
      )}
    </>
  );
};
