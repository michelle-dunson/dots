import { describe, expect, it } from "vitest";
import { createInitialState } from "./board";
import { generatePuzzle, generateSolvedGrid } from "./generator";
import { clearCell, getConflicts, selectCell, setCell, togglePencilMark } from "./rules";
import { isNoteActive, valueExistsInPeers } from "./notes";
import { CLUE_COUNTS, GRID_SIZE, MAX_MISTAKES } from "./types";

describe("sudoku generator", () => {
  it("creates a fully solved valid grid", () => {
    const grid = generateSolvedGrid();

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        expect(grid[row][col]).toBeGreaterThan(0);
      }
    }

    expect(getConflicts(grid).flat().some(Boolean)).toBe(false);
  });

  it("creates puzzles with the expected clue counts", () => {
    const { puzzle } = generatePuzzle("medium");
    const clues = puzzle.flat().filter((value) => value !== 0).length;
    expect(clues).toBe(CLUE_COUNTS.medium);
  });
});

describe("sudoku rules", () => {
  it("prevents editing given cells", () => {
    const state = createInitialState({ difficulty: "easy" });
    const givenCell = state.given.findIndex((row) => row.some(Boolean));
    const col = state.given[givenCell].findIndex(Boolean);
    const result = setCell(state, givenCell, col, 5);

    expect(result.invalid).toBe(true);
    expect(result.state.cells[givenCell][col]).toBe(state.puzzle[givenCell][col]);
  });

  it("tracks mistakes for incorrect entries", () => {
    const state = createInitialState({ difficulty: "easy" });
    let emptyRow = 0;
    let emptyCol = 0;

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        if (!state.given[row][col]) {
          emptyRow = row;
          emptyCol = col;
          break;
        }
      }
    }

    const wrongValue = state.solution[emptyRow][emptyCol] === 1 ? 2 : 1;
    const result = setCell(state, emptyRow, emptyCol, wrongValue);

    expect(result.state.mistakes).toBe(1);
    expect(result.state.cells[emptyRow][emptyCol]).toBe(wrongValue);
  });

  it("completes the puzzle when solved correctly", () => {
    const state = createInitialState({ difficulty: "easy" });
    let next = state;

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        if (!next.given[row][col]) {
          next = setCell(next, row, col, next.solution[row][col]).state;
        }
      }
    }

    expect(next.phase).toBe("complete");
  });

  it("clears the selected cell", () => {
    let state = createInitialState({ difficulty: "easy" });
    let emptyRow = 0;
    let emptyCol = 0;

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        if (!state.given[row][col]) {
          emptyRow = row;
          emptyCol = col;
          break;
        }
      }
    }

    state = selectCell(state, emptyRow, emptyCol);
    state = setCell(state, emptyRow, emptyCol, state.solution[emptyRow][emptyCol]).state;
    state = clearCell(state).state;

    expect(state.cells[emptyRow][emptyCol]).toBe(0);
  });

  it("toggles pencil marks in empty cells", () => {
    const state = createInitialState({ difficulty: "easy" });
    let emptyRow = 0;
    let emptyCol = 0;
    let noteValue = 1 as const;

    outer: for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        if (state.given[row][col]) {
          continue;
        }

        for (let value = 1; value <= 9; value += 1) {
          if (!valueExistsInPeers(state.cells, row, col, value)) {
            emptyRow = row;
            emptyCol = col;
            noteValue = value;
            break outer;
          }
        }
      }
    }

    let next = togglePencilMark(state, emptyRow, emptyCol, noteValue).state;
    expect(isNoteActive(next.notes, emptyRow, emptyCol, noteValue)).toBe(true);

    next = togglePencilMark(next, emptyRow, emptyCol, noteValue).state;
    expect(isNoteActive(next.notes, emptyRow, emptyCol, noteValue)).toBe(false);
  });

  it("removes pencil marks from peers when a guess is placed", () => {
    let state = createInitialState({ difficulty: "easy" });
    let row = -1;
    let colA = -1;
    let colB = -1;
    let noteValue = 1 as const;

    outer: for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex += 1) {
      const emptyCols: number[] = [];
      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex += 1) {
        if (!state.given[rowIndex][colIndex]) {
          emptyCols.push(colIndex);
        }
      }
      if (emptyCols.length < 2) {
        continue;
      }

      for (const candidateCol of emptyCols.slice(1)) {
        for (let value = 1; value <= 9; value += 1) {
          if (!valueExistsInPeers(state.cells, rowIndex, candidateCol, value)) {
            row = rowIndex;
            colA = emptyCols[0];
            colB = candidateCol;
            noteValue = value;
            break outer;
          }
        }
      }
    }

    expect(row).toBeGreaterThanOrEqual(0);

    state = togglePencilMark(state, row, colB, noteValue).state;
    expect(isNoteActive(state.notes, row, colB, noteValue)).toBe(true);

    state = setCell(state, row, colA, noteValue).state;
    expect(isNoteActive(state.notes, row, colB, noteValue)).toBe(false);
  });

  it("ends the game after three mistakes", () => {
    const startedAt = 1_000;
    let state = createInitialState({ difficulty: "easy" }, startedAt);
    const emptyCells: Array<{ row: number; col: number }> = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        if (!state.given[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }

    for (let index = 0; index < MAX_MISTAKES; index += 1) {
      const { row, col } = emptyCells[index];
      const wrongValue = state.solution[row][col] === 1 ? 2 : 1;
      state = setCell(state, row, col, wrongValue, startedAt + (index + 1) * 1000).state;
    }

    expect(state.mistakes).toBe(MAX_MISTAKES);
    expect(state.phase).toBe("failed");
    expect(state.endedAt).toBe(startedAt + MAX_MISTAKES * 1000);
  });
});
