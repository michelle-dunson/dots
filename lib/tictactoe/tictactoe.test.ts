import { describe, expect, it } from "vitest";
import { getAIMove } from "./ai";
import { createInitialState, createPlayers, getValidMoves } from "./board";
import { applyMove, checkWinner } from "./rules";

describe("tic-tac-toe applyMove", () => {
  const players = createPlayers(false, ["Alice", "Bob"]);
  const state = createInitialState(players);

  it("rejects occupied cells", () => {
    const first = applyMove(state.board, 0, 0);
    const second = applyMove(first.board, 1, 0);
    expect(second.invalid).toBe(true);
  });

  it("detects a winner", () => {
    let board = state.board;
    let current: 0 | 1 = 0;

    const moves: Array<[0 | 1, number]> = [
      [0, 0],
      [1, 3],
      [0, 1],
      [1, 4],
      [0, 2],
    ];

    for (const [player, cell] of moves) {
      const result = applyMove(board, current, cell);
      board = result.board;
      current = result.currentPlayer;
      if (result.phase === "finished") {
        expect(result.result).toBe(0);
        expect(checkWinner(board)).toBe(0);
        return;
      }
      expect(player).toBe(current === 0 ? 1 : 0);
    }
  });

  it("detects a tie", () => {
    let board = state.board;
    let current: 0 | 1 = 0;

    const sequence = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const cell of sequence) {
      const result = applyMove(board, current, cell);
      board = result.board;
      current = result.currentPlayer;
    }

    expect(checkWinner(board)).toBe("tie");
  });
});

describe("tic-tac-toe AI", () => {
  it("blocks an immediate win", () => {
    const board = [
      0, 0, null,
      null, 1, null,
      null, null, null,
    ] as const;

    const move = getAIMove([...board], 1);
    expect(move).toBe(2);
  });

  it("takes a winning move", () => {
    const board = [
      0, 0, null,
      1, 1, null,
      null, null, null,
    ] as const;

    const move = getAIMove([...board], 0);
    expect(move).toBe(2);
  });

  it("returns a valid move", () => {
    const players = createPlayers(true, ["Human"]);
    const state = createInitialState(players);
    const move = getAIMove(state.board, 1);
    expect(move).not.toBeNull();
    expect(getValidMoves(state.board)).toContain(move);
  });

  it("optimal opponents always tie", () => {
    let state = createInitialState(createPlayers(true, ["Human"]));

    while (state.phase === "playing") {
      const move = getAIMove(state.board, state.currentPlayer)!;
      const result = applyMove(state.board, state.currentPlayer, move);
      state = {
        ...state,
        board: result.board,
        currentPlayer: result.currentPlayer,
        phase: result.phase,
        result: result.result,
      };
    }

    expect(state.result).toBe("tie");
  });

  it("wins most games against random opponents", () => {
    const wins = { human: 0, ai: 0, tie: 0 };

    for (let game = 0; game < 200; game++) {
      let state = createInitialState(createPlayers(true, ["Human"]));

      while (state.phase === "playing") {
        const moves = getValidMoves(state.board);
        const move =
          state.currentPlayer === 0
            ? moves[Math.floor(Math.random() * moves.length)]
            : getAIMove(state.board, 1)!;
        const result = applyMove(state.board, state.currentPlayer, move);
        state = {
          ...state,
          board: result.board,
          currentPlayer: result.currentPlayer,
          phase: result.phase,
          result: result.result,
        };
      }

      if (state.result === 0) {
        wins.human++;
      } else if (state.result === 1) {
        wins.ai++;
      } else {
        wins.tie++;
      }
    }

    expect(wins.ai + wins.tie).toBeGreaterThan(wins.human);
  });
});
