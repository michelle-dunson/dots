import type { GameState } from "@/lib/game/types";
import { getTotalSquares } from "@/lib/game/rules";
import styles from "./ScoreBoard.module.scss";

interface ScoreBoardProps {
  state: GameState;
}

export function ScoreBoard({ state }: ScoreBoardProps) {
  const totalClaimed = Object.keys(state.squares).length;
  const totalSquares = getTotalSquares();

  return (
    <div className={styles.scoreboard}>
      <h2 className={styles.title}>Score</h2>
      <div
        className={`${styles.players} ${
          state.players.length === 4 ? styles.playersFour : ""
        }`}
      >
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
            <span className={styles.score}>{state.scores[player.id]}</span>
          </div>
        ))}
      </div>
      <p className={styles.total}>
        {totalClaimed} / {totalSquares} squares filled
      </p>
    </div>
  );
}
