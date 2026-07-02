"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { getAIMove } from "@/lib/game/ai";
import { createInitialState } from "@/lib/game/board";
import { applyMove } from "@/lib/game/rules";
import type { EdgeId, GameState, PlayerConfig } from "@/lib/game/types";

type GameAction =
  | { type: "START"; players: PlayerConfig[] }
  | { type: "PLAY_EDGE"; edgeId: EdgeId }
  | { type: "RESTART" }
  | { type: "RESET" }
  | { type: "CLEAR_EXTRA_TURN_MESSAGE" };

interface GameContext {
  state: GameState | null;
  isAiThinking: boolean;
  gameId: number;
}

function shouldAiThink(state: GameState): boolean {
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
    case "PLAY_EDGE": {
      if (!context.state || context.state.phase !== "playing") {
        return context;
      }

      const result = applyMove(context.state, action.edgeId);
      if (result.invalid) {
        return context;
      }

      return {
        state: result.state,
        isAiThinking: shouldAiThink(result.state),
        gameId: context.gameId,
      };
    }
    case "CLEAR_EXTRA_TURN_MESSAGE": {
      if (!context.state) {
        return context;
      }
      return {
        ...context,
        state: { ...context.state, extraTurnMessage: false },
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

export function useGame() {
  const [{ state, isAiThinking, gameId }, dispatch] = useReducer(gameReducer, {
    state: null,
    isAiThinking: false,
    gameId: 0,
  });
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((players: PlayerConfig[]) => {
    dispatch({ type: "START", players });
  }, []);

  const playEdge = useCallback(
    (edgeId: EdgeId) => {
      if (!state || state.phase !== "playing" || isAiThinking) {
        return;
      }

      const current = state.players.find((p) => p.id === state.currentPlayer);
      if (!current?.isHuman) {
        return;
      }

      dispatch({ type: "PLAY_EDGE", edgeId });
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

  const clearExtraTurnMessage = useCallback(() => {
    dispatch({ type: "CLEAR_EXTRA_TURN_MESSAGE" });
  }, []);

  useEffect(() => {
    if (!state || !isAiThinking) {
      return;
    }

    aiTimeoutRef.current = setTimeout(() => {
      const move = getAIMove(state);
      if (move) {
        dispatch({ type: "PLAY_EDGE", edgeId: move });
      }
    }, AI_THINK_DELAY_MS);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [state, isAiThinking]);

  useEffect(() => {
    if (state?.extraTurnMessage) {
      const timer = setTimeout(() => {
        clearExtraTurnMessage();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.extraTurnMessage, clearExtraTurnMessage]);

  const currentPlayer = state
    ? state.players.find((p) => p.id === state.currentPlayer)
    : null;

  const isHumanTurn =
    state?.phase === "playing" && currentPlayer?.isHuman === true;

  return {
    state,
    startGame,
    playEdge,
    resetGame,
    playAgain,
    isAiThinking,
    gameId,
    isHumanTurn,
    currentPlayer,
    clearExtraTurnMessage,
  };
}
