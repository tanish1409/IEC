from flask import Flask, request, jsonify
from flask_cors import CORS
from game_logic import MastermindGame

app = Flask(__name__)
CORS(app)

game = MastermindGame()


@app.route('/api/initialize', methods=['POST'])
def initialize():
    try:
        data = request.json
        mode = data.get('mode')
        difficulty = data.get('difficulty')
        peg_count = data.get('peg_count', 4)
        player_names = data.get('player_names')
        
        global game
        game = MastermindGame()
        game.initialize_game(mode, difficulty, peg_count, player_names)
        
        return jsonify({
            "success": True,
            "state": game.get_state()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/set-secret', methods=['POST'])
def set_secret():
    try:
        data = request.json
        secret = data.get('secret')
        
        result = game.set_secret(secret)
        
        if result["success"]:
            return jsonify({
                "success": True,
                "state": game.get_state()
            })
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/guess', methods=['POST'])
def make_guess():
    try:
        data = request.json
        guess = data.get('guess')
        
        result = game.make_guess(guess)
        
        if result["success"]:
            response = {
                "success": True,
                "score": result["score"],
                "round_over": result["round_over"],
                "solved": result["solved"],
                "attempts_used": result["attempts_used"],
                "state": game.get_state()
            }
            return jsonify(response)
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/end-round', methods=['POST'])
def end_round():
    try:
        result = game.end_round()
        return jsonify({
            "success": True,
            "result": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/new-round', methods=['POST'])
def new_round():
    try:
        game.start_new_round()
        return jsonify({
            "success": True,
            "state": game.get_state()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/state', methods=['GET'])
def get_state():
    return jsonify(game.get_state())


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1000, debug=True)
