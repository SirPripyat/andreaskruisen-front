export type RosterPlayerPositionRating = {
  position: string;
  overall: number;
};

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
  // Overall em cada uma das 27 posições do grid SoFIFA (ver PlayerRating no
  // back) — usado pra mostrar o overall NA posição do slot que o jogador
  // ocupa na escalação, em vez do overallRating genérico (posição
  // primária). PositionCode (as 12 usadas na escalação) é um subconjunto
  // exato desse grid, então dá pra casar pelo código direto.
  positionRatings: RosterPlayerPositionRating[];
};
