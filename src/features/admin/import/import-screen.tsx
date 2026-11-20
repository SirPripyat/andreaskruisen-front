import { FileJsonIcon, ImageIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from 'src/components';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui';
import { ImportFileCard } from './components';
import {
  type ImportTab,
  useImportFcmPlayersScreen,
  useImportLineupsScreen,
  useImportPlayersScreen,
  useImportTabs,
  useImportTeamImagesScreen,
} from './hooks';

export const ImportScreen = () => {
  const { tab, setTab } = useImportTabs();

  const playersScreen = useImportPlayersScreen();
  const lineupsScreen = useImportLineupsScreen();
  const teamImagesScreen = useImportTeamImagesScreen();
  const fcmPlayersScreen = useImportFcmPlayersScreen();

  return (
    <>
      <PageHeader
        title={'Importações'}
        description={
          'Envie os arquivos JSON exportados pelo scraper para atualizar jogadores, escalações e imagens dos clubes.'
        }
      />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as ImportTab)}
        className={'w-full items-center'}
      >
        <TabsList>
          <TabsTab value={'sofifa'}>{'Sofifa'}</TabsTab>
          <TabsTab value={'fc-squad-mania'}>{'FC Squad Mania'}</TabsTab>
        </TabsList>

        <TabsPanel value={'sofifa'}>
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
        </TabsPanel>

        <TabsPanel value={'fc-squad-mania'}>
          <div className={'grid grid-cols-1 gap-6 lg:grid-cols-3'}>
            <ImportFileCard
              formId={'import-fcm-players-form'}
              title={'Jogadores'}
              description={
                'O arquivo deve conter a lista de jogadores no formato gerado pelo FC Squad Mania (até 50 MB).'
              }
              fileFieldLabel={'Selecionar arquivo JSON'}
              fileHint={'Até 50 MB'}
              accept={'application/json,.json'}
              icon={FileJsonIcon}
              submitLabel={'Importar'}
              pendingLabel={'Importando...'}
              screen={fcmPlayersScreen}
            />
          </div>
        </TabsPanel>
      </Tabs>
    </>
  );
};
