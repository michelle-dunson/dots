import type { TicTacToeState } from "@/lib/tictactoe/types";
import styles from "./TicTacToeStatus.module.scss";

interface TicTacToeStatusProps {
  state: TicTacToeState;
}

export function TicTacToeStatus({ state }: TicTacToeStatusProps) {
  return (
    <div className={styles.status}>
      <h2 className={styles.title}>Players</h2>
      <div className={styles.players}>
        {state.players.map((player) => (
          <div
            key={player.id}
            className={`${styles.player} ${
              state.currentPlayer === player.id && state.phase === "playing"
                ? styles.active
                : ""
            }`}
          >
            <span
              className={styles.swatch}
              style={{ backgroundColor: player.color }}
            />
            <span className={styles.name}>{player.name}</span>
            <span className={styles.mark} style={{ color: player.color }}>
              {player.mark}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
