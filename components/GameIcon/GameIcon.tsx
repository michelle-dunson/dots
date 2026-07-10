import type { GameId } from "@/lib/games";
import styles from "./GameIcon.module.scss";

interface GameIconProps {
  gameId: GameId;
}

const VIEW = 80;
const GRID = 4;
const CELL = VIEW / (GRID - 1);
const PAD = 10;
const DOT_R = 2.5;

function dotPos(row: number, col: number) {
  return { x: PAD + col * CELL, y: PAD + row * CELL };
}

function DotsAndBoxesPreview() {
  const red = "#c0392b";
  const blue = "#2980b9";

  const drawnEdges: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
  }> = [
    { ...edge("h", 0, 0), color: red },
    { ...edge("h", 0, 1), color: red },
    { ...edge("v", 0, 0), color: red },
    { ...edge("v", 0, 1), color: blue },
    { ...edge("h", 1, 0), color: blue },
    { ...edge("v", 1, 0), color: blue },
    { ...edge("h", 2, 1), color: red },
    { ...edge("v", 1, 2), color: blue },
  ];

  function edge(orientation: "h" | "v", row: number, col: number) {
    if (orientation === "h") {
      const start = dotPos(row, col);
      const end = dotPos(row, col + 1);
      return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
    }
    const start = dotPos(row, col);
    const end = dotPos(row + 1, col);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  }

  const square = dotPos(0, 0);

  return (
    <svg
      className={styles.icon}
      viewBox={`0 0 ${VIEW + PAD * 2} ${VIEW + PAD * 2}`}
      aria-hidden="true"
    >
      <rect
        x={square.x + 3}
        y={square.y + 3}
        width={CELL - 6}
        height={CELL - 6}
        fill={red}
        opacity={0.28}
        rx={1}
      />
      {drawnEdges.map((edgeLine, index) => (
        <line
          key={index}
          x1={edgeLine.x1}
          y1={edgeLine.y1}
          x2={edgeLine.x2}
          y2={edgeLine.y2}
          stroke={edgeLine.color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ))}
      {Array.from({ length: GRID * GRID }, (_, index) => {
        const row = Math.floor(index / GRID);
        const col = index % GRID;
        const { x, y } = dotPos(row, col);
        return <circle key={index} cx={x} cy={y} r={DOT_R} className={styles.dot} />;
      })}
    </svg>
  );
}

export function GameIcon({ gameId }: GameIconProps) {
  switch (gameId) {
    case "dots-and-boxes":
      return <DotsAndBoxesPreview />;
    default:
      return null;
  }
}
