import type { Cell, GameResult, PlayerId } from "./types";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Cell[]): GameResult {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "tie";
  }

  return null;
}

export function getNextPlayer(current: PlayerId): PlayerId {
  return current === 0 ? 1 : 0;
}

export interface MoveResult {
  board: Cell[];
  currentPlayer: PlayerId;
  phase: "playing" | "finished";
  result: GameResult;
  invalid?: boolean;
}

export function applyMove(
  board: Cell[],
  currentPlayer: PlayerId,
  cellIndex: number,
): MoveResult {
  if (board[cellIndex] !== null) {
    return {
      board,
      currentPlayer,
      phase: "playing",
      result: null,
      invalid: true,
    };
  }

  const nextBoard = [...board];
  nextBoard[cellIndex] = currentPlayer;
  const result = checkWinner(nextBoard);

  if (result !== null) {
    return {
      board: nextBoard,
      currentPlayer,
      phase: "finished",
      result,
    };
  }

  return {
    board: nextBoard,
    currentPlayer: getNextPlayer(currentPlayer),
    phase: "playing",
    result: null,
  };
}

export function isBoardFull(board: Cell[]): boolean {
  return board.every((cell) => cell !== null);
}

export function getWinningLine(board: Cell[]): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return line;
    }
  }
  return null;
}
