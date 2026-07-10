import { countFilledCells, formatElapsed } from "@/lib/sudoku/board";
import { MAX_MISTAKES, type SudokuState } from "@/lib/sudoku/types";
import styles from "./SudokuStatus.module.scss";

interface SudokuStatusProps {
  state: SudokuState;
  elapsedMs: number;
}

const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

export function SudokuStatus({ state, elapsedMs }: SudokuStatusProps) {
  const filled = countFilledCells(state.cells);
  const mistakesClass =
    state.mistakes >= MAX_MISTAKES
      ? styles.mistakesMax
      : state.mistakes > 0
        ? styles.mistakesWarning
        : "";

  return (
    <div className={styles.status}>
      <h2 className={styles.title}>Sudoku</h2>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Difficulty</span>
          <span className={styles.value}>
            {DIFFICULTY_LABELS[state.difficulty]}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Time</span>
          <span className={styles.value}>{formatElapsed(elapsedMs)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Filled</span>
          <span className={styles.value}>{filled}/81</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Mistakes</span>
          <span className={`${styles.value} ${mistakesClass}`}>
            {state.mistakes}/{MAX_MISTAKES}
          </span>
        </div>
      </div>
    </div>
  );
}
