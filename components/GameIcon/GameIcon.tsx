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

function TicTacToePreview() {
  const red = "#c0392b";
  const blue = "#2980b9";
  const size = 80;
  const pad = 12;
  const cell = size / 3;

  const marks: Array<{ row: number; col: number; mark: "X" | "O"; color: string }> = [
    { row: 0, col: 0, mark: "X", color: red },
    { row: 1, col: 1, mark: "O", color: blue },
    { row: 0, col: 2, mark: "O", color: blue },
    { row: 2, col: 0, mark: "X", color: red },
    { row: 2, col: 2, mark: "X", color: red },
  ];

  return (
    <svg
      className={styles.icon}
      viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`}
      aria-hidden="true"
    >
      {[1, 2].map((index) => (
        <line
          key={`h-${index}`}
          x1={pad}
          y1={pad + index * cell}
          x2={pad + size}
          y2={pad + index * cell}
          stroke="#2c2416"
          strokeWidth={1.5}
          opacity={0.35}
        />
      ))}
      {[1, 2].map((index) => (
        <line
          key={`v-${index}`}
          x1={pad + index * cell}
          y1={pad}
          x2={pad + index * cell}
          y2={pad + size}
          stroke="#2c2416"
          strokeWidth={1.5}
          opacity={0.35}
        />
      ))}
      {marks.map((item, index) => (
        <text
          key={index}
          x={pad + item.col * cell + cell / 2}
          y={pad + item.row * cell + cell / 2 + 6}
          textAnchor="middle"
          fill={item.color}
          className={styles.mark}
        >
          {item.mark}
        </text>
      ))}
    </svg>
  );
}

function HangmanPreview() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <line x1="12" y1="88" x2="88" y2="88" stroke="#2c2416" strokeWidth="2.5" />
      <line x1="28" y1="88" x2="28" y2="18" stroke="#2c2416" strokeWidth="2.5" />
      <line x1="28" y1="18" x2="62" y2="18" stroke="#2c2416" strokeWidth="2.5" />
      <line x1="62" y1="18" x2="62" y2="30" stroke="#2c2416" strokeWidth="2.5" />
      <circle cx="62" cy="42" r="10" fill="none" stroke="#c0392b" strokeWidth="2.5" />
      <line x1="62" y1="52" x2="62" y2="68" stroke="#2980b9" strokeWidth="2.5" />
      <line x1="62" y1="58" x2="50" y2="66" stroke="#2980b9" strokeWidth="2.5" />
      <text x="70" y="78" className={styles.mark} fill="#2c2416">
        A_E
      </text>
    </svg>
  );
}

function SudokuPreview() {
  const red = "#c0392b";
  const blue = "#2980b9";
  const size = 72;
  const pad = 14;
  const cell = size / 9;

  const marks: Array<{
    row: number;
    col: number;
    value: number;
    color: string;
  }> = [
    { row: 0, col: 0, value: 5, color: red },
    { row: 1, col: 4, value: 9, color: blue },
    { row: 3, col: 2, value: 3, color: blue },
    { row: 4, col: 4, value: 1, color: red },
    { row: 6, col: 7, value: 8, color: blue },
    { row: 8, col: 8, value: 9, color: red },
  ];

  return (
    <svg
      className={styles.icon}
      viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`}
      aria-hidden="true"
    >
      <rect
        x={pad}
        y={pad}
        width={size}
        height={size}
        fill="none"
        stroke="#2c2416"
        strokeWidth={2}
      />
      {[3, 6].map((index) => (
        <line
          key={`h-${index}`}
          x1={pad}
          y1={pad + index * cell}
          x2={pad + size}
          y2={pad + index * cell}
          stroke="#2c2416"
          strokeWidth={1.5}
          opacity={0.35}
        />
      ))}
      {[3, 6].map((index) => (
        <line
          key={`v-${index}`}
          x1={pad + index * cell}
          y1={pad}
          x2={pad + index * cell}
          y2={pad + size}
          stroke="#2c2416"
          strokeWidth={1.5}
          opacity={0.35}
        />
      ))}
      {marks.map((mark) => (
        <text
          key={`${mark.row}-${mark.col}`}
          x={pad + mark.col * cell + cell / 2}
          y={pad + mark.row * cell + cell / 2 + 3}
          textAnchor="middle"
          className={styles.sudokuMark}
          fill={mark.color}
        >
          {mark.value}
        </text>
      ))}
    </svg>
  );
}

export function GameIcon({ gameId }: GameIconProps) {
  switch (gameId) {
    case "dots-and-boxes":
      return <DotsAndBoxesPreview />;
    case "tic-tac-toe":
      return <TicTacToePreview />;
    case "hangman":
      return <HangmanPreview />;
    case "sudoku":
      return <SudokuPreview />;
    default:
      return null;
  }
}
