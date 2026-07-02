import { describe, expect, it } from "vitest";
import { getAIMove } from "./ai";
import { createInitialState, createPlayers, getValidEdges } from "./board";
import { applyMove, getWinner, isSafeMove, wouldCompleteSquare } from "./rules";
import { makeEdgeId } from "./types";

describe("applyMove", () => {
  const players = createPlayers(2, ["Alice", "Bob"]);
  const state = createInitialState(players);

  it("rejects already drawn edges", () => {
    const edge = makeEdgeId("h", 0, 0);
    const afterFirst = applyMove(state, edge);
    const afterSecond = applyMove(afterFirst.state, edge);
    expect(afterSecond.invalid).toBe(true);
  });

  it("alternates turns when no square is completed", () => {
    const edge = makeEdgeId("h", 0, 0);
    const result = applyMove(state, edge);
    expect(result.extraTurn).toBe(false);
    expect(result.state.currentPlayer).toBe(1);
  });

  it("grants extra turn when a square is completed", () => {
    let current = state;
    current = applyMove(current, makeEdgeId("h", 0, 0)).state;
    current = applyMove(current, makeEdgeId("v", 0, 0)).state;
    current = applyMove(current, makeEdgeId("h", 1, 0)).state;

    const result = applyMove(current, makeEdgeId("v", 0, 1));
    expect(result.extraTurn).toBe(true);
    expect(result.claimedSquares).toEqual(["0:0"]);
    expect(result.state.scores[1]).toBe(1);
    expect(result.state.currentPlayer).toBe(1);
  });

  it("ends game when all squares are filled", () => {
    let current = state;
    const edges = getValidEdges(state);

    for (const edge of edges) {
      if (current.phase === "finished") break;
      const result = applyMove(current, edge);
      if (!result.invalid) {
        current = result.state;
      }
    }

    expect(current.phase).toBe("finished");
    expect(Object.keys(current.squares).length).toBe(36);
  });
});

describe("getWinner", () => {
  it("detects ties", () => {
    const players = createPlayers(2, ["A", "B"]);
    const state = createInitialState(players);
    state.scores[0] = 18;
    state.scores[1] = 18;
    state.phase = "finished";

    const result = getWinner(state);
    expect(result.isTie).toBe(true);
    expect(result.winners).toHaveLength(2);
  });
});

describe("AI", () => {
  it("always returns a valid edge", () => {
    const players = createPlayers(1, ["Human"]);
    const state = createInitialState(players);
    const move = getAIMove(state);
    expect(move).not.toBeNull();
    expect(getValidEdges(state)).toContain(move);
  });

  it("takes a square when available", () => {
    const players = createPlayers(1, ["Human"]);
    let state = createInitialState(players);
    state = applyMove(state, makeEdgeId("h", 0, 0)).state;
    state = applyMove(state, makeEdgeId("v", 0, 0)).state;
    state = applyMove(state, makeEdgeId("h", 1, 0)).state;

    const move = getAIMove(state);
    expect(wouldCompleteSquare(state, move!)).toBe(true);
  });

  it("prefers safe moves early in the game", () => {
    const players = createPlayers(1, ["Human"]);
    const state = createInitialState(players);
    const move = getAIMove(state);
    expect(isSafeMove(state, move!)).toBe(true);
  });
});
