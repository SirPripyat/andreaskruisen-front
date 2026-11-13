export type RosterPlayer = {
  id: string;
  name: string;
  photoUrl: string;
  position: string;
  overallRating: number;
  birthdate: string;
  preferredFoot: 'LEFT' | 'RIGHT';
  nationality: { id: string; name: string; flagUrl: string };
  isStarter: boolean;
};
