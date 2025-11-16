import { randomDice } from "./utils.js";
import { calculateScore } from "./scoring.js";

class YatzyGameState {
    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.dice = [1, 1, 1, 1, 1];
        this.held = [false, false, false, false, false];
        this.rollCount = 0;
        this.maxRolls = 3;
        this.scoreTable = {};
        this.currentTurn = 0;
        this.gameOver = false;
        this.categories = [
            'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
            'onePair', 'twoPairs', 'threeKind', 'fourKind',
            'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yatzy'
        ];
    }

    // Create new game
    createGame() {
        this.resetGame();
        return this.getState();
    }

    // Roll dice - server-side logic
    rollDice() {
        if (this.gameOver) {
            return { error: "Game is over" };
        }
        
        if (this.rollCount >= this.maxRolls) {
            return { error: "No rolls left. Choose a category to score." };
        }

        // Generate new dice values for non-held dice
        const newValues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
        
        this.dice = this.dice.map((v, i) => this.held[i] ? v : newValues[i]);
        this.rollCount++;
        this.currentTurn++;
        
        return {
            success: true,
            dice: this.dice,
            rollCount: this.rollCount,
            rollsLeft: this.maxRolls - this.rollCount,
            held: this.held
        };
    }

    // Toggle hold state
    toggleHold(index) {
        if (this.gameOver) {
            return { error: "Game is over" };
        }
        
        if (index >= 0 && index < 5) {
            this.held[index] = !this.held[index];
        }
        return {
            success: true,
            held: this.held,
            dice: this.dice
        };
    }

    // Reset hold states
    resetHold() {
        this.held.fill(false);
        return { success: true, held: this.held };
    }

    // Calculate score for a category
    calculateScore(category, diceValues = this.dice) {
        const c = this.counts(diceValues);
        const total = this.sumAll(diceValues);

        switch (category) {
            case 'ones': return (c[1] || 0) * 1;
            case 'twos': return (c[2] || 0) * 2;
            case 'threes': return (c[3] || 0) * 3;
            case 'fours': return (c[4] || 0) * 4;
            case 'fives': return (c[5] || 0) * 5;
            case 'sixes': return (c[6] || 0) * 6;
            case 'onePair': {
                for (let v = 6; v >= 1; v--) if (c[v] >= 2) return v * 2;
                return 0;
            }
            case 'twoPairs': {
                const pairs = [];
                for (let v = 6; v >= 1; v--) if (c[v] >= 2) pairs.push(v);
                if (pairs.length >= 2) return pairs[0] * 2 + pairs[1] * 2;
                return 0;
            }
            case 'threeKind': {
                for (let v = 6; v >= 1; v--) if (c[v] >= 3) return v * 3;
                return 0;
            }
            case 'fourKind': {
                for (let v = 6; v >= 1; v--) if (c[v] >= 4) return v * 4;
                return 0;
            }
            case 'smallStraight': {
                return (c[1] && c[2] && c[3] && c[4] && c[5]) ? 15 : 0;
            }
            case 'largeStraight': {
                return (c[2] && c[3] && c[4] && c[5] && c[6]) ? 20 : 0;
            }
            case 'fullHouse': {
                const has3 = c.some(v => v === 3);
                const has2 = c.some(v => v === 2);
                if (has3 && has2) return total;
                return 0;
            }
            case 'chance': return total;
            case 'yatzy': return c.some(v => v === 5) ? 50 : 0;
            default: return 0;
        }
    }

    // Score a category
    scoreCategory(category) {
        if (this.gameOver) {
            return { error: "Game is over" };
        }
        
        if (this.rollCount === 0) {
            return { error: "Roll the dice before scoring" };
        }

        if (this.scoreTable[category] !== undefined) {
            return { error: "Category already filled" };
        }

        const score = this.calculateScore(category);
        this.scoreTable[category] = score;

        // Reset for next turn
        this.rollCount = 0;
        this.held.fill(false);
        this.dice = [1, 1, 1, 1, 1];

        // Check if game is over
        const allFilled = this.categories.every(cat => this.scoreTable.hasOwnProperty(cat));
        if (allFilled) {
            this.gameOver = true;
        }

        return {
            success: true,
            score,
            category,
            totalScore: this.getTotalScore(),
            gameOver: this.gameOver,
            filledCategories: Object.keys(this.scoreTable).length
        };
    }

    // Get total score with bonus calculation
    getTotalScore() {
        const sum = Object.values(this.scoreTable).reduce((a, b) => a + b, 0);
        const upperSum = ['ones','twos','threes','fours','fives','sixes']
            .reduce((s, k) => s + (this.scoreTable[k] || 0), 0);
        const bonus = upperSum >= 63 ? 50 : 0;
        return { 
            total: sum + bonus, 
            upperSum, 
            bonus,
            lowerSum: sum - upperSum
        };
    }

    // Get current game state
    getState() {
        return {
            dice: this.dice,
            held: this.held,
            rollCount: this.rollCount,
            maxRolls: this.maxRolls,
            scoreTable: this.scoreTable,
            totalScore: this.getTotalScore(),
            gameOver: this.gameOver,
            currentTurn: this.currentTurn,
            categories: this.categories
        };
    }

    // Helper functions
    counts(diceValues) {
        const c = [0, 0, 0, 0, 0, 0, 0];
        diceValues.forEach(d => (c[d] = (c[d] || 0) + 1));
        return c;
    }

    sumAll(dice) {
        return dice.reduce((a, b) => a + b, 0);
    }
}

// Create singleton instance
const gameState = new YatzyGameState();

// Export functions that use the singleton
export function createGame() {
    return gameState.createGame();
}

export function rollDice() {
    return gameState.rollDice();
}

export function toggleHold(index) {
    return gameState.toggleHold(index);
}

export function resetHold() {
    return gameState.resetHold();
}

export function calculateScore(category) {
    return gameState.calculateScore(category);
}

export function scoreCategory(category) {
    return gameState.scoreCategory(category);
}

export function getState() {
    return gameState.getState();
}

export function getTotalScore() {
    return gameState.getTotalScore();
}