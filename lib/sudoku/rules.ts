import { cloneGrid } from "./board";
import {
  clearCellNotes,
  removeNoteFromPeers,
  toggleCellNote,
} from "./notes";
import { BOX_SIZE, GRID_SIZE, MAX_MISTAKES, type CellValue, type Grid, type SudokuPhase, type SudokuState } from "./types";

export interface MoveResult {
  state: SudokuState;
  invalid?: boolean;
}

function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  if (value === 0) {
    return true;
  }

  for (let index = 0; index < GRID_SIZE; index += 1) {
    if (grid[row][index] === value && index !== col) {
      return false;
    }
    if (grid[index][col] === value && index !== row) {
      return false;
    }
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let rowOffset = 0; rowOffset < BOX_SIZE; rowOffset += 1) {
    for (let colOffset = 0; colOffset < BOX_SIZE; colOffset += 1) {
      const checkRow = boxRow + rowOffset;
      const checkCol = boxCol + colOffset;
      if (
        grid[checkRow][checkCol] === value &&
        (checkRow !== row || checkCol !== col)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function hasConflict(
  grid: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  if (value === 0) {
    return false;
  }

  return !isValidPlacement(grid, row, col, value);
}

export function getConflicts(grid: Grid): boolean[][] {
  return grid.map((row, rowIndex) =>
    row.map((value, colIndex) => hasConflict(grid, rowIndex, colIndex, value)),
  );
}

function gridsMatch(left: Grid, right: Grid): boolean {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (left[row][col] !== right[row][col]) {
        return false;
      }
    }
  }
  return true;
}

function isComplete(state: SudokuState): boolean {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const value = state.cells[row][col];
      if (value === 0 || hasConflict(state.cells, row, col, value)) {
        return false;
      }
    }
  }

  return gridsMatch(state.cells, state.solution);
}

export function selectCell(
  state: SudokuState,
  row: number,
  col: number,
): SudokuState {
  if (state.phase !== "playing") {
    return state;
  }

  return {
    ...state,
    selected: { row, col },
  };
}

function finishGame(
  state: SudokuState,
  phase: Exclude<SudokuPhase, "playing">,
  now: number,
): SudokuState {
  return {
    ...state,
    phase,
    endedAt: now,
  };
}

export function setCell(
  state: SudokuState,
  row: number,
  col: number,
  value: CellValue,
  now = Date.now(),
): MoveResult {
  if (state.phase !== "playing") {
    return { state, invalid: true };
  }

  if (state.given[row][col]) {
    return { state, invalid: true };
  }

  if (value < 0 || value > 9) {
    return { state, invalid: true };
  }

  const previous = state.cells[row][col];
  const cells = cloneGrid(state.cells);
  cells[row][col] = value;

  let notes = clearCellNotes(state.notes, row, col);
  if (value !== 0) {
    notes = removeNoteFromPeers(notes, cells, row, col, value);
  }

  let mistakes = state.mistakes;
  if (
    value !== 0 &&
    value !== state.solution[row][col] &&
    previous !== value
  ) {
    mistakes += 1;
  }

  const nextState: SudokuState = {
    ...state,
    cells,
    notes,
    mistakes,
    selected: { row, col },
    phase: "playing",
  };

  if (isComplete(nextState)) {
    return {
      state: finishGame(nextState, "complete", now),
    };
  }

  if (mistakes >= MAX_MISTAKES) {
    return {
      state: finishGame(nextState, "failed", now),
    };
  }

  return { state: nextState };
}

export function clearCell(state: SudokuState): MoveResult {
  if (!state.selected || state.phase !== "playing") {
    return { state, invalid: true };
  }

  const { row, col } = state.selected;
  if (state.given[row][col]) {
    return { state, invalid: true };
  }

  const cells = cloneGrid(state.cells);
  cells[row][col] = 0;

  return {
    state: {
      ...state,
      cells,
      notes: clearCellNotes(state.notes, row, col),
      selected: { row, col },
    },
  };
}

export function togglePencilMark(
  state: SudokuState,
  row: number,
  col: number,
  value: CellValue,
): MoveResult {
  if (state.phase !== "playing") {
    return { state, invalid: true };
  }

  if (state.given[row][col] || state.cells[row][col] !== 0) {
    return { state, invalid: true };
  }

  if (value < 1 || value > 9) {
    return { state, invalid: true };
  }

  const notes = toggleCellNote(state.notes, state.cells, row, col, value);

  if (notes === state.notes) {
    return { state, invalid: true };
  }

  return {
    state: {
      ...state,
      notes,
      selected: { row, col },
    },
  };
}

export function eraseCell(
  state: SudokuState,
  row: number,
  col: number,
  now = Date.now(),
): MoveResult {
  return setCell(state, row, col, 0, now);
}
