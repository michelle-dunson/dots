import { BOX_SIZE, GRID_SIZE, type CellValue, type Grid, type PencilMarks } from "./types";

export function createEmptyNotes(): PencilMarks {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => false),
    ),
  );
}

export function cloneNotes(notes: PencilMarks): PencilMarks {
  return notes.map((row) => row.map((cell) => [...cell]));
}

export function clearCellNotes(
  notes: PencilMarks,
  row: number,
  col: number,
): PencilMarks {
  const next = cloneNotes(notes);
  next[row][col] = Array.from({ length: GRID_SIZE }, () => false);
  return next;
}

export function getCellNotes(
  notes: PencilMarks,
  row: number,
  col: number,
): CellValue[] {
  return notes[row][col]
    .map((active, index) => (active ? ((index + 1) as CellValue) : null))
    .filter((value): value is CellValue => value !== null);
}

export function isNoteActive(
  notes: PencilMarks,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  if (value === 0) {
    return false;
  }

  return notes[row][col][value - 1];
}

export function valueExistsInPeers(
  cells: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  for (let index = 0; index < GRID_SIZE; index += 1) {
    if (cells[row][index] === value) {
      return true;
    }
    if (cells[index][col] === value) {
      return true;
    }
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let rowOffset = 0; rowOffset < BOX_SIZE; rowOffset += 1) {
    for (let colOffset = 0; colOffset < BOX_SIZE; colOffset += 1) {
      if (cells[boxRow + rowOffset][boxCol + colOffset] === value) {
        return true;
      }
    }
  }

  return false;
}

export function removeNoteFromPeers(
  notes: PencilMarks,
  cells: Grid,
  row: number,
  col: number,
  value: CellValue,
): PencilMarks {
  if (value === 0) {
    return notes;
  }

  const next = cloneNotes(notes);
  const digitIndex = value - 1;

  for (let colIndex = 0; colIndex < GRID_SIZE; colIndex += 1) {
    if (cells[row][colIndex] === 0) {
      next[row][colIndex][digitIndex] = false;
    }
  }

  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex += 1) {
    if (cells[rowIndex][col] === 0) {
      next[rowIndex][col][digitIndex] = false;
    }
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let rowOffset = 0; rowOffset < BOX_SIZE; rowOffset += 1) {
    for (let colOffset = 0; colOffset < BOX_SIZE; colOffset += 1) {
      const peerRow = boxRow + rowOffset;
      const peerCol = boxCol + colOffset;
      if (cells[peerRow][peerCol] === 0) {
        next[peerRow][peerCol][digitIndex] = false;
      }
    }
  }

  return next;
}

export function toggleCellNote(
  notes: PencilMarks,
  cells: Grid,
  row: number,
  col: number,
  value: CellValue,
): PencilMarks {
  if (value === 0 || cells[row][col] !== 0) {
    return notes;
  }

  const next = cloneNotes(notes);
  const digitIndex = value - 1;
  const isActive = next[row][col][digitIndex];

  if (isActive) {
    next[row][col][digitIndex] = false;
    return next;
  }

  if (valueExistsInPeers(cells, row, col, value)) {
    return notes;
  }

  next[row][col][digitIndex] = true;
  return next;
}
