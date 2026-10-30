export type RosterPlayer = {
  id: string;
  name: string;
  photoUrl: string;
  position: string;
  overallRating: number;
  preferredFoot: 'LEFT' | 'RIGHT';
  nationality: { id: string; name: string; flagUrl: string };
};
