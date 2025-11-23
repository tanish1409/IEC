export class SetupComponent {
    constructor(app) {
        this.app = app;
        this.mode = 'classic';
        this.difficulty = 'normal';
        this.pegCount = 4;
    }

    init() {
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.mode = btn.dataset.mode;
                this.togglePlayerNames();
            });
        });

        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        document.getElementById('peg-increase').addEventListener('click', () => {
            if (this.pegCount < 8) {
                this.pegCount++;
                this.updatePegCountDisplay();
            }
        });

        document.getElementById('peg-decrease').addEventListener('click', () => {
            if (this.pegCount > 4) {
                this.pegCount--;
                this.updatePegCountDisplay();
            }
        });

        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });
    }

    updatePegCountDisplay() {
        document.getElementById('peg-count-display').textContent = this.pegCount;
    }

    togglePlayerNames() {
        const playerNamesSection = document.getElementById('player-names-section');
        if (this.mode === 'two_player') {
            playerNamesSection.classList.remove('hidden');
        } else {
            playerNamesSection.classList.add('hidden');
        }
    }

    startGame() {
        const config = {
            mode: this.mode,
            difficulty: this.difficulty,
            peg_count: this.pegCount
        };

        if (this.mode === 'two_player') {
            const player1Name = document.getElementById('player1-name').value.trim();
            const player2Name = document.getElementById('player2-name').value.trim();

            if (!player1Name || !player2Name) {
                alert('Please enter names for both players');
                return;
            }

            if (player1Name === player2Name) {
                alert('Players must have different names');
                return;
            }

            config.player_names = {
                mastermind: player1Name,
                guesser: player2Name
            };
        }

        this.app.startGame(config);
    }
}
