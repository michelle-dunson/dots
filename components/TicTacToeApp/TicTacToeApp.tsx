"use client";

import { TicTacToeBoard } from "@/components/TicTacToeBoard/TicTacToeBoard";
import { TicTacToeGameOver } from "@/components/TicTacToeGameOver/TicTacToeGameOver";
import { TicTacToeSetup } from "@/components/TicTacToeSetup/TicTacToeSetup";
import { TicTacToeStatus } from "@/components/TicTacToeStatus/TicTacToeStatus";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import styles from "../GameApp/GameApp.module.scss";

interface TicTacToeAppProps {
  onBackToHome: () => void;
}

export function TicTacToeApp({ onBackToHome }: TicTacToeAppProps) {
  const {
    state,
    startGame,
    playCell,
    resetGame,
    playAgain,
    isAiThinking,
    isHumanTurn,
    gameId,
  } = useTicTacToe();

  if (!state) {
    return (
      <div className={styles.app}>
        <div className={styles.setupView}>
          <TicTacToeSetup onStart={startGame} onBack={onBackToHome} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.gameView}>
        <header className={styles.header}>
          <h1 className={styles.gameTitle}>Tic-Tac-Toe</h1>
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

        <TicTacToeStatus state={state} />

        <div className={styles.boardSection}>
          <TicTacToeBoard
            key={gameId}
            state={state}
            onCellClick={playCell}
            isHumanTurn={isHumanTurn}
            isAiThinking={isAiThinking}
          />
        </div>

        {state.phase === "finished" && (
          <TicTacToeGameOver state={state} onPlayAgain={playAgain} />
        )}
      </div>
    </div>
  );
}
