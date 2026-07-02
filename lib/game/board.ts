import {
  GRID_SIZE,
  SQUARE_COUNT,
  type EdgeId,
  type GameState,
  type PlayerConfig,
  type PlayerId,
  PLAYER_COLORS,
  makeEdgeId,
  makeSquareKey,
} from "./types";

export function createPlayers(
  count: number,
  names: string[],
): PlayerConfig[] {
  const players: PlayerConfig[] = [];

  if (count === 1) {
    players.push({
      id: 0,
      name: names[0] || "You",
      color: PLAYER_COLORS[0],
      isHuman: true,
    });
    players.push({
      id: 1,
      name: "Computer",
      color: PLAYER_COLORS[1],
      isHuman: false,
    });
    return players;
  }

  for (let i = 0; i < count; i++) {
    players.push({
      id: i as PlayerId,
      name: names[i] || `Player ${i + 1}`,
      color: PLAYER_COLORS[i as PlayerId],
      isHuman: true,
    });
  }

  return players;
}

export function createInitialState(players: PlayerConfig[]): GameState {
  const scores = {} as Record<PlayerId, number>;
  for (const player of players) {
    scores[player.id] = 0;
  }

  return {
    gridSize: GRID_SIZE,
    edges: {},
    squares: {},
    currentPlayer: players[0].id,
    scores,
    phase: "playing",
    players,
  };
}

export function getAllEdges(): EdgeId[] {
  const edges: EdgeId[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 1; col++) {
      edges.push(makeEdgeId("h", row, col));
    }
  }

  for (let row = 0; row < GRID_SIZE - 1; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      edges.push(makeEdgeId("v", row, col));
    }
  }

  return edges;
}

export function getValidEdges(state: GameState): EdgeId[] {
  return getAllEdges().filter((edgeId) => state.edges[edgeId] === undefined);
}

export function getSquareEdges(row: number, col: number): EdgeId[] {
  return [
    makeEdgeId("h", row, col),
    makeEdgeId("h", row + 1, col),
    makeEdgeId("v", row, col),
    makeEdgeId("v", row, col + 1),
  ];
}

export function getAdjacentSquares(edgeId: EdgeId): string[] {
  const [orientation, rowStr, colStr] = edgeId.split(":");
  const row = Number(rowStr);
  const col = Number(colStr);
  const squares: string[] = [];

  if (orientation === "h") {
    if (row > 0) {
      squares.push(makeSquareKey(row - 1, col));
    }
    if (row < GRID_SIZE - 1) {
      squares.push(makeSquareKey(row, col));
    }
  } else {
    if (col > 0) {
      squares.push(makeSquareKey(row, col - 1));
    }
    if (col < GRID_SIZE - 1) {
      squares.push(makeSquareKey(row, col));
    }
  }

  return squares;
}

export function countOpenEdges(
  squareKey: string,
  edges: Partial<Record<EdgeId, PlayerId>>,
): number {
  const [rowStr, colStr] = squareKey.split(":");
  const row = Number(rowStr);
  const col = Number(colStr);
  const squareEdges = getSquareEdges(row, col);

  return squareEdges.filter((edgeId) => edges[edgeId] === undefined).length;
}

export function isSquareComplete(
  squareKey: string,
  edges: Partial<Record<EdgeId, PlayerId>>,
): boolean {
  return countOpenEdges(squareKey, edges) === 0;
}

export function getClaimedSquareCount(state: GameState): number {
  return Object.keys(state.squares).length;
}

export function isGameOver(state: GameState): boolean {
  return getClaimedSquareCount(state) >= SQUARE_COUNT;
}

export function parseSquareKey(squareKey: string): { row: number; col: number } {
  const [rowStr, colStr] = squareKey.split(":");
  return { row: Number(rowStr), col: Number(colStr) };
}
