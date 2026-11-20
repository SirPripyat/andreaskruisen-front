export type NegotiationWindow = {
  id: string;
  seasonId: string;
  feeEnabled: boolean;
  openedAt: string;
  openedBy: { id: string; name: string };
  closedAt: string | null;
  closedBy: { id: string; name: string } | null;
};

export type NegotiationWindowStatus = {
  open: NegotiationWindow | null;
  history: NegotiationWindow[];
};
