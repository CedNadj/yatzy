// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { 
    createGame, 
    rollDice, 
    scoreCategory, 
    getState, 
    toggleHoldDie,
    resetGame 
} from "./server/gameState.js";

// Node path setup
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
const PORT = 3000;

// Serve static files from /public folder
app.use(express.json());
app.use(express.static(path.join(dirname, "public")));

// ---- API Endpoints ----
app.post("/api/game", (req, res) => {
    // Create new game
    try {
        const gameState = createGame();
        res.json({ success: true, gameState });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/roll", (req, res) => {
    // Roll unheld dice
    try {
        const gameState = rollDice();
        res.json({ success: true, gameState });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.put("/api/hold/:index", (req, res) => {
    // Toggle hold state of a die
    try {
        const index = parseInt(req.params.index);
        const gameState = toggleHoldDie(index);
        res.json({ success: true, gameState });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post("/api/score/:category", (req, res) => {
    // Score current dice in specified category
    try {
        const category = req.params.category;
        const gameState = scoreCategory(category);
        res.json({ success: true, gameState });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get("/api/state", (req, res) => {
    // Get current game state
    try {
        const gameState = getState();
        res.json({ success: true, gameState });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete("/api/game", (req, res) => {
    // Reset game
    try {
        const gameState = resetGame();
        res.json({ success: true, gameState });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`✅ Yatzy server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(dirname, "public")}`);
});