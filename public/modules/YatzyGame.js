// Main game controller — imports Dice and Engine, handles UI, turns and scoring.

import { Dice } from './Dice.js';
import { YatzyEngine } from './YatzyEngine.js';

class YatzyGame {
    constructor() {
        this.diceValues = [1, 1, 1, 1, 1];
        this.held = [false, false, false, false, false];
        this.rollCount = 0;
        this.maxRolls = 3;
        this.scoreTable = {};
        this.gameOver = false;
        this.categories = [
            'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
            'onePair', 'twoPairs', 'threeKind', 'fourKind',
            'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yatzy'
        ];

        this.initializeGame();
        this.bindEvents();
    }

    async initializeGame() {
        try {
            this.showMessage('Initializing game...');
            const response = await fetch('/api/game', { method: 'POST' });
            
            if (!response.ok) throw new Error('Server response not OK');
            
            const gameState = await response.json();
            this.updateFromServerState(gameState);
            this.renderAll();
            this.showMessage('Game ready! Click Roll to start.');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showMessage('Error connecting to server. Please refresh.');
        }
    }

    bindEvents() {
        // Roll button with jQuery animation
        $('#rollBtn').on('click', () => this.onRoll());
        
        // Score button
        $('#scoreBtn').on('click', () => this.promptCategorySelection());
        
        // Reset button
        $('#resetBtn').on('click', () => this.onEndTurn(true));
        
        // Score cells
        $('.score-cell').on('click', (event) => this.onScoreCellClick(event));
    }

    async onRoll() {
        if (this.gameOver) {
            this.showMessage('Game over! Start a new game to play again.');
            return;
        }

        if (this.rollCount >= this.maxRolls) {
            this.showMessage('No rolls left. Choose a category to score.');
            return;
        }

        // Start jQuery animation
        this.showMessage('Rolling...');
        $('#rollBtn').prop('disabled', true);
        
        await this.animateRolling();
        
        try {
            const response = await fetch('/api/roll', { method: 'POST' });
            
            if (!response.ok) throw new Error('Roll request failed');
            
            const result = await response.json();
            
            if (result.error) {
                this.showMessage(result.error);
                $('#rollBtn').prop('disabled', false);
                return;
            }

            this.diceValues = result.dice;
            this.held = result.held;
            this.rollCount = result.rollCount;
            
            this.renderAll();
            this.showMessage(`Roll ${this.rollCount}/${this.maxRolls}. Hold dice or score.`);
            
        } catch (error) {
            console.error('Roll failed:', error);
            this.showMessage('Error rolling dice. Please try again.');
        } finally {
            $('#rollBtn').prop('disabled', false);
        }
    }

    // jQuery-based rolling animation
    animateRolling() {
        return new Promise(resolve => {
            const $dice = $('.die');
            const duration = 600;
            const interval = 80;
            let elapsed = 0;
            
            $dice.addClass('rolling');
            
            const animation = setInterval(() => {
                elapsed += interval;
                this.renderPipsPreview();
                
                if (elapsed >= duration) {
                    clearInterval(animation);
                    $dice.removeClass('rolling');
                    resolve();
                }
            }, interval);
        });
    }

