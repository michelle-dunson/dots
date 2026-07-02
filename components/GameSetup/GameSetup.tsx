"use client";

import { useState } from "react";
import { createPlayers } from "@/lib/game/board";
import { PLAYER_COLORS, type PlayerConfig } from "@/lib/game/types";
import styles from "./GameSetup.module.scss";

interface GameSetupProps {
  onStart: (players: PlayerConfig[]) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
  ]);

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleStart = () => {
    const displayNames =
      playerCount === 1
        ? [names[0] || "You"]
        : names.slice(0, playerCount);
    onStart(createPlayers(playerCount, displayNames));
  };

  const nameFieldCount = playerCount === 1 ? 1 : playerCount;

  return (
    <div className={styles.setup}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Dots &amp; Boxes</h1>
      </div>
      <p className={styles.subtitle}>
        Draw lines. Close boxes. Most squares wins.
      </p>

      <div className={styles.section}>
        <span className={styles.label}>Players</span>
        <div className={styles.playerCount}>
          {[1, 2, 3, 4].map((count) => (
            <button
              key={count}
              type="button"
              className={`${styles.countButton} ${
                playerCount === count ? styles.active : ""
              }`}
              onClick={() => setPlayerCount(count)}
            >
              {count === 1 ? "1 vs CPU" : count}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>
          {playerCount === 1 ? "Your name" : "Player names"}
        </span>
        <div className={styles.nameInputs}>
          {Array.from({ length: nameFieldCount }, (_, index) => (
            <div key={index} className={styles.nameField}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: PLAYER_COLORS[index as 0 | 1 | 2 | 3] }}
              />
              <input
                type="text"
                className={styles.nameInput}
                value={names[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={
                  playerCount === 1 && index === 0
                    ? "Your name"
                    : `Player ${index + 1}`
                }
                maxLength={20}
              />
            </div>
          ))}
          {playerCount === 1 && (
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

      <p className={styles.hint}>7×7 dot grid · 36 squares · pass-and-play</p>
    </div>
  );
}
