"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { getAIMove } from "@/lib/tictactoe/ai";
import { createInitialState } from "@/lib/tictactoe/board";
import { applyMove } from "@/lib/tictactoe/rules";
import type { PlayerConfig, TicTacToeState } from "@/lib/tictactoe/types";

type GameAction =
  | { type: "START"; players: PlayerConfig[] }
  | { type: "PLAY_CELL"; cellIndex: number }
  | { type: "PLAY_AI_MOVE" }
  | { type: "RESTART" }
  | { type: "RESET" };

interface GameContext {
  state: TicTacToeState | null;
  isAiThinking: boolean;
  gameId: number;
}

function shouldAiThink(state: TicTacToeState): boolean {
  if (state.phase !== "playing") {
    return false;
  }
  const current = state.players.find((p) => p.id === state.currentPlayer);
  return current?.isHuman === false;
}

function gameReducer(context: GameContext, action: GameAction): GameContext {
  switch (action.type) {
    case "START": {
      const newState = createInitialState(action.players);
      return {
        state: newState,
        isAiThinking: shouldAiThink(newState),
        gameId: context.gameId + 1,
      };
    }
    case "PLAY_CELL": {
      if (!context.state || context.state.phase !== "playing") {
        return context;
      }

      const move = applyMove(
        context.state.board,
        context.state.currentPlayer,
        action.cellIndex,
      );

      if (move.invalid) {
        return context;
      }

      const newState: TicTacToeState = {
        ...context.state,
        board: move.board,
        currentPlayer: move.currentPlayer,
        phase: move.phase,
        result: move.result,
      };

      return {
        state: newState,
        isAiThinking: shouldAiThink(newState),
        gameId: context.gameId,
      };
    }
    case "PLAY_AI_MOVE": {
      if (!context.state || context.state.phase !== "playing") {
        return context;
      }

      const current = context.state.players.find(
        (p) => p.id === context.state!.currentPlayer,
      );
      if (!current || current.isHuman) {
        return context;
      }

      const cellIndex = getAIMove(context.state.board, current.id);
      if (cellIndex === null) {
        return context;
      }

      const move = applyMove(
        context.state.board,
        context.state.currentPlayer,
        cellIndex,
      );

      if (move.invalid) {
        return context;
      }

      const newState: TicTacToeState = {
        ...context.state,
        board: move.board,
        currentPlayer: move.currentPlayer,
        phase: move.phase,
        result: move.result,
      };

      return {
        state: newState,
        isAiThinking: shouldAiThink(newState),
        gameId: context.gameId,
      };
    }
    case "RESTART": {
      if (!context.state) {
        return context;
      }

      const newState = createInitialState(context.state.players);
      return {
        state: newState,
        isAiThinking: shouldAiThink(newState),
        gameId: context.gameId + 1,
      };
    }
    case "RESET":
      return { state: null, isAiThinking: false, gameId: context.gameId };
    default:
      return context;
  }
}

const AI_THINK_DELAY_MS = 400;

export function useTicTacToe() {
  const [{ state, isAiThinking, gameId }, dispatch] = useReducer(gameReducer, {
    state: null,
    isAiThinking: false,
    gameId: 0,
  });
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((players: PlayerConfig[]) => {
    dispatch({ type: "START", players });
  }, []);

  const playCell = useCallback(
    (cellIndex: number) => {
      if (!state || state.phase !== "playing" || isAiThinking) {
        return;
      }

      const current = state.players.find((p) => p.id === state.currentPlayer);
      if (!current?.isHuman) {
        return;
      }

      dispatch({ type: "PLAY_CELL", cellIndex });
    },
    [state, isAiThinking],
  );

  const resetGame = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    dispatch({ type: "RESET" });
  }, []);

  const playAgain = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    dispatch({ type: "RESTART" });
  }, []);

  useEffect(() => {
    if (!state || !isAiThinking) {
      return;
    }

    aiTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "PLAY_AI_MOVE" });
    }, AI_THINK_DELAY_MS);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [state, isAiThinking]);

  const currentPlayer = state
    ? state.players.find((p) => p.id === state.currentPlayer)
    : null;

  const isHumanTurn =
    state?.phase === "playing" && currentPlayer?.isHuman === true;

  return {
    state,
    startGame,
    playCell,
    resetGame,
    playAgain,
    isAiThinking,
    isHumanTurn,
    currentPlayer,
    gameId,
  };
}
