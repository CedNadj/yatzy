// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { 
  createGame, 
  rollDice, 
  scoreCategory, 
  getState,
  toggleHold,
  calculateScore,
  getTotalScore,
  resetScore,
 } from "./server/gameState.js";

// Node path setup
// filename -> the full path to the current file
// dirname -> the folder path containing the current file
// Because we swtich to ES modules (by adding "type": "module" in package.json; those global variables disappear)
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
const PORT = 3000;

// Serve static files from /public folder
app.use(express.json());
app.use(express.static(path.join(dirname, "public")));

// CORS middleware for cross-origin requests
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Context-Type, Aceept');
  next();
})

// ---- API Endpoints ----
// Game management
app.post("/api/game", (req, res) => {
  console.log("GET /api/game - Getting game state");
  res.json(createGame());
});
app.get("/api/game", (req, res) => {
    console.log("GET /api/game - Getting game state");
    res.json(getState());
});

// Dice operations
app.post("/api/roll", (req, res) => {
    console.log("POST /api/roll - Rolling dice");
    res.json(rollDice());
});

app.post("/api/hold/:index", (req, res) => {
    const index = parseInt(req.params.index);
    console.log(`POST /api/hold/${index} - Toggling hold`);
    res.json(toggleHold(index));
});

app.post("/api/hold/reset", (req, res) => {
    console.log("POST /api/hold/reset - Resetting hold states");
    res.json(resetHold());
});

// Scoring
app.post("/api/score/:category", (req, res) => {
    const category = req.params.category;
    console.log(`POST /api/score/${category} - Scoring category`);
    res.json(scoreCategory(category));
});

app.get("/api/score/calculate/:category", (req, res) => {
    const category = req.params.category;
    console.log(`GET /api/score/calculate/${category} - Calculating potential score`);
    res.json({ score: calculateScore(category) });
});

// Game state
app.get("/api/state", (req, res) => {
    res.json(getState());
});

app.get("/api/score/total", (req, res) => {
    res.json(getTotalScore());
});

// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`Yatzy Server running at http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});