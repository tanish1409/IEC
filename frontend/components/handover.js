export class HandoverComponent {
    constructor(app) {
        this.app = app;
    }

    init() {
        document.getElementById('ready-btn').addEventListener('click', () => {
            this.proceedToGame();
        });
    }

    render() {
        const state = this.app.gameState;
        const handoverMessage = document.getElementById('handover-message');

        let guesserName;
        if (state.current_mastermind === 'mastermind') {
            guesserName = state.player_names.guesser;
        } else {
            guesserName = state.player_names.mastermind;
        }

        handoverMessage.textContent = `Pass device to ${guesserName}`;
    }

    proceedToGame() {
        this.app.proceedToGuessing();
    }
}
