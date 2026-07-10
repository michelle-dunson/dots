export type PlayerId = 0 | 1;
export type GameMode = "solo" | "versus";
export type HangmanPhase = "enter-word" | "guessing" | "round-over";

export const MAX_WRONG_GUESSES = 6;
export const MIN_WORD_LENGTH = 4;
export const MAX_WORD_LENGTH = 12;

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  color: string;
  isHuman: boolean;
}

export interface HangmanState {
  mode: GameMode;
  players: PlayerConfig[];
  scores: Record<PlayerId, number>;
  word: string;
  guessedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  phase: HangmanPhase;
  setterId: PlayerId;
  guesserId: PlayerId;
  roundWinner: PlayerId | null;
  soloWins: number;
  soloLosses: number;
}

export const PLAYER_COLORS: Record<PlayerId, string> = {
  0: "#c0392b",
  1: "#2980b9",
};
