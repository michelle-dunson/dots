export type PlayerId = 0 | 1;
export type Cell = PlayerId | null;
export type GamePhase = "playing" | "finished";
export type GameResult = PlayerId | "tie" | null;

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  color: string;
  mark: "X" | "O";
  isHuman: boolean;
}

export interface TicTacToeState {
  board: Cell[];
  currentPlayer: PlayerId;
  players: PlayerConfig[];
  phase: GamePhase;
  result: GameResult;
}

export const BOARD_SIZE = 3;

export const PLAYER_COLORS: Record<PlayerId, string> = {
  0: "#c0392b",
  1: "#2980b9",
};
