import { getRoundMessage } from "@/lib/hangman/rules";
import type { HangmanState } from "@/lib/hangman/types";
import styles from "./HangmanRoundOver.module.scss";

interface HangmanRoundOverProps {
  state: HangmanState;
  onNextRound: () => void;
}

export function HangmanRoundOver({ state, onNextRound }: HangmanRoundOverProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Round Over</h2>
        <p className={styles.message}>{getRoundMessage(state)}</p>
        <p className={styles.wordReveal}>{state.word.toUpperCase()}</p>
        <button type="button" className={styles.playAgain} onClick={onNextRound}>
          {state.mode === "solo" ? "Play Again" : "Next Round"}
        </button>
      </div>
    </div>
  );
}
