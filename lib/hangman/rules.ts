import {
  createSoloRound,
  createVersusRound,
  getNextVersusRoles,
  isWordComplete,
  startVersusGuessing,
} from "./board";
import { getWordValidationError, normalizeWord } from "./dictionary";
import type { HangmanState, PlayerId } from "./types";

export interface GuessResult {
  state: HangmanState;
  letter: string;
  isCorrect: boolean;
  alreadyGuessed?: boolean;
  invalid?: boolean;
}

export interface SetWordResult {
  state: HangmanState;
  error?: string;
  invalid?: boolean;
}

export function guessLetter(
  state: HangmanState,
  letter: string,
): GuessResult {
  if (state.phase !== "guessing") {
    return { state, letter, isCorrect: false, invalid: true };
  }

  const normalized = letter.toLowerCase();

  if (!/^[a-z]$/.test(normalized)) {
    return { state, letter: normalized, isCorrect: false, invalid: true };
  }

  if (state.guessedLetters.includes(normalized)) {
    return {
      state,
      letter: normalized,
      isCorrect: state.word.includes(normalized),
      alreadyGuessed: true,
    };
  }

  const guessedLetters = [...state.guessedLetters, normalized];
  const isCorrect = state.word.includes(normalized);
  const wrongGuesses = isCorrect
    ? state.wrongGuesses
    : state.wrongGuesses + 1;

  let nextState: HangmanState = {
    ...state,
    guessedLetters,
    wrongGuesses,
  };

  if (isWordComplete({ ...nextState, guessedLetters })) {
    nextState = finishRound(nextState, nextState.guesserId);
    return { state: nextState, letter: normalized, isCorrect: true };
  }

  if (wrongGuesses >= state.maxWrongGuesses) {
    nextState = finishRound(nextState, nextState.setterId);
    return { state: nextState, letter: normalized, isCorrect: false };
  }

  return { state: nextState, letter: normalized, isCorrect };
}

function finishRound(state: HangmanState, winner: PlayerId): HangmanState {
  const nextScores = { ...state.scores };

  if (state.mode === "versus") {
    nextScores[winner] += 1;
  }

  const soloWins =
    state.mode === "solo" && winner === state.guesserId
      ? state.soloWins + 1
      : state.soloWins;
  const soloLosses =
    state.mode === "solo" && winner === state.setterId
      ? state.soloLosses + 1
      : state.soloLosses;

  return {
    ...state,
    scores: nextScores,
    phase: "round-over",
    roundWinner: winner,
    soloWins,
    soloLosses,
  };
}

export function submitWord(
  state: HangmanState,
  input: string,
): SetWordResult {
  if (state.phase !== "enter-word") {
    return { state, invalid: true };
  }

  const error = getWordValidationError(input);
  if (error) {
    return { state, error, invalid: true };
  }

  const word = normalizeWord(input);
  return {
    state: startVersusGuessing(state, word),
  };
}

export function startNextRound(state: HangmanState): HangmanState {
  if (state.mode === "solo") {
    const base = createSoloRound(state);
    return {
      ...base,
      soloWins: state.soloWins,
      soloLosses: state.soloLosses,
      scores: state.scores,
    };
  }

  const roles = getNextVersusRoles(state);
  return createVersusRound(state, roles.setterId, roles.guesserId);
}

export function getRoundMessage(state: HangmanState): string {
  if (state.roundWinner === null) {
    return "";
  }

  if (state.mode === "solo") {
    return state.roundWinner === state.guesserId
      ? "You solved it!"
      : `The word was "${state.word}".`;
  }

  const winner = state.players.find((player) => player.id === state.roundWinner);
  return `${winner?.name ?? "Player"} wins this round!`;
}
