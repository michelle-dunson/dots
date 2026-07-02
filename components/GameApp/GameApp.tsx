"use client";

import { GameBoard } from "@/components/GameBoard/GameBoard";
import { GameOver } from "@/components/GameOver/GameOver";
import { GameSetup } from "@/components/GameSetup/GameSetup";
import { ScoreBoard } from "@/components/ScoreBoard/ScoreBoard";
import { useGame } from "@/hooks/useGame";
import styles from "./GameApp.module.scss";

export function GameApp() {
  const {
    state,
    startGame,
    playEdge,
    resetGame,
    playAgain,
    isAiThinking,
    isHumanTurn,
  } = useGame();

  if (!state) {
    return (
      <div className={styles.app}>
        <div className={styles.setupView}>
          <GameSetup onStart={startGame} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.gameView}>
        <header className={styles.header}>
          <h1 className={styles.gameTitle}>Dots &amp; Boxes</h1>
          <button
            type="button"
            className={styles.newGameButton}
            onClick={resetGame}
          >
            New Game
          </button>
        </header>

        <ScoreBoard state={state} />

        <div className={styles.boardSection}>
          <GameBoard
            state={state}
            onEdgeClick={playEdge}
            isHumanTurn={isHumanTurn}
            isAiThinking={isAiThinking}
          />
        </div>

        {state.phase === "finished" && (
          <GameOver state={state} onPlayAgain={playAgain} />
        )}
      </div>
    </div>
  );
}
