"use client";

import { getPlayerById } from "@/lib/tictactoe/board";
import { getWinningLine } from "@/lib/tictactoe/rules";
import type { TicTacToeState } from "@/lib/tictactoe/types";
import styles from "./TicTacToeBoard.module.scss";

interface TicTacToeBoardProps {
  state: TicTacToeState;
  onCellClick: (cellIndex: number) => void;
  isHumanTurn: boolean;
  isAiThinking: boolean;
}

export function TicTacToeBoard({
  state,
  onCellClick,
  isHumanTurn,
  isAiThinking,
}: TicTacToeBoardProps) {
  const winningLine = state.phase === "finished" ? getWinningLine(state.board) : null;
  const canInteract = isHumanTurn && !isAiThinking;

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        {state.board.map((cell, index) => {
          const player = cell !== null ? getPlayerById(state, cell) : null;
          const isWinning = winningLine?.includes(index) ?? false;
          const isEmpty = cell === null;

          return (
            <button
              key={index}
              type="button"
              className={`${styles.cell} ${isWinning ? styles.winning : ""}`}
              onClick={() => canInteract && isEmpty && onCellClick(index)}
              disabled={!isEmpty || !canInteract}
              aria-label={
                isEmpty
                  ? `Place mark in cell ${index + 1}`
                  : `${player?.mark} in cell ${index + 1}`
              }
            >
              {player && (
                <span
                  className={styles.mark}
                  style={{ color: player.color }}
                >
                  {player.mark}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {isAiThinking && (
        <div className={styles.thinkingOverlay}>Computer is thinking…</div>
      )}
    </div>
  );
}
