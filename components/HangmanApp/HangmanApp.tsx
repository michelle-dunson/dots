"use client";

import { HangmanBoard } from "@/components/HangmanBoard/HangmanBoard";
import { HangmanEnterWord } from "@/components/HangmanEnterWord/HangmanEnterWord";
import { HangmanRoundOver } from "@/components/HangmanRoundOver/HangmanRoundOver";
import { HangmanScoreboard } from "@/components/HangmanScoreboard/HangmanScoreboard";
import { HangmanSetup } from "@/components/HangmanSetup/HangmanSetup";
import { useHangman } from "@/hooks/useHangman";
import styles from "../GameApp/GameApp.module.scss";

interface HangmanAppProps {
  onBackToHome: () => void;
}

export function HangmanApp({ onBackToHome }: HangmanAppProps) {
  const {
    state,
    gameId,
    wordError,
    startGame,
    guess,
    submitPlayerWord,
    nextRound,
    resetGame,
    clearWordError,
  } = useHangman();

  if (!state) {
    return (
      <div className={styles.app}>
        <div className={styles.setupView}>
          <HangmanSetup onStart={startGame} onBack={onBackToHome} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.gameView}>
        <header className={styles.header}>
          <h1 className={styles.gameTitle}>Hangman</h1>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.newGameButton}
              onClick={resetGame}
            >
              New Game
            </button>
            <button
              type="button"
              className={styles.allGamesButton}
              onClick={onBackToHome}
            >
              ← All Games
            </button>
          </div>
        </header>

        <HangmanScoreboard state={state} />

        <div className={styles.boardSection}>
          {state.phase === "enter-word" && (
            <HangmanEnterWord
              key={`enter-${gameId}`}
              state={state}
              onSubmit={submitPlayerWord}
              error={wordError}
              onClearError={clearWordError}
            />
          )}
          {state.phase === "guessing" && (
            <HangmanBoard
              key={`board-${gameId}`}
              state={state}
              onGuess={guess}
            />
          )}
          {state.phase === "round-over" && (
            <HangmanBoard state={state} onGuess={guess} />
          )}
        </div>

        {state.phase === "round-over" && (
          <HangmanRoundOver state={state} onNextRound={nextRound} />
        )}
      </div>
    </div>
  );
}
