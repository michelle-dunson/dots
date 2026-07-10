import { describe, expect, it } from "vitest";
import { createSession } from "./board";
import {
  getRandomWord,
  getWordValidationError,
  isValidWord,
  normalizeWord,
} from "./dictionary";
import { guessLetter, startNextRound, submitWord } from "./rules";
import { DICTIONARY } from "./wordlist";

describe("hangman dictionary", () => {
  it("accepts real dictionary words", () => {
    expect(isValidWord("apple")).toBe(true);
    expect(isValidWord("HELLO")).toBe(true);
    expect(isValidWord("  piano  ")).toBe(true);
  });

  it("rejects misspelled words", () => {
    expect(isValidWord("appl")).toBe(false);
    expect(isValidWord("pianoo")).toBe(false);
    expect(isValidWord("xyzabc")).toBe(false);
  });

  it("rejects invalid characters and lengths", () => {
    expect(getWordValidationError("abc")).toContain("at least");
    expect(getWordValidationError("he!!o")).toContain("letters");
    expect(getWordValidationError("hello123")).toContain("letters");
    expect(getWordValidationError("supercalifrag")).toContain("or fewer");
    expect(getWordValidationError("zzzzz")).toContain("real word");
  });

  it("picks random words at least four letters long", () => {
    const word = getRandomWord();
    expect(DICTIONARY.has(word)).toBe(true);
    expect(word.length).toBeGreaterThanOrEqual(4);
  });

  it("rejects three-letter dictionary words", () => {
    expect(isValidWord("dog")).toBe(false);
    expect(getWordValidationError("dog")).toContain("at least");
  });

  it("normalizes words", () => {
    expect(normalizeWord(" Hello ")).toBe("hello");
  });
});

describe("hangman rules", () => {
  it("tracks correct and incorrect guesses in solo play", () => {
    let state = createSession("solo", [
      { id: 0, name: "You", color: "#c0392b", isHuman: true },
      { id: 1, name: "Puzzle", color: "#2980b9", isHuman: false },
    ]);
    state = { ...state, word: "bear" };

    const wrong = guessLetter(state, "z");
    expect(wrong.isCorrect).toBe(false);
    expect(wrong.state.wrongGuesses).toBe(1);

    const right = guessLetter(wrong.state, "b");
    expect(right.isCorrect).toBe(true);
    expect(right.state.guessedLetters).toContain("b");
  });

  it("awards the round to the guesser when the word is solved", () => {
    let state = createSession("versus", [
      { id: 0, name: "A", color: "#c0392b", isHuman: true },
      { id: 1, name: "B", color: "#2980b9", isHuman: true },
    ]);
    state = submitWord(state, "word").state;

    state = guessLetter(state, "w").state;
    state = guessLetter(state, "o").state;
    state = guessLetter(state, "r").state;
    const final = guessLetter(state, "d").state;

    expect(final.phase).toBe("round-over");
    expect(final.roundWinner).toBe(1);
    expect(final.scores[1]).toBe(1);
  });

  it("awards the round to the setter when guesses run out", () => {
    let state = createSession("versus", [
      { id: 0, name: "A", color: "#c0392b", isHuman: true },
      { id: 1, name: "B", color: "#2980b9", isHuman: true },
    ]);
    state = submitWord(state, "word").state;

    const wrongLetters = ["a", "e", "i", "f", "h", "j"];
    for (const letter of wrongLetters) {
      state = guessLetter(state, letter).state;
    }

    expect(state.phase).toBe("round-over");
    expect(state.roundWinner).toBe(0);
    expect(state.scores[0]).toBe(1);
  });

  it("alternates setter and guesser between rounds", () => {
    let state = createSession("versus", [
      { id: 0, name: "A", color: "#c0392b", isHuman: true },
      { id: 1, name: "B", color: "#2980b9", isHuman: true },
    ]);
    state = submitWord(state, "word").state;
    state = guessLetter(state, "w").state;
    state = guessLetter(state, "o").state;
    state = guessLetter(state, "r").state;
    state = guessLetter(state, "d").state;

    const next = startNextRound(state);
    expect(next.phase).toBe("enter-word");
    expect(next.setterId).toBe(1);
    expect(next.guesserId).toBe(0);
  });
});
