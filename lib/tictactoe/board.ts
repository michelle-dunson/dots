import {
  BOARD_SIZE,
  PLAYER_COLORS,
  type Cell,
  type PlayerConfig,
  type PlayerId,
  type TicTacToeState,
} from "./types";

export function createPlayers(
  vsComputer: boolean,
  names: string[],
): PlayerConfig[] {
  if (vsComputer) {
    return [
      {
        id: 0,
        name: names[0] || "You",
        color: PLAYER_COLORS[0],
        mark: "X",
        isHuman: true,
      },
      {
        id: 1,
        name: "Computer",
        color: PLAYER_COLORS[1],
        mark: "O",
        isHuman: false,
      },
    ];
  }

  return [
    {
      id: 0,
      name: names[0] || "Player 1",
      color: PLAYER_COLORS[0],
      mark: "X",
      isHuman: true,
    },
    {
      id: 1,
      name: names[1] || "Player 2",
      color: PLAYER_COLORS[1],
      mark: "O",
      isHuman: true,
    },
  ];
}

export function createInitialState(players: PlayerConfig[]): TicTacToeState {
  return {
    board: Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => null),
    currentPlayer: 0,
    players,
    phase: "playing",
    result: null,
  };
}

export function getValidMoves(board: Cell[]): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}

export function cellToRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}

export function rowColToCell(row: number, col: number): number {
  return row * BOARD_SIZE + col;
}

export function getPlayerById(
  state: TicTacToeState,
  playerId: PlayerId,
): PlayerConfig | undefined {
  return state.players.find((player) => player.id === playerId);
}
