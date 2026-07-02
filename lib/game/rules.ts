import {
  getAdjacentSquares,
  getClaimedSquareCount,
  isSquareComplete,
} from "./board";
import type {
  EdgeId,
  GameState,
  MoveResult,
  WinnerResult,
} from "./types";
import { SQUARE_COUNT } from "./types";

export function applyMove(state: GameState, edgeId: EdgeId): MoveResult {
  if (state.phase !== "playing") {
    return { state, claimedSquares: [], extraTurn: false, invalid: true };
  }

  if (state.edges[edgeId] !== undefined) {
    return { state, claimedSquares: [], extraTurn: false, invalid: true };
  }

  const newEdges = { ...state.edges, [edgeId]: state.currentPlayer };
  const claimedSquares: string[] = [];
  const newSquares = { ...state.squares };
  const newScores = { ...state.scores };

  for (const squareKey of getAdjacentSquares(edgeId)) {
    if (newSquares[squareKey] !== undefined) {
      continue;
    }

    if (isSquareComplete(squareKey, newEdges)) {
      newSquares[squareKey] = state.currentPlayer;
      newScores[state.currentPlayer] += 1;
      claimedSquares.push(squareKey);
    }
  }

  const extraTurn = claimedSquares.length > 0;
  const playerIds = state.players.map((player) => player.id);
  const currentIndex = playerIds.indexOf(state.currentPlayer);
  const nextPlayer = extraTurn
    ? state.currentPlayer
    : playerIds[(currentIndex + 1) % playerIds.length];

  const newState: GameState = {
    ...state,
    edges: newEdges,
    squares: newSquares,
    scores: newScores,
    currentPlayer: nextPlayer,
    lastMove: edgeId,
    extraTurnMessage: extraTurn,
    phase: getClaimedSquareCount({ ...state, squares: newSquares }) >= SQUARE_COUNT
      ? "finished"
      : "playing",
  };

  return {
    state: newState,
    claimedSquares,
    extraTurn,
  };
}

export function getWinner(state: GameState): WinnerResult {
  const playerIds = state.players.map((player) => player.id);
  const scores = { ...state.scores };

  let maxScore = -1;
  for (const id of playerIds) {
    if (scores[id] > maxScore) {
      maxScore = scores[id];
    }
  }

  const winners = playerIds.filter((id) => scores[id] === maxScore);

  return {
    winners,
    scores,
    isTie: winners.length > 1,
  };
}

export function wouldCompleteSquare(
  state: GameState,
  edgeId: EdgeId,
): boolean {
  for (const squareKey of getAdjacentSquares(edgeId)) {
    if (state.squares[squareKey] !== undefined) {
      continue;
    }

    const openBefore = countOpenEdgesForMove(state, squareKey);
    if (openBefore === 1) {
      return true;
    }
  }

  return false;
}

export function isSafeMove(state: GameState, edgeId: EdgeId): boolean {
  for (const squareKey of getAdjacentSquares(edgeId)) {
    if (state.squares[squareKey] !== undefined) {
      continue;
    }

    const openBefore = countOpenEdgesForMove(state, squareKey);
    if (openBefore === 2) {
      return false;
    }
  }

  return true;
}

function countOpenEdgesForMove(state: GameState, squareKey: string): number {
  const [rowStr, colStr] = squareKey.split(":");
  const row = Number(rowStr);
  const col = Number(colStr);

  const squareEdges = [
    `h:${row}:${col}`,
    `h:${row + 1}:${col}`,
    `v:${row}:${col}`,
    `v:${row}:${col + 1}`,
  ] as EdgeId[];

  return squareEdges.filter((id) => state.edges[id] === undefined).length;
}

export function getTotalSquares(): number {
  return SQUARE_COUNT;
}
