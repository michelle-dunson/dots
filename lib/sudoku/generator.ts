import {
  BOX_SIZE,
  CLUE_COUNTS,
  GRID_SIZE,
  type CellValue,
  type Grid,
  type SudokuDifficulty,
} from "./types";

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0 as CellValue),
  );
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row] as CellValue[]);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
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

function fillGrid(grid: Grid): boolean {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (grid[row][col] !== 0) {
        continue;
      }

      for (const value of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[])) {
        if (isValidPlacement(grid, row, col, value)) {
          grid[row][col] = value;
          if (fillGrid(grid)) {
            return true;
          }
          grid[row][col] = 0;
        }
      }

      return false;
    }
  }

  return true;
}

function fillDiagonalBoxes(grid: Grid): void {
  for (let box = 0; box < GRID_SIZE; box += BOX_SIZE) {
    const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[]);
    let index = 0;

    for (let row = 0; row < BOX_SIZE; row += 1) {
      for (let col = 0; col < BOX_SIZE; col += 1) {
        grid[box + row][box + col] = values[index];
        index += 1;
      }
    }
  }
}

export function generateSolvedGrid(): Grid {
  const grid = createEmptyGrid();
  fillDiagonalBoxes(grid);
  fillGrid(grid);
  return grid;
}

function carvePuzzle(solution: Grid, clueCount: number): Grid {
  const puzzle = cloneGrid(solution);
  const positions = shuffle(
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE,
    })),
  );

  for (const { row, col } of positions) {
    const clues = puzzle.flat().filter((value) => value !== 0).length;
    if (clues <= clueCount) {
      break;
    }

    puzzle[row][col] = 0;
  }

  return puzzle;
}

export function generatePuzzle(difficulty: SudokuDifficulty): {
  puzzle: Grid;
  solution: Grid;
} {
  const solution = generateSolvedGrid();
  const puzzle = carvePuzzle(solution, CLUE_COUNTS[difficulty]);
  return { puzzle, solution };
}
