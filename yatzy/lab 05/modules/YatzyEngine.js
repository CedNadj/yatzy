// Responsible for scoring and validation rules

export class YatzyEngine {
    constructor() {
        this.scoreTable = {};
    }

    calcuateScore(category, diceValues) {
        console.log(`Calculating ${category}:`, diceValues);
        return 0;
    }

    isValidSelection(category, diceValues) {
        console.log(`Validating ${category}:`, diceValues);
        return true;
    }

    updateScore(category, score) {
        this.scoreTable[category] = score;
    }

    getTotalSocre() {
        return Object.values(this.scoreTable).reduce((a, b) => a + b, 0);
    }
}