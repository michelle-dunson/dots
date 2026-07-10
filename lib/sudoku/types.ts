export type SudokuDifficulty = "easy" | "medium" | "hard";
export type SudokuPhase = "playing" | "complete" | "failed";

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Grid = CellValue[][];
export type PencilMarks = boolean[][][];

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const MAX_MISTAKES = 3;

export const CLUE_COUNTS: Record<SudokuDifficulty, number> = {
  easy: 40,
  medium: 30,
  hard: 22,
};

export interface SudokuState {
  difficulty: SudokuDifficulty;
  puzzle: Grid;
  solution: Grid;
  cells: Grid;
  notes: PencilMarks;
  given: boolean[][];
  selected: { row: number; col: number } | null;
  phase: SudokuPhase;
  mistakes: number;
  startedAt: number;
  endedAt: number | null;
}

export interface SessionConfig {
  difficulty: SudokuDifficulty;
}
