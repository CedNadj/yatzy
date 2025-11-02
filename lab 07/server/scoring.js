// Same rules you used before in YatzyEngine.js
export function calculateScore(category, dice) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  dice.forEach((d) => (counts[d] = (counts[d] || 0) + 1));
  const sum = dice.reduce((a, b) => a + b, 0);

  switch (category) {
    case "ones": return counts[1] * 1;
    case "twos": return counts[2] * 2;
    case "threes": return counts[3] * 3;
    case "fours": return counts[4] * 4;
    case "fives": return counts[5] * 5;
    case "sixes": return counts[6] * 6;
    case "onePair": for (let v = 6; v >= 1; v--) if (counts[v] >= 2) return v * 2; return 0;
    case "twoPairs": {
      const pairs = []; for (let v = 6; v >= 1; v--) if (counts[v] >= 2) pairs.push(v);
      return pairs.length >= 2 ? pairs[0]*2 + pairs[1]*2 : 0;
    }
    case "threeKind": for (let v = 6; v >= 1; v--) if (counts[v] >= 3) return v * 3; return 0;
    case "fourKind": for (let v = 6; v >= 1; v--) if (counts[v] >= 4) return v * 4; return 0;
    case "smallStraight": return [1,2,3,4,5].every(v => counts[v]) ? 15 : 0;
    case "largeStraight": return [2,3,4,5,6].every(v => counts[v]) ? 20 : 0;
    case "fullHouse": return counts.includes(3)&&counts.includes(2)?sum:0;
    case "chance": return sum;
    case "yatzy": return counts.includes(5)?50:0;
    default: return 0;
  }
}
