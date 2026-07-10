import { getPlayer } from "@/lib/hangman/board";
import type { HangmanState } from "@/lib/hangman/types";
import styles from "./HangmanScoreboard.module.scss";

interface HangmanScoreboardProps {
  state: HangmanState;
}

export function HangmanScoreboard({ state }: HangmanScoreboardProps) {
  const setter = getPlayer(state, state.setterId);
  const guesser = getPlayer(state, state.guesserId);

  let roleText = "";
  if (state.phase === "enter-word" && setter) {
    roleText = `${setter.name} is choosing a word`;
  } else if (state.phase === "guessing" && guesser) {
    roleText = `${guesser.name} is guessing`;
  }

  return (
    <div className={styles.scoreboard}>
      <h2 className={styles.title}>
        {state.mode === "solo" ? "Hangman" : "Score"}
      </h2>

      {state.mode === "versus" ? (
        <>
          <div className={styles.players}>
            {state.players.map((player) => (
              <div
                key={player.id}
                className={`${styles.player} ${
                  (state.phase === "enter-word" &&
                    player.id === state.setterId) ||
                  (state.phase === "guessing" && player.id === state.guesserId)
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
          {roleText && <p className={styles.role}>{roleText}</p>}
        </>
      ) : (
        <p className={styles.soloStats}>
          Solved: {state.soloWins} · Lost: {state.soloLosses}
        </p>
      )}
    </div>
  );
}
