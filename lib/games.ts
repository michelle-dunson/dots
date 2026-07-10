export type GameId = "dots-and-boxes";

export interface GameInfo {
  id: GameId;
  name: string;
  description: string;
  available: boolean;
}

export const GAMES: GameInfo[] = [
  {
    id: "dots-and-boxes",
    name: "Dots & Boxes",
    description: "Draw lines. Close boxes. Score the most squares to win.",
    available: true,
  },
];
