// modules/YatzyEngine.js
// Placeholder for future scoring logic

export class YatzyEngine {
  constructor() {
    this.scoreTable = {};
  }

  calculateScore(category, diceValues) {
    console.log(`Calculating score for ${category}:`, diceValues);
    return 0;
  }

  updateScore(category, score) {
    this.scoreTable[category] = score;
  }

  getTotalScore() {
    return Object.values(this.scoreTable).reduce((a, b) => a + b, 0);
  }
}
