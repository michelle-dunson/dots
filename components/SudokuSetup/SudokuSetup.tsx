"use client";

import { useState } from "react";
import type { SudokuDifficulty } from "@/lib/sudoku/types";
import styles from "../GameSetup/GameSetup.module.scss";

interface SudokuSetupProps {
  onStart: (config: { difficulty: SudokuDifficulty }) => void;
  onBack: () => void;
}

const DIFFICULTY_LABELS: Record<SudokuDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const DIFFICULTY_HINTS: Record<SudokuDifficulty, string> = {
  easy: "More starting numbers",
  medium: "Balanced challenge",
  hard: "Fewer clues",
};

export function SudokuSetup({ onStart, onBack }: SudokuSetupProps) {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("medium");

  return (
    <div className={styles.setup}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Sudoku</h1>
      </div>
      <p className={styles.subtitle}>
        Fill the grid so every row, column, and 3×3 box has digits 1–9.
      </p>

      <div className={styles.section}>
        <span className={styles.label}>Difficulty</span>
        <div className={styles.playerCount}>
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              type="button"
              className={`${styles.countButton} ${
                difficulty === level ? styles.active : ""
              }`}
              onClick={() => setDifficulty(level)}
            >
              {DIFFICULTY_LABELS[level]}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{DIFFICULTY_HINTS[difficulty]}</p>
      </div>

      <button
        type="button"
        className={styles.startButton}
        onClick={() => onStart({ difficulty })}
      >
        Start Puzzle
      </button>

      <button type="button" className={styles.backButton} onClick={onBack}>
        ← All Games
      </button>

      <p className={styles.hint}>Single player · 9×9 grid</p>
    </div>
  );
}
