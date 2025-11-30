// gameLogic.js - Server-side game logic
class Scoring {
    calculateScore(category, dice) {
        const counts = this.getDiceCounts(dice);

        switch(category) {
            case 'ones': return counts[0] * 1;
            case 'twos': return counts[1] * 2;
            case 'threes': return counts[2] * 3;
            case 'fours': return counts[3] * 4;
            case 'fives': return counts[4] * 5;
            case 'sixes': return counts[5] * 6;
            case 'onePair': return this.calculateOnePair(counts);
            case 'twoPairs': return this.calculateTwoPairs(counts);
            case 'threeKind': return this.calculateThreeOfAKind(counts);
            case 'fourKind': return this.calculateFourOfAKind(counts);
            case 'smallStraight': return this.calculateSmallStraight(counts);
            case 'largeStraight': return this.calculateLargeStraight(counts);
            case 'fullHouse': return this.calculateFullHouse(counts, dice);
            case 'chance': return this.calculateChance(dice);
            case 'yatzy': return this.calculateYatzy(counts);
            default: return 0;
        }
    }

    getDiceCounts(dice) {
        const counts = [0, 0, 0, 0, 0, 0];
        dice.forEach(die => {
            if (die >= 1 && die <= 6) {
                counts[die - 1]++;
            }
        });
        return counts;
    }

    calculateOnePair(counts) {
        for (let i = 5; i >= 0; i--) {
            if (counts[i] >= 2) return (i + 1) * 2;
        }
        return 0;
    }

    calculateTwoPairs(counts) {
        let pairs = [];
        for (let i = 5; i >= 0; i--) {
            if (counts[i] >= 2) pairs.push(i + 1);
        }
        return pairs.length >= 2 ? (pairs[0] * 2) + (pairs[1] * 2) : 0;
    }

    calculateThreeOfAKind(counts) {
        for (let i = 5; i >= 0; i--) {
            if (counts[i] >= 3) return (i + 1) * 3;
        }
        return 0;
    }

    calculateFourOfAKind(counts) {
        for (let i = 5; i >= 0; i--) {
            if (counts[i] >= 4) return (i + 1) * 4;
        }
        return 0;
    }

    calculateSmallStraight(counts) {
        return (counts[0] && counts[1] && counts[2] && counts[3] && counts[4]) ? 15 : 0;
    }

    calculateLargeStraight(counts) {
        return (counts[1] && counts[2] && counts[3] && counts[4] && counts[5]) ? 20 : 0;
    }

    calculateFullHouse(counts, dice) {
        let hasThree = false, hasTwo = false;
        for (let i = 0; i < 6; i++) {
            if (counts[i] === 3) hasThree = true;
            if (counts[i] === 2) hasTwo = true;
        }
        return (hasThree && hasTwo) ? dice.reduce((a, b) => a + b, 0) : 0;
    }

    calculateChance(dice) {
        return dice.reduce((a, b) => a + b, 0);
    }

    calculateYatzy(counts) {
        return counts.some(count => count === 5) ? 50 : 0;
    }
}

// Game state management
function createNewGame() {
    return {
        dice: [1, 1, 1, 1, 1],
        held: [false, false, false, false, false],
        rolls: 0,
        scores: {
            ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
            onePair: null, twoPairs: null, threeKind: null, fourKind: null,
            smallStraight: null, largeStraight: null, fullHouse: null, chance: null, yatzy: null
        },
        gameOver: false
    };
}

function rollDice(gameState, heldDice = []) {
    if (gameState.gameOver) throw new Error('Game is over. Start a new game.');
    if (gameState.rolls >= 3) throw new Error('No rolls left. Choose a category to score.');

    gameState.dice.forEach((_, index) => {
        if (!heldDice[index]) {
            gameState.dice[index] = Math.floor(Math.random() * 6) + 1;
        }
    });

    gameState.rolls++;
    gameState.held = [...heldDice];

    return {
        dice: [...gameState.dice],
        rolls: gameState.rolls,
        rollsLeft: 3 - gameState.rolls,
        canRoll: gameState.rolls < 3
    };
}

