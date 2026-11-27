import { Cpu as CpuIcon, HandshakeIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button,
  PageHeader,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@/components';
import {
  MARKET_TABS,
  MarketNegotiations,
  MarketScoreboard,
  MarketStats,
  type MarketTab,
  MarketTimeline,
  NegotiateDrawer,
  useMarketTabs,
  useTransfersScreen,
} from '@/shared/features/transfers';

export const TransfersScreen = () => {
  const { tab, setTab } = useMarketTabs('timeline');

  const {
    selectedSeason,
    myTeamId,
    isWindowStatusPending,
    isWindowClosed,
    windowStatus,
    timelineCount,
    negotiationsCount,
  } = useTransfersScreen();

  const tabContent: Record<MarketTab, ReactNode> = {
    timeline: <MarketTimeline />,
    negotiations: <MarketNegotiations myTeamId={myTeamId} />,
  };

  const tabCount: Record<MarketTab, number> = {
    timeline: timelineCount,
    negotiations: negotiationsCount,
  };

  return (
    <>
      <PageHeader
        title={'Mercado'}
        description={`Trocas de mercado e negociações diretas na temporada "${selectedSeason?.name}".`}
        actions={
          <div className={'flex flex-wrap gap-2'}>
            <NegotiateDrawer
              seasonId={selectedSeason?.id}
              windowClosed={isWindowClosed}
              initialMode={'direct'}
              trigger={
                <Button
                  variant={'outline'}
                  disabled={!selectedSeason?.id || isWindowClosed}
                >
                  <HandshakeIcon />
                  {'Nova negociação'}
                </Button>
              }
            />
            <NegotiateDrawer
              seasonId={selectedSeason?.id}
              windowClosed={isWindowClosed}
              initialMode={'cpu'}
              trigger={
                <Button disabled={!selectedSeason?.id || isWindowClosed}>
                  <CpuIcon />
                  {'Transferência de mercado'}
                </Button>
              }
            />
          </div>
        }
      />

      <MarketScoreboard data={windowStatus} isPending={isWindowStatusPending} />

      <MarketStats myTeamId={myTeamId} />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as MarketTab)}
        className={'w-full items-center'}
      >
        <TabsList>
          <TabsTab value={'timeline'}>
            {'Linha do tempo'}
            <span
              className={
                'rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'
              }
            >
              {tabCount.timeline}
            </span>
          </TabsTab>
          <TabsTab value={'negotiations'}>
            {'Negociações'}
            <span
              className={
                'rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'
              }
            >
              {tabCount.negotiations}
            </span>
          </TabsTab>
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
