/**
 * Yatzy Game Client
 * Uses Fetch API to communicate with Express server
 * Handles UI updates and user interactions
 */

// Game state
let gameState = {
    dice: [1, 1, 1, 1, 1],
    held: [false, false, false, false, false],
    rollsLeft: 3,
    turn: 1,
    gameOver: false
};

// DOM elements
const elements = {
    diceRow: document.getElementById('diceRow'),
    rollBtn: document.getElementById('rollBtn'),
    newGameBtn: document.getElementById('newGameBtn'),
    rollCount: document.getElementById('rollCount'),
    turnCount: document.getElementById('turnCount'),
    currentTotal: document.getElementById('currentTotal'),
    message: document.getElementById('message'),
    upperTotal: document.getElementById('upperTotal'),
    bonus: document.getElementById('bonus'),
    totalScore: document.getElementById('totalScore'),
    gameOverMessage: document.getElementById('gameOverMessage'),
    finalScore: document.getElementById('finalScore')
};

// Initialize the game
document.addEventListener('DOMContentLoaded', async () => {
    await initializeGame();
    setupEventListeners();
});

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Roll dice button
    elements.rollBtn.addEventListener('click', rollDice);
    
    // New game button
    elements.newGameBtn.addEventListener('click', newGame);
    
    // Dice click handlers
    elements.diceRow.addEventListener('click', (e) => {
        const die = e.target.closest('.die');
        if (die) {
            const index = Array.from(die.parentNode.children).indexOf(die);
            toggleHoldDie(index);
        }
    });

    // Score category click handlers
    document.addEventListener('click', (e) => {
        const scoreRow = e.target.closest('.score-row.clickable');
        if (scoreRow) {
            const category = scoreRow.dataset.category;
            scoreCategory(category);
        }
    });
}

/**
 * Initializes a new game from the server
 */
