"use client";

import { getDisplayWord } from "@/lib/hangman/board";
import { HangmanGallows } from "@/components/HangmanGallows/HangmanGallows";
import type { HangmanState } from "@/lib/hangman/types";
import styles from "./HangmanBoard.module.scss";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

interface HangmanBoardProps {
  state: HangmanState;
  onGuess: (letter: string) => void;
}

export function HangmanBoard({ state, onGuess }: HangmanBoardProps) {
  const wrongLetters = state.guessedLetters.filter(
    (letter) => !state.word.includes(letter),
  );

  return (
    <div className={styles.board}>
      <HangmanGallows wrongGuesses={state.wrongGuesses} />
      <p className={styles.wordDisplay}>{getDisplayWord(state)}</p>
      <p className={styles.wrongLetters}>
        {wrongLetters.length > 0
          ? `Wrong: ${wrongLetters.map((l) => l.toUpperCase()).join(", ")}`
          : ""}
      </p>
      <div className={styles.keyboard}>
        {ALPHABET.map((letter) => {
          const guessed = state.guessedLetters.includes(letter);
          const isCorrect = guessed && state.word.includes(letter);
          const isWrong = guessed && !state.word.includes(letter);

          return (
            <button
              key={letter}
              type="button"
              className={`${styles.key} ${
                isCorrect ? styles.correct : isWrong ? styles.wrong : ""
              }`}
              onClick={() => onGuess(letter)}
              disabled={guessed || state.phase !== "guessing"}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
