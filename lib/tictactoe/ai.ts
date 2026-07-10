import { getValidMoves } from "./board";
import { applyMove, checkWinner } from "./rules";
import type { Cell, PlayerId } from "./types";

function getOpponent(player: PlayerId): PlayerId {
  return player === 0 ? 1 : 0;
}

function evaluate(board: Cell[], aiPlayer: PlayerId): number | null {
  const result = checkWinner(board);

  if (result === aiPlayer) {
    return 1;
  }
  if (result === "tie") {
    return 0;
  }
  if (result !== null) {
    return -1;
  }

  return null;
}

function minimax(
  board: Cell[],
  playerToMove: PlayerId,
  aiPlayer: PlayerId,
): number {
  const terminal = evaluate(board, aiPlayer);
  if (terminal !== null) {
    return terminal;
  }

  const moves = getValidMoves(board);
  const isAiTurn = playerToMove === aiPlayer;

  if (isAiTurn) {
    let best = -Infinity;
    for (const move of moves) {
      const next = applyMove(board, playerToMove, move);
      best = Math.max(best, minimax(next.board, next.currentPlayer, aiPlayer));
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    const next = applyMove(board, playerToMove, move);
    best = Math.min(best, minimax(next.board, next.currentPlayer, aiPlayer));
  }
  return best;
}

export function getAIMove(board: Cell[], aiPlayer: PlayerId): number | null {
  const moves = getValidMoves(board);
  if (moves.length === 0) {
    return null;
  }

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const next = applyMove(board, aiPlayer, move);
    const score = minimax(next.board, getOpponent(aiPlayer), aiPlayer);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
