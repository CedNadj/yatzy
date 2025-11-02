import { randomDice } from "./utils.js";
import { calculateScore } from "./scoring.js";

let state = {};

export function createGame() {
  state = {
    dice: [1,1,1,1,1],
    held: [false,false,false,false,false],
    rollCount: 0,
    maxRolls: 3,
    scores: {},
    finished: false
  };
  return state;
}

export function rollDice() {
  if (state.rollCount >= state.maxRolls) return state;
  state.dice = state.dice.map((v,i)=>
      state.held[i] ? v : randomDice());
  state.rollCount++;
  return state;
}

export function scoreCategory(category) {
  const value = calculateScore(category, state.dice);
  state.scores[category] = value;
  state.rollCount = 0;
  state.held = [false,false,false,false,false];
  if (Object.keys(state.scores).length >= 15) state.finished = true;
  return { ...state, lastScore: { category, value } };
}

export function getState() {
  return state;
}
