import { getRandomWord } from "./dictionary";
import {
  MAX_WRONG_GUESSES,
  PLAYER_COLORS,
  type GameMode,
  type HangmanPhase,
  type HangmanState,
  type PlayerConfig,
  type PlayerId,
} from "./types";

export function createPlayers(
  mode: GameMode,
  names: string[],
): PlayerConfig[] {
  if (mode === "solo") {
    return [
      {
        id: 0,
        name: names[0] || "You",
        color: PLAYER_COLORS[0],
        isHuman: true,
      },
      {
        id: 1,
        name: "Puzzle",
        color: PLAYER_COLORS[1],
        isHuman: false,
      },
    ];
  }

  return [
    {
      id: 0,
      name: names[0] || "Player 1",
      color: PLAYER_COLORS[0],
      isHuman: true,
    },
    {
      id: 1,
      name: names[1] || "Player 2",
      color: PLAYER_COLORS[1],
      isHuman: true,
    },
  ];
}

export function createSession(
  mode: GameMode,
  players: PlayerConfig[],
): HangmanState {
  const scores = { 0: 0, 1: 0 } as Record<PlayerId, number>;

  if (mode === "solo") {
    return {
      mode,
      players,
      scores,
      word: getRandomWord(),
      guessedLetters: [],
      wrongGuesses: 0,
      maxWrongGuesses: MAX_WRONG_GUESSES,
      phase: "guessing",
      setterId: 1,
      guesserId: 0,
      roundWinner: null,
      soloWins: 0,
      soloLosses: 0,
    };
  }

  return {
    mode,
    players,
    scores,
    word: "",
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: MAX_WRONG_GUESSES,
    phase: "enter-word",
    setterId: 0,
    guesserId: 1,
    roundWinner: null,
    soloWins: 0,
    soloLosses: 0,
  };
}

export function getPlayer(
  state: HangmanState,
  playerId: PlayerId,
): PlayerConfig | undefined {
  return state.players.find((player) => player.id === playerId);
}

export function getDisplayWord(state: HangmanState): string {
  return state.word
    .split("")
    .map((letter) =>
      state.guessedLetters.includes(letter) ? letter.toUpperCase() : "_",
    )
    .join(" ");
}

export function isWordComplete(state: HangmanState): boolean {
  return state.word
    .split("")
    .every((letter) => state.guessedLetters.includes(letter));
}

export function getOppositePlayer(playerId: PlayerId): PlayerId {
  return playerId === 0 ? 1 : 0;
}

export function getNextVersusRoles(state: HangmanState): {
  setterId: PlayerId;
  guesserId: PlayerId;
} {
  return {
    setterId: getOppositePlayer(state.setterId),
    guesserId: getOppositePlayer(state.guesserId),
  };
}

export function createSoloRound(state: HangmanState): HangmanState {
  return {
    ...state,
    word: getRandomWord(),
    guessedLetters: [],
    wrongGuesses: 0,
    phase: "guessing",
    roundWinner: null,
  };
}

export function createVersusRound(
  state: HangmanState,
  setterId: PlayerId,
  guesserId: PlayerId,
): HangmanState {
  return {
    ...state,
    word: "",
    guessedLetters: [],
    wrongGuesses: 0,
    phase: "enter-word",
    setterId,
    guesserId,
    roundWinner: null,
  };
}

export function startVersusGuessing(
  state: HangmanState,
  word: string,
): HangmanState {
  return {
    ...state,
    word,
    guessedLetters: [],
    wrongGuesses: 0,
    phase: "guessing",
    roundWinner: null,
  };
}

export function getPhaseLabel(state: HangmanState): HangmanPhase {
  return state.phase;
}
