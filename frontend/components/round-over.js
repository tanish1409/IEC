export class RoundOverComponent {
    constructor(app) {
        this.app = app;
    }

    init() {
        document.getElementById('next-round-btn').addEventListener('click', () => {
            this.app.startNewRound();
        });

        document.getElementById('end-game-btn').addEventListener('click', () => {
            this.app.endGame();
        });
    }

    render(result) {
        const titleElement = document.getElementById('round-result-title');
        
        if (result.solved) {
            titleElement.textContent = 'Round Won!';
            titleElement.classList.remove('failed');
        } else {
            titleElement.textContent = 'Round Lost';
            titleElement.classList.add('failed');
        }

        this.renderSecret(result.secret);

        const winnerDisplay = document.getElementById('winner-display');
        winnerDisplay.textContent = `Winner: ${result.winner}`;

        const pointsDisplay = document.getElementById('points-display');
        pointsDisplay.textContent = `Points Awarded: ${result.points_awarded}`;

        this.renderScoresTable(result.total_scores);
    }

    renderSecret(secret) {
        const secretPegsContainer = document.getElementById('secret-reveal-pegs');
        secretPegsContainer.innerHTML = '';

        secret.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'peg-slot filled';
            peg.style.backgroundColor = color;
            secretPegsContainer.appendChild(peg);
        });
    }

    renderScoresTable(scores) {
        const scoresTable = document.getElementById('scores-table');
        scoresTable.innerHTML = '<h3 style="margin-bottom: 16px;">Total Scores</h3>';

        const state = this.app.gameState;

        if (state.mode === 'classic') {
            const row = document.createElement('div');
            row.className = 'score-row';
            row.innerHTML = `
                <span>Your Score</span>
                <span>${scores.classic_player}</span>
            `;
            scoresTable.appendChild(row);
        } else {
            const row1 = document.createElement('div');
            row1.className = 'score-row';
            row1.innerHTML = `
                <span>${state.player_names.mastermind}</span>
                <span>${scores.mastermind}</span>
            `;
            
            const row2 = document.createElement('div');
            row2.className = 'score-row';
            row2.innerHTML = `
                <span>${state.player_names.guesser}</span>
                <span>${scores.guesser}</span>
            `;
            
            scoresTable.appendChild(row1);
            scoresTable.appendChild(row2);
        }
    }
}
