// modules/YatzyGame.js
// Main controller — connects UI to Dice and Engine

import { Dice } from './Dice.js';
import { YatzyEngine } from './YatzyEngine.js';

class YatzyGame {
  constructor() {
    this.dice = new Dice(5);
    this.engine = new YatzyEngine();
    this.rollCount = 0;
    this.maxRolls = 3;
    this.initUI();
  }

  initUI() {
    this.diceRow = document.getElementById('diceRow');
    this.rollBtn = document.getElementById('rollBtn');
    this.resetBtn = document.getElementById('resetTurn');
    this.rollCountEl = document.getElementById('rollCount');
    this.rollLeftEl = document.getElementById('rollLeft');
    this.lastRollText = document.getElementById('lastRollText');

    this.rollBtn.addEventListener('click', () => this.rollDice());
    this.resetBtn.addEventListener('click', () => this.endTurn());

    this.renderDice();
    this.updateUI();
  }

  rollDice() {
    if (this.rollCount >= this.maxRolls) return;
    this.rollCount++;
    this.dice.roll();
    this.renderDice();
    this.updateUI();
  }

  endTurn() {
    this.rollCount = 0;
    this.dice.reset();
    this.renderDice();
    this.updateUI();
  }

  renderDice() {
    const values = this.dice.getValues();
    this.diceRow.innerHTML = '';

    values.forEach((value, i) => {
      const die = document.createElement('div');
      die.classList.add('die');
      if (this.dice.held[i]) die.classList.add('held');
      die.innerHTML = this.getPipHTML(value);
      die.addEventListener('click', () => {
        if (this.rollCount > 0) {
          this.dice.toggleHold(i);
          this.renderDice();
        }
      });
      this.diceRow.appendChild(die);
    });
  }

  updateUI() {
    this.rollCountEl.textContent = this.rollCount;
    this.rollLeftEl.textContent = this.maxRolls - this.rollCount;
    this.lastRollText.textContent = this.dice.getValues().join(', ');
  }

  getPipHTML(value) {
    const layout = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    return layout[value]
      .map(pos => `<span class="pip ${pos}"></span>`)
      .join('');
  }
}

window.addEventListener('DOMContentLoaded', () => new YatzyGame());
