export type TeamWithRatings = {
  id: string;
  name: string;
  crestUrl: string;
  league: { id: string; name: string };
  averageOverallRating: number | null;
  averageDefenseRating: number | null;
  averageMidfieldRating: number | null;
  averageAttackRating: number | null;
  formation: string | null;
};
