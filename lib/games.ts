export type GameId = "dots-and-boxes" | "tic-tac-toe" | "hangman";

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
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Get three in a row before your opponent does.",
    available: true,
  },
  {
    id: "hangman",
    name: "Hangman",
    description: "Guess the word letter by letter before the drawing is complete.",
    available: true,
  },
];
