import { DICTIONARY, HANGMAN_WORDS } from "./wordlist";
import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "./types";

export function normalizeWord(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidWord(input: string): boolean {
  return getWordValidationError(input) === null;
}

export function getWordValidationError(input: string): string | null {
  const word = normalizeWord(input);

  if (word.length === 0) {
    return "Enter a word.";
  }

  if (!/^[a-z]+$/.test(word)) {
    return "Use letters A–Z only.";
  }

  if (word.length < MIN_WORD_LENGTH) {
    return `Words must be at least ${MIN_WORD_LENGTH} letters.`;
  }

  if (word.length > MAX_WORD_LENGTH) {
    return `Words must be ${MAX_WORD_LENGTH} letters or fewer.`;
  }

  if (!DICTIONARY.has(word)) {
    return "That doesn't look like a real word. Check the spelling.";
  }

  return null;
}

export function getRandomWord(): string {
  const eligible = HANGMAN_WORDS.filter(
    (word) => word.length >= MIN_WORD_LENGTH && word.length <= MAX_WORD_LENGTH,
  );
  return eligible[Math.floor(Math.random() * eligible.length)];
}
