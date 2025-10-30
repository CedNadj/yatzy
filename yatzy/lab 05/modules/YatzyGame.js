// Central game manager that connexts UI, dice, and engine

import {Dice} from './Dice.js';
import { YatzyEngine } from './YatzyEngine.js';

export class YatzyGame {
    constructor() {
        this.dice = new Dice(5);         // Create a Dice instance
        this.engine = new YatzyEngine(); // Create a scoring engine
        this.rollCount = 0;              // Number of rolls in current turn
        this.maxRolls = 3;               // Max rolls per turn
        this.isGameOver = false;         // Tracks if the game ended
    }

    startNewGame() {
        this.rollCount = 0;
        this.dice.reset();
        this.engine.scoreTable = {};
        this.isGameOver = false;
    }

    rollDice() {
        if (this.rollCount >= this.maxRolls) return;
        this.rollCount++;
        return this.dice.roll();
    }

    endTurn() {
        this.rollCount = 0;
        this.dice.held.fill(false);
    }

    getDiceValues() {
        return this.dice.values;
    }
}

const game = new YatzyGame();

// DOM references
const diceRow = document.getElementById('diceRow');
const rollBtn = document.getElementById('rollBtn');
const resetBtn = document.getElementById('resetTurn');
const rollCountEl = document.getElementById('rollCount');
const rollLeftEl = document.getElementById('rollLeft');
const lastRollText = document.getElementById('lastRollText');

// Initial render
renderDice(game.getDiceValues());

// Event handlers
rollBtn.addEventListener('click', () => {
    const results = game.rollDice();
    renderDice(results);
    rollLeftEl.textContent = game.rollCount;
    rollLeftEl.textContent = game.maxRolls - game.rollCount;
    lastRollText.textContent = results.join(', ');
});

resetBtn.addEventListener('click', () => {
    game.endTurn();
    renderDice(game.getDiceValues());
    rollCountEl.textContent = 0;
    rollLeftEl.textContent = game.maxRolls;
    lastRollText.textContent = '-';
});

// Renders the dice visually
function renderDice(values){
    diceRow.innerHTML = '';
    values.forEach((value, i) => {
        const die = document.createElement('div');
        die.classList.add('die', `face-${value}`);
        die.addEventListener('click', () => game.dice.toggleHold(i));
        die.innerHTML = getPipHTML(value);
        if (game.dice.held[i]) die.classList.add('held');
        diceRow.appendChild(die);
    });
}

function getPipHTML(value) {
  const pips = {
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };
  return pips[value]
    .map(pos => `<span class="pip ${pos}"></span>`)
    .join('');
}