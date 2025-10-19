// Central game manager that connexts UI, dice, and engine

import {Dice} from './Dice.js';
import { YatzyEngine } from './YatzyEngine.js';

export class YatzyGame {
    constructor() {
        this.dice = new Dice(5);
        this.engine = new YatzyEngine();
        this.rollCount = 0;
        this.maxRolls = 3;
        this.isGameOver = false;
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