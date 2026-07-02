"use client";

import { useMemo, useState } from "react";
import { getValidEdges } from "@/lib/game/board";
import type { EdgeId, GameState, PlayerConfig } from "@/lib/game/types";
import { GRID_SIZE, makeEdgeId } from "@/lib/game/types";
import styles from "./GameBoard.module.scss";

const VIEW_SIZE = 700;
const CELL = VIEW_SIZE / (GRID_SIZE - 1);
const DOT_RADIUS = 5;
const PAD = DOT_RADIUS + 4;
const MARGIN_X = 40;

interface GameBoardProps {
  state: GameState;
  onEdgeClick: (edgeId: EdgeId) => void;
  isHumanTurn: boolean;
  isAiThinking: boolean;
}

function dotPosition(row: number, col: number): { x: number; y: number } {
  return {
    x: MARGIN_X + PAD + col * CELL,
    y: PAD + row * CELL,
  };
}

function edgeSeed(edgeId: string): number {
  let hash = 0;
  for (let i = 0; i < edgeId.length; i++) {
    hash = (hash << 5) - hash + edgeId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function wobbleOffset(seed: number, index: number): number {
  return ((seed * (index + 1) * 9301 + 49297) % 233280) / 233280 * 4 - 2;
}

export function GameBoard({
  state,
  onEdgeClick,
  isHumanTurn,
  isAiThinking,
}: GameBoardProps) {
  const [hoveredEdge, setHoveredEdge] = useState<EdgeId | null>(null);
  const validEdgeSet = new Set(getValidEdges(state));
  const playerMap = useMemo(() => {
    const map = new Map<number, PlayerConfig>();
    for (const player of state.players) {
      map.set(player.id, player);
    }
    return map;
  }, [state.players]);

  const canInteract = isHumanTurn && !isAiThinking;

  const renderSquares = () => {
    const squares = [];
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        const key = `${row}:${col}`;
        const owner = state.squares[key];
        if (owner === undefined) continue;

        const topLeft = dotPosition(row, col);
        const player = playerMap.get(owner);
        squares.push(
          <rect
            key={key}
            className={styles.squareFill}
            x={topLeft.x + 4}
            y={topLeft.y + 4}
            width={CELL - 8}
            height={CELL - 8}
            fill={player?.color ?? "#999"}
            rx={2}
          />,
        );
      }
    }
    return squares;
  };

  const renderEdges = () => {
    const elements = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        const edgeId = makeEdgeId("h", row, col);
        elements.push(
          renderEdge(edgeId, "h", row, col),
        );
      }
    }

    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const edgeId = makeEdgeId("v", row, col);
        elements.push(
          renderEdge(edgeId, "v", row, col),
        );
      }
    }

    return elements;
  };

  const renderEdge = (
    edgeId: EdgeId,
    orientation: "h" | "v",
    row: number,
    col: number,
  ) => {
    const isDrawn = state.edges[edgeId] !== undefined;
    const isValid = validEdgeSet.has(edgeId);
    const isHovered = hoveredEdge === edgeId;
    const owner = state.edges[edgeId];
    const player = owner !== undefined ? playerMap.get(owner) : undefined;

    let x1: number, y1: number, x2: number, y2: number;

    if (orientation === "h") {
      const start = dotPosition(row, col);
      const end = dotPosition(row, col + 1);
      x1 = start.x;
      y1 = start.y;
      x2 = end.x;
      y2 = end.y;
    } else {
      const start = dotPosition(row, col);
      const end = dotPosition(row + 1, col);
      x1 = start.x;
      y1 = start.y;
      x2 = end.x;
      y2 = end.y;
    }

    const seed = edgeSeed(edgeId);
    if (isDrawn) {
      y1 += wobbleOffset(seed, 0);
      y2 += wobbleOffset(seed, 1);
      if (orientation === "v") {
        x1 += wobbleOffset(seed, 0);
        x2 += wobbleOffset(seed, 1);
      }
    }

    return (
      <g key={edgeId}>
        {!isDrawn && isValid && (
          <>
            <line
              className={`${styles.edgeHit} ${canInteract ? styles.hoverable : styles.disabled}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              onClick={() => canInteract && onEdgeClick(edgeId)}
              onMouseEnter={() => canInteract && setHoveredEdge(edgeId)}
              onMouseLeave={() => setHoveredEdge(null)}
            />
            {(isHovered && canInteract) && (
              <line
                className={styles.edgePreview}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{ opacity: 0.5 }}
              />
            )}
          </>
        )}
        {isDrawn && (
          <line
            className={styles.edgeDrawn}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={player?.color ?? "#999"}
            strokeDasharray={100}
            strokeDashoffset={0}
          />
        )}
      </g>
    );
  };

  const renderDots = () => {
    const dots = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const { x, y } = dotPosition(row, col);
        dots.push(
          <circle
            key={`${row}-${col}`}
            className={styles.dot}
            cx={x}
            cy={y}
            r={DOT_RADIUS}
          />,
        );
      }
    }
    return dots;
  };

  const viewBoxWidth = MARGIN_X + PAD + VIEW_SIZE + PAD;
  const viewBoxHeight = PAD + VIEW_SIZE + PAD;

  return (
    <div className={styles.boardWrapper}>
      <svg
        className={styles.board}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          className={styles.marginLine}
          x1={MARGIN_X - 20}
          y1={PAD}
          x2={MARGIN_X - 20}
          y2={PAD + VIEW_SIZE}
        />
        {renderSquares()}
        {renderEdges()}
        {renderDots()}
      </svg>
      {isAiThinking && (
        <div className={styles.thinkingOverlay}>Computer is thinking…</div>
      )}
    </div>
  );
}
