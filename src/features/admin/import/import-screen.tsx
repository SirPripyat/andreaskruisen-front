import { FileJsonIcon, ImageIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from 'src/components';
import { ImportFileCard } from './components';
import {
  useImportLineupsScreen,
  useImportPlayersScreen,
  useImportTeamImagesScreen,
} from './hooks';

export const ImportScreen = () => {
  const playersScreen = useImportPlayersScreen();
  const lineupsScreen = useImportLineupsScreen();
  const teamImagesScreen = useImportTeamImagesScreen();

  return (
    <>
      <PageHeader
        title={'Importações'}
        description={
          'Envie os arquivos JSON exportados pelo scraper para atualizar jogadores, escalações e imagens dos clubes.'
        }
      />

      <div className={'grid grid-cols-1 gap-6 lg:grid-cols-3'}>
        <ImportFileCard
          formId={'import-players-form'}
          title={'Jogadores'}
          description={
            'O arquivo deve conter a lista de jogadores no formato gerado pelo scraper (até 50 MB).'
          }
          fileFieldLabel={'Selecionar arquivo JSON'}
          fileHint={'Até 50 MB'}
          accept={'application/json,.json'}
          icon={FileJsonIcon}
          submitLabel={'Importar'}
          pendingLabel={'Importando...'}
          screen={playersScreen}
        />

        <ImportFileCard
          formId={'import-lineups-form'}
          title={'Escalações'}
          description={
            'O arquivo deve conter as escalações titulares por time no formato gerado pelo scraper (até 50 MB).'
          }
          fileFieldLabel={'Selecionar arquivo JSON'}
          fileHint={'Até 50 MB'}
          accept={'application/json,.json'}
          icon={UsersIcon}
          submitLabel={'Importar'}
          pendingLabel={'Importando...'}
          screen={lineupsScreen}
        />

        <ImportFileCard
          formId={'import-team-images-form'}
          title={'Imagens dos clubes'}
          description={
            'O arquivo deve conter os escudos dos clubes no formato gerado pelo scraper (até 50 MB).'
          }
          fileFieldLabel={'Selecionar arquivo JSON'}
          fileHint={'Até 50 MB'}
          accept={'application/json,.json'}
          icon={ImageIcon}
          submitLabel={'Importar'}
          pendingLabel={'Importando...'}
          screen={teamImagesScreen}
        />
      </div>
    </>
  );
};
