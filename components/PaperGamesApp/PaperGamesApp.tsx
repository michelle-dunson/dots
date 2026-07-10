"use client";

import { useState } from "react";
import { GameApp } from "@/components/GameApp/GameApp";
import { HomeScreen } from "@/components/HomeScreen/HomeScreen";
import type { GameId } from "@/lib/games";
import styles from "./PaperGamesApp.module.scss";

export function PaperGamesApp() {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  if (selectedGame === "dots-and-boxes") {
    return <GameApp onBackToHome={() => setSelectedGame(null)} />;
  }

  return (
    <div className={styles.app}>
      <div className={styles.centeredView}>
        <HomeScreen onSelectGame={setSelectedGame} />
      </div>
    </div>
  );
}
