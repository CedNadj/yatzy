# Yatzy — Single-player (Lab 05)

## Overview
This is a single-player Yatzy game built with plain HTML, CSS and JavaScript as required by Lab 05.  
The project demonstrates an interactive UI including rolling dice (with animation), holding dice, and a scorecard that accepts scores for the different Yatzy categories.

## Rules (summary)
- A player rolls **five dice**.
- A player may roll up to **3 times** per turn (initial roll + up to 2 rerolls).
- After each roll, the player may **hold** any subset of dice then reroll the rest.
- Each turn the player must place a score (or 0) into one category on the scorecard.
- The game ends when every score category has been used.
- The player with the highest total (sum of scorecard + bonuses) wins.

**Scoring — lower section used here (Yatzy rules simplified):**
- One Pair: sum of the pair (two same dice).
- Two Pairs: sum of both pairs.
- Three of a Kind: sum of the three dice.
- Four of a Kind: sum of the four dice.
- Small Straight (1-2-3-4-5): score 15 (sum).
- Large Straight (2-3-4-5-6): score 20 (sum).
- Full House (3 + 2): sum of all dice.
- Chance: sum of all dice.
- Yatzy (all five equal): 50.

Upper section (Ones..Sixes) are scored as count × face value. A 63+ bonus (if implemented) can be added later.

## How to run
1. Clone this repository to your local machine.
2. Open `index.html` in a browser (modern Chrome/Edge/Firefox).
3. Click **Roll** to roll dice. Click dice to toggle "hold". Click a score cell to fill it with the computed score for the current dice.
4. The UI is responsive and works on desktop & mobile.

## Files
- `index.html` — main UI + all code (HTML/CSS/JS) for Lab mock-up.
- `README.md` — this file.
- `DESIGN.md` — design system & dice spec.

