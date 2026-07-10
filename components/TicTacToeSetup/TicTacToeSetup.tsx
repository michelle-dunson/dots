"use client";

import { useState } from "react";
import { createPlayers } from "@/lib/tictactoe/board";
import { PLAYER_COLORS, type PlayerConfig } from "@/lib/tictactoe/types";
import styles from "../GameSetup/GameSetup.module.scss";

interface TicTacToeSetupProps {
  onStart: (players: PlayerConfig[]) => void;
  onBack: () => void;
}

export function TicTacToeSetup({ onStart, onBack }: TicTacToeSetupProps) {
  const [vsComputer, setVsComputer] = useState(false);
  const [names, setNames] = useState(["Player 1", "Player 2"]);

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleStart = () => {
    const displayNames = vsComputer
      ? [names[0] || "You"]
      : [names[0] || "Player 1", names[1] || "Player 2"];
    onStart(createPlayers(vsComputer, displayNames));
  };

  return (
    <div className={styles.setup}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Tic-Tac-Toe</h1>
      </div>
      <p className={styles.subtitle}>
        Get three in a row. X goes first.
      </p>

      <div className={styles.section}>
        <span className={styles.label}>Mode</span>
        <div className={styles.playerCount}>
          <button
            type="button"
            className={`${styles.countButton} ${!vsComputer ? styles.active : ""}`}
            onClick={() => setVsComputer(false)}
          >
            2 Players
          </button>
          <button
            type="button"
            className={`${styles.countButton} ${vsComputer ? styles.active : ""}`}
            onClick={() => setVsComputer(true)}
          >
            1 vs CPU
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>
          {vsComputer ? "Your name" : "Player names"}
        </span>
        <div className={styles.nameInputs}>
          <div className={styles.nameField}>
            <span
              className={styles.colorSwatch}
              style={{ backgroundColor: PLAYER_COLORS[0] }}
            />
            <input
              type="text"
              className={styles.nameInput}
              value={names[0]}
              onChange={(e) => handleNameChange(0, e.target.value)}
              placeholder={vsComputer ? "Your name" : "Player 1 (X)"}
              maxLength={20}
            />
          </div>
          {!vsComputer && (
            <div className={styles.nameField}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: PLAYER_COLORS[1] }}
              />
              <input
                type="text"
                className={styles.nameInput}
                value={names[1]}
                onChange={(e) => handleNameChange(1, e.target.value)}
                placeholder="Player 2 (O)"
                maxLength={20}
              />
            </div>
          )}
          {vsComputer && (
            <div className={styles.nameField}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: PLAYER_COLORS[1] }}
              />
              <input
                type="text"
                className={styles.nameInput}
                value="Computer"
                disabled
              />
            </div>
          )}
        </div>
      </div>

      <button type="button" className={styles.startButton} onClick={handleStart}>
        Start Game
      </button>

      <button type="button" className={styles.backButton} onClick={onBack}>
        ← All Games
      </button>

      <p className={styles.hint}>3×3 grid · X vs O · pass-and-play</p>
    </div>
  );
}
