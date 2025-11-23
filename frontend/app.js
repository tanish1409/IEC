import { SetupComponent } from './components/setup.js';
import { MastermindComponent } from './components/mastermind.js';
import { HandoverComponent } from './components/handover.js';
import { GameBoardComponent } from './components/game-board.js';
import { RoundOverComponent } from './components/round-over.js';

class MastermindApp {
    constructor() {
        this.API_BASE = 'http://localhost:1000/api';
        this.gameState = null;
        
        this.setupComponent = new SetupComponent(this);
        this.mastermindComponent = new MastermindComponent(this);
        this.handoverComponent = new HandoverComponent(this);
        this.gameBoardComponent = new GameBoardComponent(this);
        this.roundOverComponent = new RoundOverComponent(this);
        
        this.init();
    }

    init() {
        this.setupComponent.init();
        this.mastermindComponent.init();
        this.handoverComponent.init();
        this.gameBoardComponent.init();
        this.roundOverComponent.init();
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.API_BASE}${endpoint}`, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            alert(`Error: ${error.message}`);
            throw error;
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        
        if (!this.gameState) {
            scoreDisplay.classList.add('hidden');
            return;
        }

        scoreDisplay.classList.remove('hidden');
        scoreDisplay.innerHTML = '';

        if (this.gameState.mode === 'classic') {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `<span>Score: ${this.gameState.scores.classic_player}</span>`;
            scoreDisplay.appendChild(scoreItem);
        } else {
            const player1Name = this.gameState.player_names.mastermind || 'Player 1';
            const player2Name = this.gameState.player_names.guesser || 'Player 2';
            
            const score1 = document.createElement('div');
            score1.className = 'score-item';
            score1.innerHTML = `<span>${player1Name}: ${this.gameState.scores.mastermind}</span>`;
            
            const score2 = document.createElement('div');
            score2.className = 'score-item';
            score2.innerHTML = `<span>${player2Name}: ${this.gameState.scores.guesser}</span>`;
            
            scoreDisplay.appendChild(score1);
            scoreDisplay.appendChild(score2);
        }
    }

    async startGame(config) {
        const result = await this.apiCall('/initialize', 'POST', config);
        this.gameState = result.state;
        this.updateScoreDisplay();

        if (this.gameState.mode === 'classic') {
            this.showScreen('game-screen');
            this.gameBoardComponent.render();
        } else {
            this.showScreen('mastermind-screen');
            this.mastermindComponent.render();
        }
    }

    async setSecret(secret) {
        const result = await this.apiCall('/set-secret', 'POST', { secret });
        this.gameState = result.state;
        
        this.showScreen('handover-screen');
        this.handoverComponent.render();
    }

    proceedToGuessing() {
        this.showScreen('game-screen');
        this.gameBoardComponent.render();
    }

    async makeGuess(guess) {
        const result = await this.apiCall('/guess', 'POST', { guess });
        this.gameState = result.state;
        
        this.gameBoardComponent.updateBoard(result);

        if (result.round_over) {
            const endResult = await this.apiCall('/end-round', 'POST');
            this.updateScoreDisplay();
            this.showScreen('round-over-screen');
            this.roundOverComponent.render(endResult.result);
        }
    }

    async startNewRound() {
        const result = await this.apiCall('/new-round', 'POST');
        this.gameState = result.state;
        this.updateScoreDisplay();

        if (this.gameState.mode === 'two_player') {
            this.showScreen('mastermind-screen');
            this.mastermindComponent.render();
        } else {
            this.showScreen('game-screen');
            this.gameBoardComponent.render();
        }
    }

    endGame() {
        this.gameState = null;
        this.updateScoreDisplay();
        this.showScreen('setup-screen');
    }
}

window.app = new MastermindApp();
