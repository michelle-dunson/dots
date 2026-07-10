import type { TicTacToeState } from "@/lib/tictactoe/types";
import styles from "./TicTacToeGameOver.module.scss";

interface TicTacToeGameOverProps {
  state: TicTacToeState;
  onPlayAgain: () => void;
}

export function TicTacToeGameOver({ state, onPlayAgain }: TicTacToeGameOverProps) {
  let message = "It's a tie!";

  if (state.result !== null && state.result !== "tie") {
    const winner = state.players.find((player) => player.id === state.result);
    message = `${winner?.name} wins!`;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Game Over</h2>
        <p className={styles.message}>{message}</p>
        <button type="button" className={styles.playAgain} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
