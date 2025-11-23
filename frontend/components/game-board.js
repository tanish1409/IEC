export class GameBoardComponent {
    constructor(app) {
        this.app = app;
        this.currentGuess = [];
    }

    init() {
        document.getElementById('clear-guess-btn').addEventListener('click', () => {
            this.clearGuess();
        });

        document.getElementById('submit-guess-btn').addEventListener('click', () => {
            this.submitGuess();
        });
    }

    render() {
        const state = this.app.gameState;

        document.getElementById('round-number').textContent = state.round_number + 1;
        document.getElementById('attempts-display').textContent = 
            `${state.attempts_used} / ${state.max_attempts}`;
        document.getElementById('difficulty-display').textContent = 
            state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);

        this.renderPalette();
        this.renderBoard();
        this.renderCurrentGuess();
        this.currentGuess = [];
        this.updateGuessDisplay();
        this.updatePaletteState();
    }

    renderPalette() {
        const paletteContainer = document.getElementById('game-palette');
        paletteContainer.innerHTML = '';

        const state = this.app.gameState;
        state.round_palette.forEach(color => {
            const colorPeg = document.createElement('div');
            colorPeg.className = 'color-peg';
            colorPeg.style.backgroundColor = color;
            colorPeg.dataset.color = color;

            colorPeg.addEventListener('click', () => {
                this.selectColor(color);
            });

            paletteContainer.appendChild(colorPeg);
        });
    }

    renderBoard() {
        const boardContainer = document.getElementById('game-board');
        boardContainer.innerHTML = '';

        const state = this.app.gameState;

        state.history.forEach((entry, index) => {
            const rowDiv = this.createBoardRow(entry.guess, entry.score, index + 1);
            boardContainer.appendChild(rowDiv);
        });

        if (state.attempts_used < state.max_attempts) {
            const currentIndicator = this.createCurrentGuessIndicator(state.attempts_used + 1);
            boardContainer.appendChild(currentIndicator);
        }
    }

    createCurrentGuessIndicator(rowNumber) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'current-guess-indicator';

        const rowNumberSpan = document.createElement('div');
        rowNumberSpan.className = 'row-number';
        rowNumberSpan.textContent = `#${rowNumber}`;

        const guessPegsDiv = document.createElement('div');
        guessPegsDiv.className = 'guess-pegs';

        for (let i = 0; i < this.app.gameState.peg_count; i++) {
            const peg = document.createElement('div');
            peg.className = 'guess-peg';
            peg.style.border = '2px dashed rgba(255, 255, 255, 0.3)';
            guessPegsDiv.appendChild(peg);
        }

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback-pegs';
        feedbackDiv.style.opacity = '0.3';

        const maxFeedbackPegs = Math.ceil(this.app.gameState.peg_count / 2) * 2;
        for (let i = 0; i < maxFeedbackPegs; i++) {
            const feedbackPeg = document.createElement('div');
            feedbackPeg.className = 'feedback-peg';
            feedbackDiv.appendChild(feedbackPeg);
        }

        rowDiv.appendChild(rowNumberSpan);
        rowDiv.appendChild(guessPegsDiv);
        rowDiv.appendChild(feedbackDiv);

        return rowDiv;
    }

    createBoardRow(guess, score, rowNumber) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'board-row';

        const rowNumberSpan = document.createElement('div');
        rowNumberSpan.className = 'row-number';
        rowNumberSpan.textContent = `#${rowNumber}`;

        const guessPegsDiv = document.createElement('div');
        guessPegsDiv.className = 'guess-pegs';

        guess.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'guess-peg';
            peg.style.backgroundColor = color;
            guessPegsDiv.appendChild(peg);
        });

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback-pegs';

        const totalPegs = this.app.gameState.peg_count;
        const maxFeedbackPegs = Math.ceil(totalPegs / 2) * 2;

        for (let i = 0; i < score.black; i++) {
            const feedbackPeg = document.createElement('div');
            feedbackPeg.className = 'feedback-peg black';
            feedbackDiv.appendChild(feedbackPeg);
        }

        for (let i = 0; i < score.white; i++) {
            const feedbackPeg = document.createElement('div');
            feedbackPeg.className = 'feedback-peg white';
            feedbackDiv.appendChild(feedbackPeg);
        }

        const remainingPegs = maxFeedbackPegs - score.black - score.white;
        for (let i = 0; i < remainingPegs; i++) {
            const feedbackPeg = document.createElement('div');
            feedbackPeg.className = 'feedback-peg';
            feedbackDiv.appendChild(feedbackPeg);
        }

        rowDiv.appendChild(rowNumberSpan);
        rowDiv.appendChild(guessPegsDiv);
        rowDiv.appendChild(feedbackDiv);

        return rowDiv;
    }

    renderCurrentGuess() {
        const currentGuessPegs = document.getElementById('current-guess-pegs');
        currentGuessPegs.innerHTML = '';

        const state = this.app.gameState;
        for (let i = 0; i < state.peg_count; i++) {
            const pegSlot = document.createElement('div');
            pegSlot.className = 'peg-slot';
            pegSlot.dataset.index = i;

            pegSlot.addEventListener('click', () => {
                if (this.currentGuess[i]) {
                    this.removeColor(i);
                }
            });

            currentGuessPegs.appendChild(pegSlot);
        }
    }

    selectColor(color) {
        if (this.currentGuess.includes(color)) {
            return;
        }

        if (this.currentGuess.length >= this.app.gameState.peg_count) {
            return;
        }

        this.currentGuess.push(color);
        this.updateGuessDisplay();
        this.updatePaletteState();
    }

    removeColor(index) {
        const removedColor = this.currentGuess[index];
        if (removedColor) {
            this.currentGuess.splice(index, 1);
            this.updateGuessDisplay();
            this.updatePaletteState();
        }
    }

    updateGuessDisplay() {
        const currentGuessPegs = document.getElementById('current-guess-pegs');
        const pegSlots = currentGuessPegs.querySelectorAll('.peg-slot');

        pegSlots.forEach((slot, index) => {
            if (this.currentGuess[index]) {
                slot.style.backgroundColor = this.currentGuess[index];
                slot.classList.add('filled');
            } else {
                slot.style.backgroundColor = '';
                slot.classList.remove('filled');
            }
        });
    }

    updatePaletteState() {
        const colorPegs = document.querySelectorAll('#game-palette .color-peg');
        colorPegs.forEach(peg => {
            const color = peg.dataset.color;
            if (this.currentGuess.includes(color)) {
                peg.classList.add('disabled');
            } else {
                peg.classList.remove('disabled');
            }
        });
    }

    clearGuess() {
        this.currentGuess = [];
        this.updateGuessDisplay();
        this.updatePaletteState();
    }

    async submitGuess() {
        if (this.currentGuess.length !== this.app.gameState.peg_count) {
            alert(`Please select exactly ${this.app.gameState.peg_count} colors`);
            return;
        }

        await this.app.makeGuess(this.currentGuess);
        this.currentGuess = [];
        this.updateGuessDisplay();
        this.updatePaletteState();
    }

    updateBoard(result) {
        document.getElementById('attempts-display').textContent = 
            `${result.attempts_used} / ${this.app.gameState.max_attempts}`;

        this.renderBoard();
    }
}