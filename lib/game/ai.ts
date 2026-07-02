import {
  countOpenEdges,
  getValidEdges,
  parseSquareKey,
} from "./board";
import {
  applyMove,
  isSafeMove,
  wouldCompleteSquare,
} from "./rules";
import type { EdgeId, GameState } from "./types";
import { GRID_SIZE } from "./types";

interface ChainInfo {
  squares: string[];
  length: number;
}

export function getAIMove(state: GameState): EdgeId | null {
  const validEdges = getValidEdges(state);
  if (validEdges.length === 0) {
    return null;
  }

  const winningMoves = validEdges.filter((edge) =>
    wouldCompleteSquare(state, edge),
  );
  if (winningMoves.length > 0) {
    return pickBestWinningMove(state, winningMoves);
  }

  const safeMoves = validEdges.filter((edge) => isSafeMove(state, edge));
  if (safeMoves.length > 0) {
    return pickBestSafeMove(state, safeMoves);
  }

  return pickChainBreakingMove(state, validEdges);
}

function pickBestWinningMove(
  state: GameState,
  moves: EdgeId[],
): EdgeId {
  let best = moves[0];
  let bestScore = -1;

  for (const move of moves) {
    const result = applyMove(state, move);
    const score = result.claimedSquares.length;
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }

  return best;
}

function pickBestSafeMove(state: GameState, moves: EdgeId[]): EdgeId {
  const scored = moves.map((move) => ({
    move,
    danger: getDangerScore(state, move),
  }));

  scored.sort((a, b) => a.danger - b.danger);
  const minDanger = scored[0].danger;
  const candidates = scored.filter((item) => item.danger === minDanger);
  return candidates[Math.floor(Math.random() * candidates.length)].move;
}

function getDangerScore(state: GameState, edgeId: EdgeId): number {
  let score = 0;

  for (const squareKey of getAdjacentSquareKeys(edgeId)) {
    if (state.squares[squareKey] !== undefined) {
      continue;
    }
    const open = countOpenEdges(squareKey, state.edges);
    score += 4 - open;
  }

  return score;
}

function pickChainBreakingMove(
  state: GameState,
  moves: EdgeId[],
): EdgeId {
  const chains = findChains(state);

  if (chains.length > 0) {
    chains.sort((a, b) => a.length - b.length);
    const shortest = chains[0];

    if (shortest.length >= 4) {
      const doubleCrossMove = findDoubleCrossMove(state, shortest, moves);
      if (doubleCrossMove) {
        return doubleCrossMove;
      }
    }

    const chainMove = findMoveOpeningChain(shortest, moves);
    if (chainMove) {
      return chainMove;
    }
  }

  return moves[Math.floor(Math.random() * moves.length)];
}

function findChains(state: GameState): ChainInfo[] {
  const squareSize = GRID_SIZE - 1;
  const visited = new Set<string>();
  const chains: ChainInfo[] = [];

  for (let row = 0; row < squareSize; row++) {
    for (let col = 0; col < squareSize; col++) {
      const key = `${row}:${col}`;
      if (visited.has(key) || state.squares[key] !== undefined) {
        continue;
      }

      const open = countOpenEdges(key, state.edges);
      if (open !== 2 && open !== 1) {
        continue;
      }

      const chainSquares = collectChain(state, key, visited);
      if (chainSquares.length >= 2) {
        chains.push({ squares: chainSquares, length: chainSquares.length });
      }
    }
  }

  return chains;
}

function collectChain(
  state: GameState,
  startKey: string,
  globalVisited: Set<string>,
): string[] {
  const chain: string[] = [];
  const queue = [startKey];
  const localVisited = new Set<string>();

  while (queue.length > 0) {
    const key = queue.shift()!;
    if (localVisited.has(key) || state.squares[key] !== undefined) {
      continue;
    }

    const open = countOpenEdges(key, state.edges);
    if (open > 2) {
      continue;
    }

    localVisited.add(key);
    globalVisited.add(key);
    chain.push(key);

    for (const neighbor of getSquareNeighbors(key)) {
      if (!localVisited.has(neighbor) && isChainNeighbor(state, key, neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return chain;
}

function isChainNeighbor(
  state: GameState,
  a: string,
  b: string,
): boolean {
  if (state.squares[b] !== undefined) {
    return false;
  }

  const openA = countOpenEdges(a, state.edges);
  const openB = countOpenEdges(b, state.edges);

  return openA <= 2 && openB <= 2;
}

function getSquareNeighbors(squareKey: string): string[] {
  const { row, col } = parseSquareKey(squareKey);
  const neighbors: string[] = [];
  const max = GRID_SIZE - 2;

  if (row > 0) neighbors.push(`${row - 1}:${col}`);
  if (row < max) neighbors.push(`${row + 1}:${col}`);
  if (col > 0) neighbors.push(`${row}:${col - 1}`);
  if (col < max) neighbors.push(`${row}:${col + 1}`);

  return neighbors;
}

function findMoveOpeningChain(
  chain: ChainInfo,
  moves: EdgeId[],
): EdgeId | null {
  const chainSet = new Set(chain.squares);

  for (const move of moves) {
    for (const squareKey of getAdjacentSquareKeys(move)) {
      if (chainSet.has(squareKey)) {
        return move;
      }
    }
  }

  return null;
}

function findDoubleCrossMove(
  state: GameState,
  chain: ChainInfo,
  moves: EdgeId[],
): EdgeId | null {
  const endSquare = chain.squares[0];
  const { row, col } = parseSquareKey(endSquare);

  for (const move of moves) {
    const adjacent = getAdjacentSquareKeys(move);
    if (!adjacent.includes(endSquare)) {
      continue;
    }

    const result = applyMove(state, move);
    if (result.claimedSquares.length > 0) {
      return move;
    }

    const open = countOpenEdges(endSquare, state.edges);
    if (open === 2 && (row === 0 || col === 0)) {
      return move;
    }
  }

  return null;
}

function getAdjacentSquareKeys(edgeId: EdgeId): string[] {
  const [orientation, rowStr, colStr] = edgeId.split(":");
  const row = Number(rowStr);
  const col = Number(colStr);
  const squares: string[] = [];

  if (orientation === "h") {
    if (row > 0) squares.push(`${row - 1}:${col}`);
    if (row < GRID_SIZE - 1) squares.push(`${row}:${col}`);
  } else {
    if (col > 0) squares.push(`${row}:${col - 1}`);
    if (col < GRID_SIZE - 1) squares.push(`${row}:${col}`);
  }

  return squares;
}
