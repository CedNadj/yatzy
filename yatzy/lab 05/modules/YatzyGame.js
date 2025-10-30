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
        this.initUI();
    }

    // This initilaize UI connections
    initUI(){
        this.diceRow = document.getElementById('diceRow');
        this.rollBtn = document.getElementById('rollBtn');
        this.resetBtn = document.getElementById('resetTurn');
        this.rollCountEl = document.getElementById('rollCount');
        this.rollLeftEl = document.getElementById('rollLeft');
        this.lastRollText = document.getElementById('lastRollText');

        // This attach to the button handlers
        this.rollBtn.addEventListener('click', () => this.rollDice());
        this.resetBtn.addEventListener('click', () => this.endTurn());

        // First draw
        this.rednerDice();
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

    // It draws the dice visually
    renderDice(){
        const values = this.dice.getValues();
        this.diceRow.innerHTML = '';
        values.forEach((value, index) =>{
            const die = document.createElement('div');
            die.classList.add('die');
            if(this.dice.held[index]) die.classList.add('held');
            die.innerHTML = this.getPipHTML(value);
            die.addEventListener('click', () =>{
                if (this.rollCount > 0){
                    this.dice.toggleHold(index);
                    this.renderDice();
                }
            });
            this.diceRow.appendChild(die);
        });
    }

    //This updates the UI labels
    updateUI(){
        this.rollCountEl.textContent = this.rollCount;
        this.rollLeftEl.textContent = this.maxRolls - this.rollCount;
        this.lastRollText.textContent = this.dice.getValues().join(', ');
    }

    // This generates a pip layout for a dice face
    getPipHTML(value){
        const layout = {
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
        };

        return layount[value]
        .map(pos => `<span class="pip ${pos}"></span>`)
        .join('');
    }
}

// This will auto-run the game once HTML is loaded
window.addEventListener('DOMContentLoaded', () => new YatzyGame());