async function initializeGame() {
    try {
        showMessage('Starting new game...', 'info');
        const response = await fetch('/api/game', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            gameState = data.gameState;
            updateUI();
            showMessage('Game started! Roll the dice to begin.', 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        showMessage('Error starting game: ' + error.message, 'error');
    }
}

/**
 * Rolls the dice via server API
 */
async function rollDice() {
    if (gameState.rollsLeft <= 0) {
        showMessage('No rolls left! Choose a category to score.', 'error');
        return;
    }

    // Start animation
    document.querySelectorAll('.die').forEach(die => die.classList.add('rolling'));
    elements.rollBtn.disabled = true;

    try {
        const response = await fetch('/api/roll', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            gameState = data.gameState;
            
            // Wait for animation to complete
            setTimeout(() => {
                document.querySelectorAll('.die').forEach(die => die.classList.remove('rolling'));
                updateUI();
                elements.rollBtn.disabled = gameState.rollsLeft <= 0;
                
                if (gameState.rollsLeft === 0) {
                    showMessage('No rolls left! Choose a category to score.', 'info');
                } else {
                    showMessage(`Dice rolled! ${gameState.rollsLeft} rolls remaining.`, 'success');
                }
            }, 600);
            
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error rolling dice:', error);
        showMessage('Error rolling dice: ' + error.message, 'error');
        document.querySelectorAll('.die').forEach(die => die.classList.remove('rolling'));
        elements.rollBtn.disabled = false;
    }
}

/**
 * Scores a category via server API
 * @param {string} category - The category to score
 */
async function scoreCategory(category) {
    if (gameState.rollsLeft === 3) {
        showMessage('You need to roll at least once before scoring!', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/score/${category}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            gameState = data.gameState;
            updateUI();
            
            if (gameState.gameOver) {
                showMessage(`Game Over! Final Score: ${gameState.totalScore}`, 'success');
                elements.gameOverMessage.style.display = 'block';
                elements.finalScore.textContent = gameState.totalScore;
                elements.rollBtn.disabled = true;
            } else {
                showMessage(`Scored ${gameState.scores[category]} points in ${category}!`, 'success');
            }
            
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error scoring category:', error);
        showMessage('Error scoring category: ' + error.message, 'error');
    }
}

/**
 * Toggles hold state of a die via server API
 * @param {number} index - Index of the die to toggle
 */
async function toggleHoldDie(index) {
    if (gameState.rollsLeft === 3) {
        showMessage('Roll the dice first before holding!', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/hold/${index}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            gameState = data.gameState;
            updateDiceDisplay();
            showMessage(`Die ${index + 1} ${gameState.held[index] ? 'held' : 'released'}`, 'info');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error toggling die hold:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Starts a new game
 */
async function newGame() {
    await initializeGame();
    elements.gameOverMessage.style.display = 'none';
    showMessage('New game started!', 'success');
}

/**
 * Updates the entire UI based on current game state
 */
function updateUI() {
    updateDiceDisplay();
    updateRollDisplay();
    updateTurnDisplay();
    updateScorecard();
    updateTotals();
}

/**
 * Updates dice display
 */
function updateDiceDisplay() {
    elements.diceRow.innerHTML = '';
    
    gameState.dice.forEach((value, index) => {
        const die = createDie(value);
        if (gameState.held[index]) {
            die.classList.add('held');
        }
        elements.diceRow.appendChild(die);
    });
}

/**
 * Updates roll information display
 */
function updateRollDisplay() {
    elements.rollCount.textContent = gameState.rollsLeft;
    elements.rollBtn.disabled = gameState.rollsLeft <= 0 || gameState.gameOver;
}

/**
 * Updates turn information display
 */
function updateTurnDisplay() {
    elements.turnCount.textContent = gameState.turn;
}

/**
 * Updates scorecard display
 */
function updateScorecard() {
    const scoreCells = document.querySelectorAll('.score-cell');
    
    scoreCells.forEach(cell => {
        const category = cell.dataset.category;
        const isUsed = gameState.scores[category] !== undefined && gameState.scores[category] !== null;
        
        if (isUsed) {
            // Category already used - show final score
            cell.textContent = gameState.scores[category];
            cell.classList.add('used');
            cell.classList.remove('clickable');
            cell.style.cursor = 'default';
            cell.onclick = null;
        } else {
            // Category available for scoring
            const potentialScore = calculatePotentialScore(category, gameState.dice);
            cell.textContent = potentialScore > 0 ? potentialScore : '—';
            
            // Only make clickable if we've rolled at least once
            if (gameState.rollsLeft < 3) {
                cell.classList.add('clickable');
                cell.classList.remove('used');
                cell.style.cursor = 'pointer';
                cell.onclick = () => scoreCategory(category);
            } else {
                cell.classList.remove('clickable', 'used');
                cell.style.cursor = 'default';
                cell.onclick = null;
            }
        }
    });
}

/**
 * Updates total scores display
 */
function updateTotals() {
    elements.upperTotal.textContent = gameState.upperTotal || 0;
    elements.bonus.textContent = gameState.bonus || 0;
    elements.totalScore.textContent = gameState.totalScore || 0;
    elements.currentTotal.textContent = gameState.totalScore || 0;
}

/**
 * Shows a message to the user
 * @param {string} text - Message text
 * @param {string} type - Message type (success, error, info)
 */
function showMessage(text, type = 'info') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    
    // Auto-hide success and info messages after 3 seconds
    if (type !== 'error') {
        setTimeout(() => {
            if (elements.message.textContent === text) {
                elements.message.textContent = '';
                elements.message.className = 'message';
            }
        }, 3000);
    }
}

/**
 * Creates a die element with the specified value
 * @param {number} value - Die value (1-6)
 * @returns {HTMLElement} Die element
 */
function createDie(value) {
    const die = document.createElement('div');
    die.className = 'die';
    die.setAttribute('data-value', value);
    die.setAttribute('aria-label', `Die showing ${value}`);
    
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
            const pip = document.createElement('div');
            pip.className = `pip ${pos}`;
            die.appendChild(pip);
        });
    }
    
    return die;
}