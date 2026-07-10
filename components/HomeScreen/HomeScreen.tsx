"use client";

import { GameIcon } from "@/components/GameIcon/GameIcon";
import { GAMES, type GameId } from "@/lib/games";
import styles from "./HomeScreen.module.scss";

interface HomeScreenProps {
  onSelectGame: (gameId: GameId) => void;
}

function GameCardContent({ gameId, name, description }: {
  gameId: GameId;
  name: string;
  description: string;
}) {
  return (
    <>
      <GameIcon gameId={gameId} />
      <div className={styles.gameInfo}>
        <span className={styles.gameName}>{name}</span>
        <span className={styles.gameDescription}>{description}</span>
      </div>
    </>
  );
}

export function HomeScreen({ onSelectGame }: HomeScreenProps) {
  return (
    <div className={styles.home}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Paper Games</h1>
      </div>
      <p className={styles.subtitle}>Classic pen-and-paper games, digitized.</p>

      <div className={styles.gameList}>
        {GAMES.map((game) =>
          game.available ? (
            <button
              key={game.id}
              type="button"
              className={styles.gameCard}
              onClick={() => onSelectGame(game.id)}
            >
              <GameCardContent
                gameId={game.id}
                name={game.name}
                description={game.description}
              />
            </button>
          ) : (
            <div key={game.id} className={styles.comingSoon}>
              <GameCardContent
                gameId={game.id}
                name={game.name}
                description={game.description}
              />
              <span className={styles.badge}>Coming soon</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