    renderPipsPreview() {
        const randomFaces = Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1);
        this.renderDice(randomFaces, true);
    }

    renderDice(values = this.diceValues, preview = false) {
        const $diceRow = $('#diceRow');
        $diceRow.empty();
        
        values.forEach((value, index) => {
            const $die = this.createDie(value);
            
            if (!preview && this.held[index]) {
                $die.addClass('held');
            }
            
            // Click to toggle hold (only after first roll)
            $die.on('click', () => {
                if (this.rollCount === 0) {
                    this.showMessage('Roll the dice before holding.');
                    return;
                }
                if (this.gameOver) return;
                
                this.toggleHold(index);
            });
            
            $diceRow.append($die);
        });
    }

    createDie(value) {
        const $die = $('<div>').addClass('die').attr('data-value', value);
        const layout = {
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
        };
        
        if (layout[value]) {
            layout[value].forEach(pos => {
                $die.append($('<span>').addClass('pip ' + pos));
            });
        }
        
        return $die;
    }

    async toggleHold(index) {
        try {
            const response = await fetch(`/api/hold/${index}`, { method: 'POST' });
            
            if (!response.ok) throw new Error('Hold request failed');
            
            const result = await response.json();
            
            if (result.error) {
                this.showMessage(result.error);
                return;
            }

            this.held = result.held;
            this.diceValues = result.dice;
            this.renderDice();
            
        } catch (error) {
            console.error('Toggle hold failed:', error);
            this.showMessage('Error toggling hold. Please try again.');
        }
    }

    promptCategorySelection() {
        if (this.rollCount === 0) {
            this.showMessage('Roll the dice before scoring.');
            return;
        }
        this.showMessage('Click an empty category on the scorecard to assign your score.');
    }

    async onScoreCellClick(event) {
        if (this.gameOver) return;
        
        const $cell = $(event.currentTarget);
        const category = $cell.data('key');
        
        if (!category) return;
        
        if (this.scoreTable[category] !== undefined) {
            this.showMessage('This category is already filled.');
            return;
        }

        // Calculate potential score
        const potentialScore = await this.calculatePotentialScore(category);
        
        if (!confirm(`Score ${potentialScore} points in "${this.formatCategoryName(category)}"?`)) {
            this.showMessage('Scoring cancelled.');
            return;
        }

        await this.scoreCategory(category);
    }

    async calculatePotentialScore(category) {
        try {
            const response = await fetch(`/api/score/calculate/${category}`);
            const data = await response.json();
            return data.score;
        } catch (error) {
            console.error('Score calculation failed:', error);
            return 0;
        }
    }

    async scoreCategory(category) {
        try {
            this.showMessage('Scoring...');
            const response = await fetch(`/api/score/${category}`, { method: 'POST' });
            
            if (!response.ok) throw new Error('Score request failed');
            
            const result = await response.json();
            
            if (result.error) {
                this.showMessage(result.error);
                return;
            }

            this.scoreTable[category] = result.score;
            this.gameOver = result.gameOver;
            
            this.renderAll();
            this.showMessage(`Scored ${result.score} points in ${this.formatCategoryName(category)}!`);
            
            if (this.gameOver) {
                this.endGame();
            }
            
        } catch (error) {
            console.error('Score category failed:', error);
            this.showMessage('Error scoring category. Please try again.');
        }
    }

    async onEndTurn(forfeit = false) {
        if (forfeit) {
            this.showMessage('Turn forfeited. Starting new turn.');
        }
        
        try {
            await this.initializeGame();
        } catch (error) {
            console.error('Reset failed:', error);
            this.showMessage('Error resetting game.');
        }
    }

    endGame() {
        const total = this.getTotalScore().total;
        this.showMessage(`Game Over! Final Score: ${total}`);
        
        setTimeout(() => {
            alert(`Game Completed! \nFinal Score: ${total}\n\nCongratulations!`);
        }, 500);
        
        $('#rollBtn').prop('disabled', true);
    }

    renderAll() {
        this.renderDice();
        this.updateDisplay();
        this.renderScorecard();
    }

    updateDisplay() {
        $('#rollCount').text(this.rollCount);
        $('#rollLeft').text(this.maxRolls - this.rollCount);
        $('#lastRoll').text(this.diceValues.join(', '));
        $('#maxRolls').text(this.maxRolls);
        
        // Update button states
        $('#rollBtn').prop('disabled', this.rollCount >= this.maxRolls || this.gameOver);
    }

    renderScorecard() {
        $('.score-cell').each((index, cell) => {
            const $cell = $(cell);
            const category = $cell.data('key');
            
            if (this.scoreTable[category] !== undefined) {
                // Category is filled
                $cell.text(this.scoreTable[category])
                    .addClass('filled')
                    .css('opacity', '0.7');
            } else {
                // Show potential score
                const potentialScore = this.calculateScore(category, this.diceValues);
                $cell.text(potentialScore)
                    .removeClass('filled')
                    .css('opacity', '0.6');
            }
        });

        // Update totals
        const totals = this.getTotalScore();
        $('#totalScore').text(totals.total);
        $('#upperBonus').text(totals.bonus);
    }

    calculateScore(category, diceValues = this.diceValues) {
        // Client-side calculation for display purposes
        const c = this.counts(diceValues);
        const total = diceValues.reduce((a, b) => a + b, 0);

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
            case 'smallStraight': return (c[1] && c[2] && c[3] && c[4] && c[5]) ? 15 : 0;
            case 'largeStraight': return (c[2] && c[3] && c[4] && c[5] && c[6]) ? 20 : 0;
            case 'fullHouse': {
                const has3 = c.some(v => v === 3);
                const has2 = c.some(v => v === 2);
                return (has3 && has2) ? total : 0;
            }
            case 'chance': return total;
            case 'yatzy': return c.some(v => v === 5) ? 50 : 0;
            default: return 0;
        }
    }

    counts(diceValues) {
        const c = [0, 0, 0, 0, 0, 0, 0];
        diceValues.forEach(d => (c[d] = (c[d] || 0) + 1));
        return c;
    }

    getTotalScore() {
        const sum = Object.values(this.scoreTable).reduce((a, b) => a + b, 0);
        const upperSum = ['ones','twos','threes','fours','fives','sixes']
            .reduce((s, k) => s + (this.scoreTable[k] || 0), 0);
        const bonus = upperSum >= 63 ? 50 : 0;
        return { total: sum + bonus, upperSum, bonus };
    }

    updateFromServerState(gameState) {
        this.diceValues = gameState.dice || [1, 1, 1, 1, 1];
        this.held = gameState.held || [false, false, false, false, false];
        this.rollCount = gameState.rollCount || 0;
        this.maxRolls = gameState.maxRolls || 3;
        this.scoreTable = gameState.scoreTable || {};
        this.gameOver = gameState.gameOver || false;
    }

    formatCategoryName(key) {
        const names = {
            'ones': 'Ones', 'twos': 'Twos', 'threes': 'Threes', 'fours': 'Fours', 
            'fives': 'Fives', 'sixes': 'Sixes', 'onePair': 'One Pair', 
            'twoPairs': 'Two Pairs', 'threeKind': 'Three of a Kind', 
            'fourKind': 'Four of a Kind', 'smallStraight': 'Small Straight', 
            'largeStraight': 'Large Straight', 'fullHouse': 'Full House', 
            'chance': 'Chance', 'yatzy': 'Yatzy'
        };
        return names[key] || key;
    }

    showMessage(text) {
        $('#message').text(text || '').css('color', text.includes('Error') ? '#e74c3c' : '#2c3e50');
    }
}

// Initialize game when DOM is ready
$(document).ready(() => {
    // Check if required elements exist
    if ($('#diceRow').length && $('#scorecard').length) {
        console.log('Initializing Yatzy Game...');
        window.yatzyGame = new YatzyGame();
    } else {
        console.error('Required DOM elements not found. Check your HTML structure.');
    }
});