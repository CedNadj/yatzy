// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Node path setup
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public folder
app.use(express.static(path.join(dirname, "public")));

// Returns 5 random dice values
app.get("/roll-dices", (requ, res) => {
    const diceValues = Array.from({ length: 5}, () => Math.floor(Math.random() * 6) + 1);
    res.json({ dice: diceValues });
});

// Start server
app.listen(PORT, () => {
    console.log(`Yatzy server running at http://localhost:${PORT}`);
});