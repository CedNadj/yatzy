// Handles dice state and rolling

export class Dice {
    constructor(numberOfDice = 5) {
        this.numberOfDice = numberOfDice; // Just how many dice the user use
        this.values = new Array(numberOfDice).fill(1); // Stores dice numbers
        this.held = new Array(numberOfDice).fill(false); // Stores if a die is held
    }

    roll() {
        // If each dies isn't held, it will give a random number 1-6
        this.values = this.values.map((v, i) => 
            this.held[i] ? v : Math.floor(Math.random() * 6) + 1);
        return this.values;
    }
    // When a player clicks a die, it flip its held status
    toggleHold(index) {
        this.held[index] = !this.held[index];
    }
    // It returns the dice values as an array
    getValues(){
        return this.values;
    }

    reset() {
        // It set all dice back to face 1 and un-hold them (start of a new game)
        this.values.fill(1);
        this.held.fill(false);
    }
}