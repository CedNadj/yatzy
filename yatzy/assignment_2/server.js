// server.js - Express server for Yatzy game
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import game logic
const { YatzyGameEngine, Scoring } = require('./server/gameEngine');

// In-memory storage for active games
const activeGames = new Map();

// Utility function to generate random dice values
function rollDice(count = 5) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Game API Routes
app.post('/api/game/new', (req, res) => {
    try {
        const gameId = generateGameId();
        const game = new YatzyGameEngine();
        
        activeGames.set(gameId, game);
        
        res.json({
            success: true,
            gameId,
            message: 'New game created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/game/:gameId', (req, res) => {
    try {
        const { gameId } = req.params;
        const game = activeGames.get(gameId);
        
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        
        const state = game.getGameState();
        res.json({
            success: true,
            ...state
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/game/:gameId/roll-dice', (req, res) => {
    try {
        const { gameId } = req.params;
        const { heldDice = [] } = req.body;
        const game = activeGames.get(gameId);
        
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        
        const result = game.rollDice(heldDice);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/game/:gameId/score', (req, res) => {
    try {
        const { gameId } = req.params;
        const { category } = req.body;
        const game = activeGames.get(gameId);
        
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        
        const result = game.scoreCategory(category);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/game/:gameId/hold', (req, res) => {
    try {
        const { gameId } = req.params;
        const { dieIndex } = req.body;
        const game = activeGames.get(gameId);
        
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        
        const result = game.toggleHold(dieIndex);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/game/:gameId/forfeit', (req, res) => {
    try {
        const { gameId } = req.params;
        const game = activeGames.get(gameId);
        
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        
        // Remove the current game
        activeGames.delete(gameId);
        
        // Create a new game with same ID
        const newGame = new YatzyGameEngine();
        activeGames.set(gameId, newGame);
        
        const state = newGame.getGameState();
        res.json({
            success: true,
            gameId,
            ...state,
            message: 'Game reset successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/game/:gameId/analysis', (req, res) => {
    try {
        const { gameId } = req.params;
        const game = activeGames.get(gameId);
        
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        
        const analysis = game.analyzeDice();
        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Utility function to generate unique game IDs
function generateGameId() {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Start server
app.listen(PORT, () => {
    console.log(`🎲 Yatzy server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
});

module.exports = app;