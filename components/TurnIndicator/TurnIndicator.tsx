import type { PlayerConfig } from "@/lib/game/types";
import styles from "./TurnIndicator.module.scss";

interface TurnIndicatorProps {
  currentPlayer: PlayerConfig | null | undefined;
  phase: string;
  extraTurnMessage?: boolean;
  isAiThinking: boolean;
}

export function TurnIndicator({
  currentPlayer,
  phase,
  extraTurnMessage,
  isAiThinking,
}: TurnIndicatorProps) {
  if (phase === "finished") {
    return null;
  }

  if (extraTurnMessage) {
    return (
      <div className={styles.indicator}>
        <span className={styles.extraTurn}>Extra turn!</span>
      </div>
    );
  }

  if (!currentPlayer) {
    return null;
  }

  return (
    <div className={styles.indicator}>
      <span
        className={styles.swatch}
        style={{ backgroundColor: currentPlayer.color }}
      />
      <span className={styles.turnText}>
        {isAiThinking
          ? "Computer is thinking…"
          : `${currentPlayer.name}'s turn`}
      </span>
    </div>
  );
}
