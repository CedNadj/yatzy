// Dice module — encapsulates dice values and holds

export class Dice {
  constructor(numberOfDice = 5) {
    this.numberOfDice = numberOfDice;
    this.values = new Array(numberOfDice).fill(1);
    this.held = new Array(numberOfDice).fill(false);
  }

  // roll unheld dice
  roll() {
    this.values = this.values.map((v, i) =>
      this.held[i] ? v : Math.floor(Math.random() * 6) + 1
    );
    return this.values;
  }

  toggleHold(index) {
    if (index < 0 || index >= this.numberOfDice) return;
    this.held[index] = !this.held[index];
  }

  reset() {
    this.values.fill(1);
    this.held.fill(false);
  }

  getValues() {
    return this.values.slice();
  }
}
