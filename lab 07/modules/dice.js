// Dice module (client-side) - fetches dice values from the server

export class Dice {
    constructor(numerOfDice = 5){
        this.numberOfDice = this.numberOfDice;
        this.values = new Array(numnerOfDice).fill(1);
        this.held = new Array(numnerOfDice).fill(false);
    }

    async roll(){
        try{
            const response = await fetch("/roll-dices");
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();
            const newValues = data.dice;

            // Keep held dice unchanged, replace others with new values
            this.values = this.values.map((v,i) => this.held[i] ? v: newValues[i]);
            return this.values;
        } catch (error) {
            console.error("Failed to roll dice:", error);
            alert("Error: Could not fetch dice from the server.");
            return this.values;
        }
    }

    toggleHold(index) {
        this.held[index] = !this.held[index];
    }

    reset(){
        this.values.fill(1);
        this.held.fill(false);
    }

    getValues(){
        return this.values;
    }
}