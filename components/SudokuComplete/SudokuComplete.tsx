import { formatElapsed } from "@/lib/sudoku/board";
import { MAX_MISTAKES, type SudokuState } from "@/lib/sudoku/types";
import styles from "./SudokuComplete.module.scss";

interface SudokuCompleteProps {
  state: SudokuState;
  elapsedMs: number;
  onPlayAgain: () => void;
}

export function SudokuComplete({
  state,
  elapsedMs,
  onPlayAgain,
}: SudokuCompleteProps) {
  const isFailed = state.phase === "failed";

  let title = "Puzzle Complete!";
  let message = "";

  if (isFailed) {
    title = "Game Over";
    message = `${MAX_MISTAKES} mistakes — puzzle ended in ${formatElapsed(elapsedMs)}.`;
  } else if (state.mistakes === 0) {
    message = `Perfect solve in ${formatElapsed(elapsedMs)}.`;
  } else {
    message = `Solved in ${formatElapsed(elapsedMs)} with ${state.mistakes} mistake${state.mistakes === 1 ? "" : "s"}.`;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button type="button" className={styles.playAgain} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
