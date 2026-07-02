import { getWinner } from "@/lib/game/rules";
import type { GameState } from "@/lib/game/types";
import styles from "./GameOver.module.scss";

interface GameOverProps {
  state: GameState;
  onPlayAgain: () => void;
}

export function GameOver({ state, onPlayAgain }: GameOverProps) {
  const { winners, isTie } = getWinner(state);

  const winnerNames = winners
    .map((id) => state.players.find((p) => p.id === id)?.name)
    .filter(Boolean);

  const message = isTie
    ? "It's a tie!"
    : `${winnerNames.join(" & ")} wins!`;

  const sortedPlayers = [...state.players].sort(
    (a, b) => state.scores[b.id] - state.scores[a.id],
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Game Over</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.scores}>
          {sortedPlayers.map((player) => (
            <div
              key={player.id}
              className={`${styles.scoreRow} ${
                winners.includes(player.id) ? styles.winner : ""
              }`}
            >
              <span
                className={styles.swatch}
                style={{ backgroundColor: player.color }}
              />
              <span>
                {player.name}: {state.scores[player.id]}
              </span>
            </div>
          ))}
        </div>
        <button type="button" className={styles.playAgain} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
