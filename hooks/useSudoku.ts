"use client";

import { useCallback, useEffect, useReducer } from "react";
import { createInitialState } from "@/lib/sudoku/board";
import {
  clearCell,
  eraseCell,
  selectCell,
  setCell,
  togglePencilMark,
} from "@/lib/sudoku/rules";
import type { CellValue, SessionConfig, SudokuState } from "@/lib/sudoku/types";

type GameAction =
  | { type: "START"; config: SessionConfig; now: number }
  | { type: "SELECT"; row: number; col: number }
  | { type: "SET"; row: number; col: number; value: CellValue; now: number }
  | { type: "TOGGLE_NOTE"; row: number; col: number; value: CellValue }
  | { type: "CLEAR" }
  | { type: "ERASE"; row: number; col: number; now: number }
  | { type: "TICK"; now: number }
  | { type: "RESTART"; now: number }
  | { type: "RESET" };

interface GameContext {
  state: SudokuState | null;
  gameId: number;
  lastConfig: SessionConfig | null;
  elapsedMs: number;
}

function getElapsedMs(state: SudokuState, now: number): number {
  if (state.endedAt !== null) {
    return state.endedAt - state.startedAt;
  }

  return now - state.startedAt;
}

function gameReducer(context: GameContext, action: GameAction): GameContext {
  switch (action.type) {
    case "START": {
      return {
        state: createInitialState(action.config, action.now),
        gameId: context.gameId + 1,
        lastConfig: action.config,
        elapsedMs: 0,
      };
    }
    case "SELECT": {
      if (!context.state) {
        return context;
      }

      return {
        ...context,
        state: selectCell(context.state, action.row, action.col),
      };
    }
    case "SET": {
      if (!context.state) {
        return context;
      }

      const result = setCell(
        context.state,
        action.row,
        action.col,
        action.value,
        action.now,
      );
      if (result.invalid) {
        return context;
      }

      return {
        ...context,
        state: result.state,
        elapsedMs: getElapsedMs(result.state, action.now),
      };
    }
    case "TOGGLE_NOTE": {
      if (!context.state) {
        return context;
      }

      const result = togglePencilMark(
        context.state,
        action.row,
        action.col,
        action.value,
      );
      if (result.invalid) {
        return context;
      }

      return {
        ...context,
        state: result.state,
      };
    }
    case "CLEAR": {
      if (!context.state) {
        return context;
      }

      const result = clearCell(context.state);
      if (result.invalid) {
        return context;
      }

      return {
        ...context,
        state: result.state,
      };
    }
    case "ERASE": {
      if (!context.state) {
        return context;
      }

      const result = eraseCell(
        context.state,
        action.row,
        action.col,
        action.now,
      );
      if (result.invalid) {
        return context;
      }

      return {
        ...context,
        state: result.state,
        elapsedMs: getElapsedMs(result.state, action.now),
      };
    }
    case "TICK": {
      if (!context.state || context.state.phase !== "playing") {
        return context;
      }

      return {
        ...context,
        elapsedMs: getElapsedMs(context.state, action.now),
      };
    }
    case "RESTART": {
      if (!context.lastConfig) {
        return context;
      }

      return {
        state: createInitialState(context.lastConfig, action.now),
        gameId: context.gameId + 1,
        lastConfig: context.lastConfig,
        elapsedMs: 0,
      };
    }
    case "RESET":
      return {
        state: null,
        gameId: context.gameId,
        lastConfig: null,
        elapsedMs: 0,
      };
    default:
      return context;
  }
}

export function useSudoku() {
  const [{ state, gameId, lastConfig, elapsedMs }, dispatch] = useReducer(
    gameReducer,
    {
      state: null,
      gameId: 0,
      lastConfig: null,
      elapsedMs: 0,
    },
  );

  useEffect(() => {
    if (!state || state.phase !== "playing") {
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "TICK", now: Date.now() });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state, gameId]);

  const startGame = useCallback((config: SessionConfig) => {
    dispatch({ type: "START", config, now: Date.now() });
  }, []);

  const select = useCallback((row: number, col: number) => {
    dispatch({ type: "SELECT", row, col });
  }, []);

  const setValue = useCallback((row: number, col: number, value: CellValue) => {
    dispatch({ type: "SET", row, col, value, now: Date.now() });
  }, []);

  const toggleNote = useCallback((row: number, col: number, value: CellValue) => {
    dispatch({ type: "TOGGLE_NOTE", row, col, value });
  }, []);

  const clearSelected = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const erase = useCallback((row: number, col: number) => {
    dispatch({ type: "ERASE", row, col, now: Date.now() });
  }, []);

  const playAgain = useCallback(() => {
    dispatch({ type: "RESTART", now: Date.now() });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    gameId,
    lastConfig,
    elapsedMs,
    startGame,
    select,
    setValue,
    toggleNote,
    clearSelected,
    erase,
    playAgain,
    resetGame,
  };
}
