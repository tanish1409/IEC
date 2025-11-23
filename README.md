# Mastermind Game

<div align="center">

![Mastermind Banner](https://img.shields.io/badge/Mastermind-Classic%20%26%20Two--Player-6366f1?style=for-the-badge)
[![Python](https://img.shields.io/badge/Python-3.8+-3498db?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f1c40f?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-2ecc71?style=for-the-badge)](LICENSE)

*A modern, web-based implementation of the classic code-breaking puzzle game*

[Features](#-features) • [Quick Start](#-quick-start) • [Game Rules](#-game-rules) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## Overview

Mastermind is an enhanced web-based implementation of the classic code-breaking board game. Challenge yourself against the computer or compete with friends in this beautifully designed puzzle game featuring dynamic difficulty levels, multiple game modes, and an elegant dark-themed interface.

### What's Mastermind?

In Mastermind, one player (the "codemaker") creates a secret pattern of colored pegs, while the other player (the "codebreaker") attempts to guess the pattern within a limited number of attempts. After each guess, feedback is provided using black and white pegs:

- **⚫ Black Peg**: Correct color in the correct position
- **⚪ White Peg**: Correct color in the wrong position

The challenge lies in using logical deduction to crack the code before running out of attempts!

---

## Features

### Dual Game Modes

#### Classic Mode (1-Player)
- Face off against an AI codemaker
- Perfect your deduction skills
- Track your cumulative score across rounds
- Progressively challenging gameplay

#### Two-Player Mode
- Compete with a friend locally
- Roles alternate each round (Mastermind ↔ Guesser)
- Visual handover screens prevent cheating
- Individual score tracking for competitive play

### Customizable Gameplay

| Feature | Options | Description |
|---------|---------|-------------|
| **Peg Count** | 4-8 | Adjustable pattern length |
| **Difficulty** | Normal / Hard | Affects available color palette |
| **Attempts** | 10 per round | Standard across all modes |
| **Colors** | 12 unique | Visually distinct palette |

### Difficulty System

- **Normal Mode**: Available colors = Peg count + 2
  - Example: 4 pegs → 6 colors to choose from
- **Hard Mode**: Available colors = Peg count + 4
  - Example: 4 pegs → 8 colors to choose from

### Scoring System

**Classic Mode:**
```
Points = 10 - attempts_used + 1 (if solved)
Points = 0 (if failed)
```

**Two-Player Mode:**
```
Guesser wins: Points = 10 - attempts_used + 1
Mastermind wins: Points = 10 (if guesser fails)
```

### User Experience

- **Modern UI/UX**: Sleek dark theme with gradient accents
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Visual Feedback**: Real-time color selection with disabled state indicators
- **Smart Validation**: Prevents duplicate colors and invalid sequences
- **Progress Tracking**: Clear attempt counters and round numbers
- **Smooth Animations**: Polished transitions between screens

---

## Quick Start

### Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Modern web browser** (Chrome, Firefox, Safari, or Edge)

### Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```batch
start_server.bat
```

**Linux/macOS:**
```bash
bash start_server.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone https://github.com/tanish1409/IEC.git
cd IEC
```

2. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

3. **Start the Flask server**
```bash
python app.py
```

4. **Open the frontend**
```bash
cd ../frontend
python -m http.server 5500
```

5. **Play the game**

Open your browser to: `http://localhost:5500`

---

## Game Rules

### Setup Phase

1. Choose your **game mode** (Classic or Two-Player)
2. Select **difficulty** (Normal or Hard)
3. Set the **number of pegs** (4-8)
4. For Two-Player: Enter player names

### Gameplay

#### Making a Guess

1. Click colors from the palette to fill peg slots
2. Each color can only be used once per guess
3. Click a filled peg to remove it
4. Submit when all slots are filled

#### Reading Feedback

After each guess, you'll receive feedback:

- **Black pegs** indicate correct colors in correct positions
- **White pegs** indicate correct colors in wrong positions
- **Empty slots** mean those colors aren't in the secret at all

**Important**: Feedback pegs don't correspond to specific positions!

#### Winning Conditions

- **Codebreaker wins**: Correctly guess all colors and positions
- **Codemaker wins**: Codebreaker fails within 10 attempts

### Strategy Tips

1. **Start broad**: Use your first guess to test different colors
2. **Analyze feedback**: Black pegs are more valuable than white pegs
3. **Eliminate systematically**: Track which colors aren't in the code
4. **Think positionally**: Once you find a correct color, test different positions
5. **Use logic**: Each guess should rule out possibilities based on previous feedback

---

## Architecture

### Technology Stack

```
┌─────────────────────────────────────────────┐
│                  Frontend                   │
│  ┌──────────────────────────────────────┐   │
│  │  HTML5 + CSS3 + JavaScript (ES6)     │   │
│  │  - Component-based architecture      │   │
│  │  - Custom elegant dark theme         │   │
│  │  - No external CSS frameworks        │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                      ↕ REST API
┌─────────────────────────────────────────────┐
│                  Backend                    │
│  ┌──────────────────────────────────────┐   │
│  │  Python Flask (Port 1000)            │   │
│  │  - RESTful API endpoints             │   │
│  │  - In-memory game state              │   │
│  │  - Game logic engine                 │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Project Structure

```
IEC/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── game_logic.py             # Core game engine
│   └── requirements.txt          # Python dependencies
│
├── frontend/
│   ├── index.html                # Main HTML structure
│   ├── styles.css                # Custom styling
│   ├── app.js                    # Application controller
│   └── components/
│       ├── setup.js              # Game configuration
│       ├── mastermind.js         # Secret code setting
│       ├── handover.js           # Player transitions
│       ├── game-board.js         # Main gameplay
│       └── round-over.js         # Results display
│
├── start_server.sh               # Linux/Mac startup
├── start_server.bat              # Windows startup
└── README.md                     # This file
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/initialize` | POST | Start a new game |
| `/api/set-secret` | POST | Set secret code (two-player) |
| `/api/guess` | POST | Submit a guess |
| `/api/end-round` | POST | Finalize round scoring |
| `/api/new-round` | POST | Start next round |
| `/api/state` | GET | Get current game state |

---

## Design Philosophy

### Color Palette

The game features 12 carefully selected, visually distinct colors:

```css
#E74C3C  /* Vibrant Red */       #3498DB  /* Bright Blue */
#2ECC71  /* Fresh Green */       #F39C12  /* Warm Orange */
#9B59B6  /* Rich Purple */       #1ABC9C  /* Teal */
#E67E22  /* Dark Orange */       #34495E  /* Slate Gray */
#F1C40F  /* Sunny Yellow */      #16A085  /* Dark Teal */
#C0392B  /* Deep Red */          #8E44AD  /* Deep Purple */
```

**Note**: Black (#000000) and White (#FFFFFF) are reserved exclusively for feedback pegs.

### UI/UX Principles

- **Clarity First**: Every action has clear visual feedback
- **No Cognitive Load**: Disabled colors show a slash indicator
- **Contextual Information**: Row numbers and attempt counters always visible
- **Smooth Interactions**: Animations enhance, never distract
- **Accessibility**: High contrast, readable fonts, logical tab order

---

## Documentation

### Configuration Options

#### Backend Configuration (`backend/app.py`)

```python
app.run(host='0.0.0.0', port=1000, debug=True)
```

- **host**: `0.0.0.0` allows external connections
- **port**: `1000` (customize as needed)
- **debug**: Set to `False` for production

#### Frontend Configuration (`frontend/app.js`)

```javascript
this.API_BASE = 'http://localhost:1000/api';
```

Update this if you change the backend port.

### Game State Structure

```javascript
{
  mode: "classic" | "two_player",
  difficulty: "normal" | "hard",
  peg_count: 4-8,
  max_attempts: 10,
  round_palette: ["#E74C3C", "#3498DB", ...],
  secret: ["#E74C3C", "#3498DB", "#2ECC71", "#F39C12"],
  attempts_used: 0,
  history: [
    {
      guess: ["#E74C3C", "#3498DB", "#2ECC71", "#F39C12"],
      score: {black: 2, white: 1}
    }
  ],
  round_number: 0,
  status: "setup" | "guessing" | "round_over",
  scores: {
    classic_player: 0,
    mastermind: 0,
    guesser: 0
  }
}
```

### Scoring Algorithm

The scoring algorithm ensures no double-counting:

```python
def score_guess(guess, secret):
    black_pegs = 0
    white_pegs = 0
    
    secret_copy = secret.copy()
    guess_copy = guess.copy()
    
    # First pass: count black pegs (exact matches)
    for i in range(len(guess)):
        if guess[i] == secret[i]:
            black_pegs += 1
            secret_copy[i] = None
            guess_copy[i] = None
    
    # Second pass: count white pegs (color matches)
    for i in range(len(guess_copy)):
        if guess_copy[i] is not None:
            if guess_copy[i] in secret_copy:
                white_pegs += 1
                secret_copy[secret_copy.index(guess_copy[i])] = None
    
    return {"black": black_pegs, "white": white_pegs}
```

---

## Development

### Running in Development Mode

1. **Backend with auto-reload**:
```bash
cd backend
export FLASK_ENV=development  # Linux/Mac
set FLASK_ENV=development     # Windows
python app.py
```

2. **Frontend with hot reload** (using VS Code Live Server or similar)

### Code Style

- **Python**: PEP 8 compliant
- **JavaScript**: ES6+ with modern syntax
- **CSS**: BEM-inspired naming convention
- **No comments/emojis in production code** (as per design requirements)

### Adding New Features

1. **Backend**: Extend `game_logic.py` for game rules
2. **API**: Add endpoints in `app.py`
3. **Frontend**: Create new component in `components/`
4. **Styling**: Add styles to `styles.css`

---

## Authors

- **Tanish** - [@tanish1409](https://github.com/tanish1409) - *Repository Owner*
- **Kunal** - *Collaborator & Implementation*
