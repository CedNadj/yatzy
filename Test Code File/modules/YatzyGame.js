// modules/YatzyGame.js
// Main game controller — imports Dice and Engine, handles UI, turns and scoring.

import { Dice } from './Dice.js';
import { YatzyEngine } from './YatzyEngine.js';

class YatzyGame {
  constructor() {
    // modules & state
    this.dice = new Dice(5);
    this.engine = new YatzyEngine();
    this.rollCount = 0;
    this.maxRolls = 3;
    this.categories = [
      'ones','twos','threes','fours','fives','sixes',
      'onePair','twoPairs','threeKind','fourKind',
      'smallStraight','largeStraight','fullHouse','chance','yatzy'
    ];

    // DOM
    this.diceRow = document.getElementById('diceRow');
    this.rollBtn = document.getElementById('rollBtn');
    this.scoreBtn = document.getElementById('scoreBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.rollCountEl = document.getElementById('rollCount');
    this.rollLeftEl = document.getElementById('rollLeft');
    this.lastRollEl = document.getElementById('lastRoll');
    this.messageEl = document.getElementById('message');
    this.scorecard = document.getElementById('scorecard');
    this.totalEl = document.getElementById('totalScore');
    this.upperBonusEl = document.getElementById('upperBonus');

    // Bind event listeners
    this.rollBtn.addEventListener('click', () => this.onRoll());
    this.resetBtn.addEventListener('click', () => this.onEndTurn(true));
    this.scoreBtn.addEventListener('click', () => this.promptCategorySelection());

    // score cells clickable
    this.scoreCells = Array.from(document.querySelectorAll('.score-cell'));
    this.scoreCells.forEach(cell => {
      cell.addEventListener('click', (ev) => this.onScoreCellClick(ev));
    });

    this.renderAll();
  }

  // Roll handler
  onRoll() {
    if (this.rollCount >= this.maxRolls) {
      this.showMessage('No rolls left. Choose a category to score.');
      return;
    }
    // short animation: quick visual cycle
    this.animateRolling().then(() => {
      this.dice.roll();
      this.rollCount++;
      this.renderAll();
      this.showMessage('');
    });
  }

  // Simple rolling animation returns a promise that resolves after one cycle
  animateRolling() {
    return new Promise(resolve => {
      const start = Date.now();
      const duration = 450; // ms
      const interval = 60;
      const id = setInterval(() => {
        // show random faces visually
        this.renderPipsPreview();
        if (Date.now() - start > duration) {
          clearInterval(id);
          resolve();
        }
      }, interval);
    });
  }

  // Render preview while animating
  renderPipsPreview() {
    const randomFaces = Array.from({length:5},()=>Math.floor(Math.random()*6)+1);
    this.renderDice(randomFaces, true);
  }

  // Render everything: dice + status + scorecard totals
  renderAll() {
    this.renderDice(this.dice.getValues());
    this.rollCountEl.textContent = this.rollCount;
    this.rollLeftEl.textContent = this.maxRolls - this.rollCount;
    this.lastRollEl.textContent = this.dice.getValues().join(', ');
    this.renderScorecard();
    const totals = this.engine.getTotalScore();
    this.totalEl.textContent = totals.total;
    this.upperBonusEl.textContent = totals.bonus;
  }

  // Create dice DOM from a list of values. If preview=true, don't reflect held state.
  renderDice(values, preview = false) {
    this.diceRow.innerHTML = '';
    values.forEach((v, i) => {
      const die = document.createElement('div');
      die.className = 'die';
      if (!preview && this.dice.held[i]) die.classList.add('held');

      // add pips for face v
      die.innerHTML = this.getPipHTML(v);

      // toggling: only active if we've rolled at least once in this turn
      die.addEventListener('click', () => {
        if (this.rollCount === 0) { this.showMessage('Roll at least once before holding dice.'); return; }
        this.dice.toggleHold(i);
        this.renderAll();
      });
      this.diceRow.appendChild(die);
    });
  }

  // When player clicks Score button, they should click a category next.
  promptCategorySelection() {
    this.showMessage('Click an empty category on the scorecard to assign your score for this turn.');
  }

  // Score cell clicked: either preview or commit
  onScoreCellClick(ev) {
    const cell = ev.currentTarget;
    const key = cell.dataset.key;
    if (!key) return;
    if (this.engine.isFilled(key)) {
      this.showMessage('This category is already filled.');
      return;
    }
    // compute score for current dice
    const currentValues = this.dice.getValues();
    const score = this.engine.calculateScore(key, currentValues);
    // ask user to confirm (simple confirm)
    const confirmText = `Score ${score} points to "${this.readableKey(key)}"?`;
    if (!confirm(confirmText)) {
      this.showMessage('Scoring cancelled.');
      return;
    }
    // record score and end turn
    this.engine.updateScore(key, score);
    this.onEndTurn(false);
  }

  // End turn: optionally forfeit (reset dice and counts)
  onEndTurn(forfeit = false) {
    if (forfeit) {
      // if forfeit, force the user to pick a category: we'll allow forfeit to just reset dice and roll count
      this.showMessage('Turn ended. You forfeited this turn (no score assigned).');
    } else {
      this.showMessage('Score saved. Next turn.');
    }
    // reset turn state
    this.rollCount = 0;
    this.dice.reset();
    this.renderAll();

    // check game end: if all categories filled then end game
    if (this.categories.every(cat => this.engine.isFilled(cat))) {
      this.endGame();
    }
  }

  endGame() {
    const totals = this.engine.getTotalScore();
    alert(`Game over! Final score: ${totals.total}\nUpper sum: ${totals.upperSum} (bonus ${totals.bonus})`);
    this.showMessage('Game over! You can refresh to play again.');
    // freeze UI: disable roll button
    this.rollBtn.disabled = true;
  }

  // update scorecard HTML cells
  renderScorecard() {
    this.scoreCells.forEach(cell => {
      const key = cell.dataset.key;
      if (!key) return;
      if (this.engine.isFilled(key)) {
        cell.textContent = this.engine.scoreTable[key];
        cell.classList.add('filled');
        cell.style.opacity = '0.7';
      } else {
        // show preview value (how many points it'd be now)
        const val = this.engine.calculateScore(key, this.dice.getValues());
        cell.textContent = val;
        cell.style.opacity = '0.6';
      }
    });
  }

  readableKey(k) {
    return k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  showMessage(text) {
    this.messageEl.textContent = text || '';
  }

  // pip layout helper
  getPipHTML(value) {
    const layout = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
    };
    return layout[value].map(pos => `<span class="pip ${pos}"></span>`).join('');
  }
}

// Initialize game after DOM content loaded
window.addEventListener('DOMContentLoaded', () => {
  // Guard: confirm DOM elements exist
  if (!document.getElementById('diceRow')) {
    console.error('Missing required HTML elements. Ensure index.html matches the provided template.');
    return;
  }
  new YatzyGame();
});
