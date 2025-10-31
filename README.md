# yatzy - Single-player

## Overview
This is a single-player Yatzy game built with plain HTML, CSS and JavaScript.
The project demonstrates an interactive UI including rolling dice (with animation), holding dice, and a scorecard that accepts scores for the different Yatzy categories.

## Rules (summary)
- A player rolls **five dice**
- A player may roll up to **3 times** per turn (initial roll +  up to 2 rerolls).
- After each roll, the player may **hold** any subset of dice then reroll the rest.
- Each turn the player must place a score (or 0) into one category on the scorecard.
- The game ends when every score category has been used.
- The player with the highest total (sum of scoreard + bonuses) wins.

**Scoring - lower section used here (Yatzy rules simplified):**
- One Pair: sum of the pair (two same dice).
- Two Pairs: sum of both pairs.
- Three of a Kind: sum of the three dice.
- Four of a Kind: sum of the four dice.
- Samll Straight (1-2-3-4-5): socre 15 (sum).
- Large Straight (2-3-4-5-6): socre 20 (sum).
- Full House (3 + 2): sum of all dice.
- Chance: sum of all dice.
- Yatzy (all five equal): 50.

Upper section (Ones -> Sixes) are scored as count x face vaue. A 63+ bonus (if implemented) can be added later.

## How to run
1. Clone this repository to your local machine.
2. Open `index.html` in a browser
3. Click **Roll** to roll dice.
4. Click dice to toogle "hold".
5. Click a score cell to fill it with the computed score for the current dice.
6. The UI is responsive and works on desktop & mobile.

## Files
- `DESIGN.md` - overview info about how the game was designed
- `Index.htlm` - main UI
- `Style.css` - main design UI
- `Dice.js` - knows how to roll dice and which dice are held
- `YatzyEngine.js` - calculates scores for a given category and dice values
- `YatzyGame.js` - connects the two to the page: controlling turns, animation, and the UI.
