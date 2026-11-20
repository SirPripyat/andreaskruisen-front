import type { ReactNode } from 'react';
import { PageHeader, Tabs, TabsList, TabsPanel, TabsTab } from '@/components';
import { NegotiationWindowBanner } from '@/features/admin/negotiation-window';
import { CreateNegotiationDrawer } from '@/features/season/negotiations';
import {
  CreateTransferDrawer,
  NegotiationHistory,
  ReceivedNegotiationList,
  SentNegotationList,
} from './components';
import {
  MARKET_TABS,
  type MarketTab,
  useMarketTabs,
  useTransfersScreen,
} from './hooks';

export const TransfersScreen = () => {
  const { tab, setTab } = useMarketTabs('history');

  const {
    selectedSeason,
    myTeamId,
    isWindowStatusPending,
    isWindowClosed,
    windowStatus,
  } = useTransfersScreen();

  const tabContent: Record<MarketTab, ReactNode> = {
    history: <NegotiationHistory />,
    received: <ReceivedNegotiationList myTeamId={myTeamId} />,
    sent: <SentNegotationList myTeamId={myTeamId} />,
  };

  return (
    <>
      <PageHeader
        title={'Mercado'}
        description={`Trocas de mercado e negociações diretas na temporada "${selectedSeason?.name}".`}
        actions={
          <div className={'flex items-center gap-2'}>
            <CreateNegotiationDrawer
              seasonId={selectedSeason?.id}
              windowClosed={isWindowClosed}
            />
            <CreateTransferDrawer
              seasonId={selectedSeason?.id}
              windowClosed={isWindowClosed}
            />
          </div>
        }
      />

      <NegotiationWindowBanner
        data={windowStatus}
        isPending={isWindowStatusPending}
      />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as MarketTab)}
        className={'w-full items-center'}
      >
        <TabsList>
          <TabsTab value={'history'}>{'Histórico de trocas'}</TabsTab>
          <TabsTab value={'received'}>{'Negociações recebidas'}</TabsTab>
          <TabsTab value={'sent'}>{'Negociações enviadas'}</TabsTab>
        </TabsList>

        {MARKET_TABS.map((marketTab) => (
          <TabsPanel key={marketTab} value={marketTab}>
            {tabContent[marketTab]}
          </TabsPanel>
        ))}
      </Tabs>
    </>
  );
};
