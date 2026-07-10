"use client";

import { useState } from "react";
import { isNoteActive } from "@/lib/sudoku/notes";
import { getConflicts } from "@/lib/sudoku/rules";
import type { CellValue, SudokuState } from "@/lib/sudoku/types";
import styles from "./SudokuBoard.module.scss";

interface SudokuBoardProps {
  state: SudokuState;
  onSelect: (row: number, col: number) => void;
  onSetValue: (row: number, col: number, value: CellValue) => void;
  onToggleNote: (row: number, col: number, value: CellValue) => void;
  onClear: () => void;
}

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function SudokuBoard({
  state,
  onSelect,
  onSetValue,
  onToggleNote,
  onClear,
}: SudokuBoardProps) {
  const [pencilMode, setPencilMode] = useState(false);
  const conflicts = getConflicts(state.cells);
  const isPlaying = state.phase === "playing";

  const handleNumber = (value: CellValue) => {
    if (!state.selected || !isPlaying) {
      return;
    }

    const { row, col } = state.selected;
    if (state.given[row][col]) {
      return;
    }

    if (pencilMode) {
      onToggleNote(row, col, value);
      return;
    }

    onSetValue(row, col, value);
  };

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board} role="grid" aria-label="Sudoku board">
        {state.cells.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isGiven = state.given[rowIndex][colIndex];
            const isSelected =
              state.selected?.row === rowIndex &&
              state.selected?.col === colIndex;
            const isConflict = conflicts[rowIndex][colIndex];
            const boxIndex =
              Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
            const isAltBox = boxIndex % 2 === 0;
            const showNotes = value === 0;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                className={[
                  styles.cell,
                  isGiven ? styles.given : styles.editable,
                  isSelected ? styles.selected : "",
                  isConflict ? styles.conflict : "",
                  isAltBox ? styles.altBox : "",
                  colIndex % 3 === 2 && colIndex < 8 ? styles.boxRight : "",
                  rowIndex % 3 === 2 && rowIndex < 8 ? styles.boxBottom : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelect(rowIndex, colIndex)}
                disabled={!isPlaying}
                aria-pressed={isSelected}
              >
                {showNotes ? (
                  <span className={styles.notes} aria-hidden="true">
                    {NUMBERS.map((note) => (
                      <span
                        key={note}
                        className={`${styles.note} ${
                          isNoteActive(state.notes, rowIndex, colIndex, note)
                            ? styles.noteActive
                            : ""
                        }`}
                      >
                        {isNoteActive(state.notes, rowIndex, colIndex, note)
                          ? note
                          : ""}
                      </span>
                    ))}
                  </span>
                ) : (
                  value
                )}
              </button>
            );
          }),
        )}
      </div>

      <div className={styles.numberPad}>
        {NUMBERS.map((number) => (
          <button
            key={number}
            type="button"
            className={styles.numberButton}
            onClick={() => handleNumber(number)}
            disabled={!isPlaying || !state.selected}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.pencilButton} ${
            pencilMode ? styles.pencilOn : styles.pencilOff
          }`}
          onClick={() => setPencilMode((active) => !active)}
          disabled={!isPlaying}
          aria-pressed={pencilMode}
          aria-label={`Pencil mode ${pencilMode ? "on" : "off"}`}
        >
          <span className={styles.pencilContent}>
            <svg
              className={styles.pencilIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g transform="rotate(-45 12 12)">
                <rect
                  x="9.25"
                  y="3.5"
                  width="5.5"
                  height="3.25"
                  rx="0.75"
                  fill="currentColor"
                  opacity="0.32"
                />
                <rect
                  x="9.25"
                  y="6.75"
                  width="5.5"
                  height="1.5"
                  fill="currentColor"
                  opacity="0.55"
                />
                <rect
                  x="9.25"
                  y="8.25"
                  width="5.5"
                  height="11.25"
                  rx="0.4"
                  fill="currentColor"
                  opacity="0.12"
                  stroke="currentColor"
                  strokeWidth="1.35"
                />
                <path
                  d="M9.25 19.5 L12 23.25 L14.75 19.5 Z"
                  fill="currentColor"
                  opacity="0.12"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.35 21.35 L12 23.25 L12.65 21.35 Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <span
              className={`${styles.pencilLabel} ${
                pencilMode ? styles.pencilLabelOn : styles.pencilLabelOff
              }`}
            >
              {pencilMode ? "On" : "Off"}
            </span>
          </span>
        </button>
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          disabled={!isPlaying || !state.selected}
        >
          Erase
        </button>
      </div>
    </div>
  );
}
