import styles from "./HangmanGallows.module.scss";

interface HangmanGallowsProps {
  wrongGuesses: number;
}

export function HangmanGallows({ wrongGuesses }: HangmanGallowsProps) {
  const show = (stage: number) => wrongGuesses >= stage;

  return (
    <svg
      className={styles.gallows}
      viewBox="0 0 200 220"
      aria-hidden="true"
    >
      <line x1="20" y1="210" x2="180" y2="210" stroke="#2c2416" strokeWidth="3" />
      <line x1="50" y1="210" x2="50" y2="20" stroke="#2c2416" strokeWidth="3" />
      <line x1="50" y1="20" x2="120" y2="20" stroke="#2c2416" strokeWidth="3" />
      <line x1="120" y1="20" x2="120" y2="45" stroke="#2c2416" strokeWidth="3" />

      {show(1) && (
        <circle
          className={`${styles.part} ${styles.head}`}
          cx="120"
          cy="65"
          r="20"
        />
      )}
      {show(2) && (
        <line className={styles.part} x1="120" y1="85" x2="120" y2="140" />
      )}
      {show(3) && (
        <line className={styles.part} x1="120" y1="100" x2="90" y2="120" />
      )}
      {show(4) && (
        <line className={styles.part} x1="120" y1="100" x2="150" y2="120" />
      )}
      {show(5) && (
        <line className={styles.part} x1="120" y1="140" x2="95" y2="180" />
      )}
      {show(6) && (
        <line className={styles.part} x1="120" y1="140" x2="145" y2="180" />
      )}
    </svg>
  );
}
