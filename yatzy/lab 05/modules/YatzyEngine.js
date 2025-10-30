// Responsible for scoring and validation rules

export class YatzyEngine {
    constructor() {
        this.scoreTable = {}; // Just stores all player scores by category
    }
    // Placeholder: calculates a score for a category
    calcuateScore(category, diceValues) {
        console.log(`Calculating ${category}:`, diceValues);
        return 0;
    }
    // It checks if the chosen category fits the dice roll
    isValidSelection(category, diceValues) {
        console.log(`Validating ${category}:`, diceValues);
        return true;
    }
    // It saves the calculated score to the table
    updateScore(category, score) {
        this.scoreTable[category] = score;
    }
    // It adds up all saved scores to get a total
    getTotalSocre() {
        return Object.values(this.scoreTable).reduce((a, b) => a + b, 0);
    }
}