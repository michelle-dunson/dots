import { generatePuzzle } from "./generator";
import { createEmptyNotes } from "./notes";
import {
  GRID_SIZE,
  type Grid,
  type SessionConfig,
  type SudokuState,
} from "./types";

function createGivenMask(puzzle: Grid): boolean[][] {
  return puzzle.map((row) => row.map((cell) => cell !== 0));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function createInitialState(
  config: SessionConfig,
  now = Date.now(),
): SudokuState {
  const { puzzle, solution } = generatePuzzle(config.difficulty);

  return {
    difficulty: config.difficulty,
    puzzle,
    solution,
    cells: cloneGrid(puzzle),
    notes: createEmptyNotes(),
    given: createGivenMask(puzzle),
    selected: null,
    phase: "playing",
    mistakes: 0,
    startedAt: now,
    endedAt: null,
  };
}

export function getElapsedMs(state: SudokuState, now = Date.now()): number {
  if (state.endedAt !== null) {
    return state.endedAt - state.startedAt;
  }

  return now - state.startedAt;
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getCellValue(state: SudokuState, row: number, col: number): number {
  return state.cells[row][col];
}

export function isGivenCell(state: SudokuState, row: number, col: number): boolean {
  return state.given[row][col];
}

export function countFilledCells(cells: Grid): number {
  let count = 0;
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (cells[row][col] !== 0) {
        count += 1;
      }
    }
  }
  return count;
}
