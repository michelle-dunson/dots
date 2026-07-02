export const GRID_SIZE = 7;
export const SQUARE_COUNT = (GRID_SIZE - 1) * (GRID_SIZE - 1);

export type EdgeId = `h:${number}:${number}` | `v:${number}:${number}`;
export type PlayerId = 0 | 1 | 2 | 3;
export type GamePhase = "setup" | "playing" | "finished";

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  color: string;
  isHuman: boolean;
}

export interface GameState {
  gridSize: typeof GRID_SIZE;
  edges: Partial<Record<EdgeId, PlayerId>>;
  squares: Record<string, PlayerId>;
  currentPlayer: PlayerId;
  scores: Record<PlayerId, number>;
  phase: GamePhase;
  players: PlayerConfig[];
  lastMove?: EdgeId;
  extraTurnMessage?: boolean;
}

export interface MoveResult {
  state: GameState;
  claimedSquares: string[];
  extraTurn: boolean;
  invalid?: boolean;
}

export interface WinnerResult {
  winners: PlayerId[];
  scores: Record<PlayerId, number>;
  isTie: boolean;
}

export const PLAYER_COLORS: Record<PlayerId, string> = {
  0: "#c0392b",
  1: "#2980b9",
  2: "#27ae60",
  3: "#d35400",
};

export function makeEdgeId(
  orientation: "h" | "v",
  row: number,
  col: number,
): EdgeId {
  return `${orientation}:${row}:${col}`;
}

export function makeSquareKey(row: number, col: number): string {
  return `${row}:${col}`;
}
