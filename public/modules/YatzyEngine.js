// Implements scoring rules for Yatzy categories
// The scoring decisions used here:
// - Ones..Sixes: sum of those faces
// - One Pair: sum of the highest pair (value*2)
// - Two Pairs: sum of two distinct pairs (higher pairs chosen)
// - Three/Four of a Kind: value * n (sum of those n dice) if available
// - Small Straight: fixed 15 (1-5 present)
// - Large Straight: fixed 20 (2-6 present)
// - Full House: sum of all dice when counts are [3,2]
// - Chance: sum of all dice
// - Yatzy: 50 when all five equal
// Upper-section bonus (if ones..sixes sum >= 63) -> +50

export class YatzyEngine {
  constructor() {
    this.scoreTable = {}; // category -> score (number)
  }

  // Helper: counts for faces 1..6
  counts(diceValues) {
    const c = [0, 0, 0, 0, 0, 0, 0]; // idx 1..6
    diceValues.forEach(d => (c[d] = (c[d] || 0) + 1));
    return c;
  }

  sumAll(dice) {
    return dice.reduce((a, b) => a + b, 0);
  }

  calculateScore(category, diceValues) {
    const c = this.counts(diceValues);
    const total = this.sumAll(diceValues);

    switch (category) {
      // Upper section
      case 'ones': return (c[1] || 0) * 1;
      case 'twos': return (c[2] || 0) * 2;
      case 'threes': return (c[3] || 0) * 3;
      case 'fours': return (c[4] || 0) * 4;
      case 'fives': return (c[5] || 0) * 5;
      case 'sixes': return (c[6] || 0) * 6;

      // Lower section
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
        // 1-2-3-4-5
        return (c[1] && c[2] && c[3] && c[4] && c[5]) ? 15 : 0;
      }
      case 'largeStraight': {
        // 2-3-4-5-6
        return (c[2] && c[3] && c[4] && c[5] && c[6]) ? 20 : 0;
      }
      case 'fullHouse': {
        // exactly one three-of-kind and one pair
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

  updateScore(category, value) {
    this.scoreTable[category] = value;
  }

  getTotalScore() {
    const sum = Object.values(this.scoreTable).reduce((a, b) => a + b, 0);
    const upperSum = ['ones','twos','threes','fours','fives','sixes'].reduce((s,k)=>s + (this.scoreTable[k]||0), 0);
    const bonus = upperSum >= 63 ? 50 : 0;
    return { total: sum + bonus, upperSum, bonus };
  }

  isFilled(category) {
    return this.scoreTable.hasOwnProperty(category);
  }
}
