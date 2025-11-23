export class MastermindComponent {
    constructor(app) {
        this.app = app;
        this.selectedSecret = [];
    }

    init() {
        document.getElementById('clear-secret-btn').addEventListener('click', () => {
            this.clearSecret();
        });

        document.getElementById('submit-secret-btn').addEventListener('click', () => {
            this.submitSecret();
        });
    }

    render() {
        const state = this.app.gameState;
        
        let currentMastermindName = state.player_names[state.current_mastermind];
        document.getElementById('mastermind-title').textContent = `${currentMastermindName}, Set Your Secret Code`;
        document.getElementById('mastermind-instruction').textContent = 
            `Select ${state.peg_count} different colors from the palette below`;

        this.renderPalette();
        this.renderSecretPegs();
        this.selectedSecret = [];
    }

    renderPalette() {
        const paletteContainer = document.getElementById('palette-display');
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

    renderSecretPegs() {
        const secretPegsContainer = document.getElementById('secret-pegs');
        secretPegsContainer.innerHTML = '';

        const state = this.app.gameState;
        for (let i = 0; i < state.peg_count; i++) {
            const pegSlot = document.createElement('div');
            pegSlot.className = 'peg-slot';
            pegSlot.dataset.index = i;

            pegSlot.addEventListener('click', () => {
                if (this.selectedSecret[i]) {
                    this.removeColor(i);
                }
            });

            secretPegsContainer.appendChild(pegSlot);
        }
    }

    selectColor(color) {
        if (this.selectedSecret.includes(color)) {
            return;
        }

        if (this.selectedSecret.length >= this.app.gameState.peg_count) {
            return;
        }

        this.selectedSecret.push(color);
        this.updateSecretDisplay();
        this.updatePaletteState();
    }

    removeColor(index) {
        const removedColor = this.selectedSecret[index];
        if (removedColor) {
            this.selectedSecret.splice(index, 1);
            this.updateSecretDisplay();
            this.updatePaletteState();
        }
    }

    updateSecretDisplay() {
        const secretPegsContainer = document.getElementById('secret-pegs');
        const pegSlots = secretPegsContainer.querySelectorAll('.peg-slot');

        pegSlots.forEach((slot, index) => {
            if (this.selectedSecret[index]) {
                slot.style.backgroundColor = this.selectedSecret[index];
                slot.classList.add('filled');
            } else {
                slot.style.backgroundColor = '';
                slot.classList.remove('filled');
            }
        });
    }

    updatePaletteState() {
        const colorPegs = document.querySelectorAll('#palette-display .color-peg');
        colorPegs.forEach(peg => {
            const color = peg.dataset.color;
            if (this.selectedSecret.includes(color)) {
                peg.classList.add('disabled');
            } else {
                peg.classList.remove('disabled');
            }
        });
    }

    clearSecret() {
        this.selectedSecret = [];
        this.updateSecretDisplay();
        this.updatePaletteState();
    }

    submitSecret() {
        if (this.selectedSecret.length !== this.app.gameState.peg_count) {
            alert(`Please select exactly ${this.app.gameState.peg_count} colors`);
            return;
        }

        this.app.setSecret(this.selectedSecret);
    }
}
