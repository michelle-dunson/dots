"use client";

import { useCallback, useReducer } from "react";
import { createPlayers, createSession } from "@/lib/hangman/board";
import { guessLetter, startNextRound, submitWord } from "@/lib/hangman/rules";
import type { GameMode, HangmanState } from "@/lib/hangman/types";

interface SessionConfig {
  mode: GameMode;
  names: string[];
}

type GameAction =
  | { type: "START"; config: SessionConfig }
  | { type: "GUESS"; letter: string }
  | { type: "SUBMIT_WORD"; word: string }
  | { type: "NEXT_ROUND" }
  | { type: "CLEAR_WORD_ERROR" }
  | { type: "RESET" };

interface GameContext {
  state: HangmanState | null;
  gameId: number;
  wordError: string | null;
}

function gameReducer(context: GameContext, action: GameAction): GameContext {
  switch (action.type) {
    case "START": {
      const players = createPlayers(action.config.mode, action.config.names);
      const newState = createSession(action.config.mode, players);
      return {
        state: newState,
        gameId: context.gameId + 1,
        wordError: null,
      };
    }
    case "GUESS": {
      if (!context.state) {
        return context;
      }

      const result = guessLetter(context.state, action.letter);
      if (result.invalid) {
        return context;
      }

      return {
        ...context,
        state: result.state,
        wordError: null,
      };
    }
    case "SUBMIT_WORD": {
      if (!context.state) {
        return context;
      }

      const result = submitWord(context.state, action.word);
      if (result.invalid) {
        return {
          ...context,
          wordError: result.error ?? "Invalid word.",
        };
      }

      return {
        ...context,
        state: result.state,
        gameId: context.gameId + 1,
        wordError: null,
      };
    }
    case "NEXT_ROUND": {
      if (!context.state) {
        return context;
      }

      return {
        ...context,
        state: startNextRound(context.state),
        gameId: context.gameId + 1,
        wordError: null,
      };
    }
    case "CLEAR_WORD_ERROR":
      return {
        ...context,
        wordError: null,
      };
    case "RESET":
      return { state: null, gameId: context.gameId, wordError: null };
    default:
      return context;
  }
}

export function useHangman() {
  const [{ state, gameId, wordError }, dispatch] = useReducer(gameReducer, {
    state: null,
    gameId: 0,
    wordError: null,
  });

  const startGame = useCallback((config: SessionConfig) => {
    dispatch({ type: "START", config });
  }, []);

  const guess = useCallback((letter: string) => {
    dispatch({ type: "GUESS", letter });
  }, []);

  const submitPlayerWord = useCallback((word: string) => {
    dispatch({ type: "SUBMIT_WORD", word });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: "NEXT_ROUND" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const clearWordError = useCallback(() => {
    dispatch({ type: "CLEAR_WORD_ERROR" });
  }, []);

  return {
    state,
    gameId,
    wordError,
    startGame,
    guess,
    submitPlayerWord,
    nextRound,
    resetGame,
    clearWordError,
  };
}