function scoreCategory(gameState, category) {
    if (gameState.gameOver) throw new Error('Game is over.');
    if (gameState.rolls === 0) throw new Error('Roll the dice first before scoring.');
    if (gameState.scores[category] !== null) throw new Error(`Category "${category}" already scored.`);

    const scoring = new Scoring();
    const score = scoring.calculateScore(category, gameState.dice);
    gameState.scores[category] = score;

    const totals = calculateTotals(gameState.scores);
    gameState.gameOver = isGameOver(gameState.scores);
    gameState.rolls = 0;
    gameState.held = [false, false, false, false, false];

    return { category, score, totals, gameOver: gameState.gameOver };
}

function getGameState(gameState) {
    const totals = calculateTotals(gameState.scores);
    
    return {
        dice: [...gameState.dice],
        held: [...gameState.held],
        rolls: gameState.rolls,
        rollsLeft: 3 - gameState.rolls,
        scores: { ...gameState.scores },
        totals,
        gameOver: gameState.gameOver
    };
}

function calculateTotals(scores) {
    const upperSection = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const upperTotal = upperSection.reduce((total, category) => total + (scores[category] || 0), 0);
    const bonus = upperTotal >= 63 ? 50 : 0;
    const lowerTotal = Object.keys(scores)
        .filter(category => !upperSection.includes(category))
        .reduce((total, category) => total + (scores[category] || 0), 0);
    const grandTotal = upperTotal + bonus + lowerTotal;
    
    return { upperTotal, bonus, lowerTotal, grandTotal };
}

function isGameOver(scores) {
    return Object.values(scores).every(score => score !== null);
}

function analyzeDice(dice) {
    const scoring = new Scoring();
    const counts = scoring.getDiceCounts(dice);
    const analysis = [];
    
    // Check for Yatzy
    if (counts.some(count => count === 5)) {
        analysis.push("Yatzy! All five dice are the same (50 points)");
    }
    
    // Check for straights
    if (counts[0] && counts[1] && counts[2] && counts[3] && counts[4]) {
        analysis.push("Small Straight (1-2-3-4-5) - 15 points");
    }
    if (counts[1] && counts[2] && counts[3] && counts[4] && counts[5]) {
        analysis.push("Large Straight (2-3-4-5-6) - 20 points");
    }
    
    // Check for four of a kind
    for (let i = 5; i >= 0; i--) {
        if (counts[i] >= 4) {
            analysis.push(`Four ${i+1}'s - ${(i+1)*4} points`);
            break;
        }
    }
    
    // Check for three of a kind
    for (let i = 5; i >= 0; i--) {
        if (counts[i] >= 3) {
            analysis.push(`Three ${i+1}'s - ${(i+1)*3} points`);
            break;
        }
    }
    
    // Check for pairs
    const pairs = [];
    for (let i = 5; i >= 0; i--) {
        if (counts[i] >= 2) pairs.push(i+1);
    }
    if (pairs.length >= 2) {
        analysis.push(`Two Pairs: ${pairs[0]}'s and ${pairs[1]}'s - ${(pairs[0]*2) + (pairs[1]*2)} points`);
    } else if (pairs.length === 1) {
        analysis.push(`One Pair of ${pairs[0]}'s - ${pairs[0]*2} points`);
    }
    
    // Check for full house
    let hasThree = false, hasTwo = false;
    for (let i = 0; i < 6; i++) {
        if (counts[i] === 3) hasThree = true;
        if (counts[i] === 2) hasTwo = true;
    }
    if (hasThree && hasTwo) {
        analysis.push(`Full House - ${dice.reduce((a, b) => a + b, 0)} points`);
    }
    
    // Check upper section opportunities
    for (let i = 0; i < 6; i++) {
        if (counts[i] > 0) {
            analysis.push(`${counts[i]} ${i+1}'s - ${counts[i] * (i+1)} points in ${i+1}'s category`);
        }
    }
    
    // Always include chance
    analysis.push(`Chance - ${dice.reduce((a, b) => a + b, 0)} points`);
    
    return analysis;
}

module.exports = {
    createNewGame,
    rollDice,
    scoreCategory,
    forfeitGame: createNewGame, // Forfeit creates a new game
    getGameState,
    analyzeDice
};