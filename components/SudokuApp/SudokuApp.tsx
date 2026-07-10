"use client";

import { SudokuBoard } from "@/components/SudokuBoard/SudokuBoard";
import { SudokuComplete } from "@/components/SudokuComplete/SudokuComplete";
import { SudokuSetup } from "@/components/SudokuSetup/SudokuSetup";
import { SudokuStatus } from "@/components/SudokuStatus/SudokuStatus";
import { useSudoku } from "@/hooks/useSudoku";
import styles from "../GameApp/GameApp.module.scss";

interface SudokuAppProps {
  onBackToHome: () => void;
}

export function SudokuApp({ onBackToHome }: SudokuAppProps) {
  const {
    state,
    gameId,
    elapsedMs,
    startGame,
    select,
    setValue,
    toggleNote,
    clearSelected,
    playAgain,
    resetGame,
  } = useSudoku();

  if (!state) {
    return (
      <div className={styles.app}>
        <div className={styles.setupView}>
          <SudokuSetup onStart={startGame} onBack={onBackToHome} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.gameView}>
        <header className={styles.header}>
          <h1 className={styles.gameTitle}>Sudoku</h1>
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

        <SudokuStatus state={state} elapsedMs={elapsedMs} />

        <div className={styles.boardSection}>
          <SudokuBoard
            key={gameId}
            state={state}
            onSelect={select}
            onSetValue={setValue}
            onToggleNote={toggleNote}
            onClear={clearSelected}
          />
        </div>

        {(state.phase === "complete" || state.phase === "failed") && (
          <SudokuComplete
            state={state}
            elapsedMs={elapsedMs}
            onPlayAgain={playAgain}
          />
        )}
      </div>
    </div>
  );
}
