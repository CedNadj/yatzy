// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createGame, rollDice, scoreCategory, getState } from "./server/gameState.js";

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

// ---- API Endpoints ----
app.post("/api/game", (req, res) => res.json(createGame()));          // new game
app.post("/api/roll", (req, res) => res.json(rollDice()));            // roll dice
app.post("/api/score/:category", (req, res) =>                        // score category
    res.json(scoreCategory(req.params.category)));
app.get("/api/state", (req, res) => res.json(getState()));            // current state

app.listen(PORT, () =>
  console.log(`✅ Yatzy server running at http://localhost:${PORT}`)
);