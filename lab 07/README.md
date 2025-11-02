# Assignment 2 — Yatzy with Node.js and Express

## Setup
1. `cd assignment2`
2. `npm install`
3. `node server.js`
4. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/game | Initialize new game |
| POST | /api/roll | Roll dice (max 3 times per turn) |
| POST | /api/score/:category | Score dice into category |
| GET | /api/state | Return current game state |

## Notes
- Server stores dice, held flags, roll counts, and scores in memory.
- Client uses `fetch()` to call API and update UI.
