# 🎲 Yatzy Game - Assignment 2

## Enhanced Server-Side Yatzy Game with Node.js and Express

A full-stack Yatzy game implementation featuring server-side game state management, client-server communication via Fetch API, and enhanced jQuery animations.

### 🚀 Features

- **Full Server-Side Architecture**: Game state managed entirely on the server
- **RESTful API**: Complete set of endpoints for all game operations
- **jQuery Animations**: Smooth dice rolling animations and UI interactions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live score calculations and game state synchronization
- **Error Handling**: Comprehensive client and server error handling

### 🛠 Tech Stack

**Frontend:**
- HTML5, CSS3 with CSS Grid and Flexbox
- JavaScript (ES6+ modules)
- jQuery 3.7.1 for animations and DOM manipulation
- Fetch API for server communication

**Backend:**
- Node.js with Express.js
- RESTful API architecture
- ES6 modules

### 📁 Project Structure
yatzy-assignment2/
├── public/
│ ├── index.html # Main game interface
│ ├── style.css # Complete styling
│ └── modules/
│ └── YatzyGame.js # Client-side game logic
├── server/
│ └── gameState.js # Server-side game state management
├── server.js # Express server setup
├── package.json # Project dependencies
└── README.md # This file


### 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game` | Create new game |
| GET | `/api/game` | Get current game state |
| POST | `/api/roll` | Roll dice |
| POST | `/api/hold/:index` | Toggle dice hold state |
| POST | `/api/hold/reset` | Reset all hold states |
| POST | `/api/score/:category` | Score a category |
| GET | `/api/score/calculate/:category` | Calculate potential score |
| GET | `/api/state` | Get complete game state |
| GET | `/api/score/total` | Get total score |

### 🎮 Game Rules

**Upper Section:** Ones, Twos, Threes, Fours, Fives, Sixes
- Score sum of dice showing the number

**Lower Section:**
- **One Pair**: Sum of highest pair
- **Two Pairs**: Sum of two distinct pairs
- **Three of a Kind**: Sum of three matching dice
- **Four of a Kind**: Sum of four matching dice
- **Small Straight**: 1-2-3-4-5 (15 points)
- **Large Straight**: 2-3-4-5-6 (20 points)
- **Full House**: Three of a kind + pair (sum of all dice)
- **Chance**: Sum of all dice
- **Yatzy**: All five dice same (50 points)

**Bonus:** 50 points if upper section sum ≥ 63

### 🚀 Installation & Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd yatzy-assignment2