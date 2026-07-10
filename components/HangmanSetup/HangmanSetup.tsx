"use client";

import { useState } from "react";
import type { GameMode } from "@/lib/hangman/types";
import { PLAYER_COLORS } from "@/lib/hangman/types";
import styles from "../GameSetup/GameSetup.module.scss";

interface HangmanSetupProps {
  onStart: (config: { mode: GameMode; names: string[] }) => void;
  onBack: () => void;
}

export function HangmanSetup({ onStart, onBack }: HangmanSetupProps) {
  const [mode, setMode] = useState<GameMode>("versus");
  const [names, setNames] = useState(["Player 1", "Player 2"]);

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleStart = () => {
    const displayNames =
      mode === "solo"
        ? [names[0] || "You"]
        : [names[0] || "Player 1", names[1] || "Player 2"];
    onStart({ mode, names: displayNames });
  };

  return (
    <div className={styles.setup}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Hangman</h1>
      </div>
      <p className={styles.subtitle}>
        Guess the word before the drawing is complete.
      </p>

      <div className={styles.section}>
        <span className={styles.label}>Mode</span>
        <div className={styles.playerCount}>
          <button
            type="button"
            className={`${styles.countButton} ${mode === "versus" ? styles.active : ""}`}
            onClick={() => setMode("versus")}
          >
            2 Players
          </button>
          <button
            type="button"
            className={`${styles.countButton} ${mode === "solo" ? styles.active : ""}`}
            onClick={() => setMode("solo")}
          >
            Single Player
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>
          {mode === "solo" ? "Your name" : "Player names"}
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
              placeholder={mode === "solo" ? "Your name" : "Player 1"}
              maxLength={20}
            />
          </div>
          {mode === "versus" && (
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
                placeholder="Player 2"
                maxLength={20}
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

      <p className={styles.hint}>
        {mode === "solo"
          ? "Random words · 6 wrong guesses"
          : "Take turns setting & guessing · real words only"}
      </p>
    </div>
  );
}
