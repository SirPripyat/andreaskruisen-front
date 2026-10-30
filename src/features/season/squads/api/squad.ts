export type Squad = {
  id: string;
  seasonId: string;
  userId: string;
  teamId: string;
  createdAt: string;
};

export type SeasonSquad = Squad & {
  user: { id: string; name: string };
  team: {
    id: string;
    name: string;
    crestUrl: string;
    league: { id: string; name: string };
  };
};
