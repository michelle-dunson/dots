"use client";

import { useState } from "react";
import { getPlayer } from "@/lib/hangman/board";
import type { HangmanState } from "@/lib/hangman/types";
import styles from "./HangmanEnterWord.module.scss";

interface HangmanEnterWordProps {
  state: HangmanState;
  onSubmit: (word: string) => void;
  error: string | null;
  onClearError: () => void;
}

export function HangmanEnterWord({
  state,
  onSubmit,
  error,
  onClearError,
}: HangmanEnterWordProps) {
  const [word, setWord] = useState("");
  const setter = getPlayer(state, state.setterId);
  const guesser = getPlayer(state, state.guesserId);

  const handleSubmit = () => {
    onSubmit(word);
  };

  const handleChange = (value: string) => {
    if (error) {
      onClearError();
    }
    setWord(value.replace(/[^a-zA-Z]/g, "").toLowerCase());
  };

  return (
    <div className={styles.enterWord}>
      <p className={styles.passNotice}>
        Hand the paper to {setter?.name}
      </p>
      <p className={styles.instruction}>
        {setter?.name}, enter a secret word. {guesser?.name} should look away.
      </p>
      <input
        type="password"
        className={styles.wordInput}
        value={word}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="secret word"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={12}
      />
      <p className={styles.error}>{error ?? ""}</p>
      <button type="button" className={styles.submitButton} onClick={handleSubmit}>
        Lock In Word
      </button>
      <p className={styles.hint}>4–12 letters · dictionary words only</p>
    </div>
  );
}
