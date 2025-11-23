import random
from typing import List, Dict, Tuple


GLOBAL_COLORS = [
    "#E74C3C", "#3498DB", "#2ECC71", "#F39C12",
    "#9B59B6", "#1ABC9C", "#E67E22", "#34495E",
    "#F1C40F", "#16A085", "#C0392B", "#8E44AD"
]

BLACK_PEG = "#000000"
WHITE_PEG = "#FFFFFF"


class MastermindGame:
    def __init__(self):
        self.mode = None
        self.difficulty = None
        self.peg_count = 4
        self.max_attempts = 10
        self.global_palette = GLOBAL_COLORS.copy()
        self.round_palette = []
        self.secret = []
        self.attempts_used = 0
        self.history = []
        self.round_number = 0
        self.status = "setup"
        self.scores = {
            "classic_player": 0,
            "mastermind": 0,
            "guesser": 0
        }
        self.player_names = {"mastermind": "", "guesser": ""}
        self.current_mastermind = "mastermind"
        self.used_secrets = set()

    def initialize_game(self, mode: str, difficulty: str, peg_count: int, player_names: Dict[str, str] = None):
        if peg_count < 4 or peg_count > 8:
            raise ValueError("Peg count must be between 4 and 8")
        
        self.mode = mode
        self.difficulty = difficulty
        self.peg_count = peg_count
        self.status = "setup"
        
        if player_names:
            self.player_names = player_names
        
        self.generate_round_palette()
        
        if mode == "classic":
            self.generate_secret()
            self.status = "guessing"
        else:
            self.status = "mastermind_set"

    def generate_round_palette(self):
        if self.difficulty == "normal":
            palette_size = self.peg_count + 2
        else:
            palette_size = self.peg_count + 4
        
        palette_size = min(palette_size, 12)
        self.round_palette = random.sample(self.global_palette, palette_size)

    def generate_secret(self):
        self.secret = random.sample(self.round_palette, self.peg_count)
        secret_tuple = tuple(self.secret)
        
        while secret_tuple in self.used_secrets:
            self.secret = random.sample(self.round_palette, self.peg_count)
            secret_tuple = tuple(self.secret)
        
        self.used_secrets.add(secret_tuple)

    def set_secret(self, secret: List[str]) -> Dict:
        if len(secret) != self.peg_count:
            return {"success": False, "error": "Invalid secret length"}
        
        if len(set(secret)) != len(secret):
            return {"success": False, "error": "Secret contains duplicates"}
        
        for color in secret:
            if color not in self.round_palette:
                return {"success": False, "error": "Color not in round palette"}
        
        self.secret = secret
        self.used_secrets.add(tuple(secret))
        self.status = "guessing"
        return {"success": True}

    def validate_guess(self, guess: List[str]) -> Dict:
        if len(guess) != self.peg_count:
            return {"valid": False, "error": "Invalid guess length"}
        
        if len(set(guess)) != len(guess):
            return {"valid": False, "error": "Guess contains duplicates"}
        
        for color in guess:
            if color not in self.round_palette:
                return {"valid": False, "error": "Color not in round palette"}
        
        return {"valid": True}

    def score_guess(self, guess: List[str]) -> Dict[str, int]:
        black_pegs = 0
        white_pegs = 0
        
        secret_copy = self.secret.copy()
        guess_copy = guess.copy()
        
        for i in range(len(guess)):
            if guess[i] == self.secret[i]:
                black_pegs += 1
                secret_copy[i] = None
                guess_copy[i] = None
        
        for i in range(len(guess_copy)):
            if guess_copy[i] is not None:
                if guess_copy[i] in secret_copy:
                    white_pegs += 1
                    secret_copy[secret_copy.index(guess_copy[i])] = None
        
        return {"black": black_pegs, "white": white_pegs}

    def make_guess(self, guess: List[str]) -> Dict:
        validation = self.validate_guess(guess)
        if not validation["valid"]:
            return {"success": False, "error": validation["error"]}
        
        score = self.score_guess(guess)
        self.attempts_used += 1
        self.history.append({"guess": guess, "score": score})
        
        is_solved = score["black"] == self.peg_count
        
        if is_solved or self.attempts_used >= self.max_attempts:
            self.status = "round_over"
            return {
                "success": True,
                "score": score,
                "round_over": True,
                "solved": is_solved,
                "attempts_used": self.attempts_used
            }
        
        return {
            "success": True,
            "score": score,
            "round_over": False,
            "solved": False,
            "attempts_used": self.attempts_used
        }

    def end_round(self) -> Dict:
        is_solved = self.history[-1]["score"]["black"] == self.peg_count if self.history else False
        attempts_used = self.attempts_used
        
        round_points = 0
        if is_solved:
            round_points = self.max_attempts - attempts_used + 1
        
        if self.mode == "classic":
            self.scores["classic_player"] += round_points
            winner = "player" if is_solved else "system"
        else:
            if is_solved:
                self.scores["guesser"] += round_points
                winner = self.player_names["guesser"] if self.current_mastermind == "mastermind" else self.player_names["mastermind"]
            else:
                self.scores["mastermind"] += self.max_attempts
                winner = self.player_names["mastermind"] if self.current_mastermind == "mastermind" else self.player_names["guesser"]
        
        result = {
            "secret": self.secret,
            "winner": winner,
            "points_awarded": round_points if is_solved else self.max_attempts,
            "solved": is_solved,
            "total_scores": self.scores.copy()
        }
        
        return result

    def start_new_round(self):
        self.round_number += 1
        self.attempts_used = 0
        self.history = []
        self.secret = []
        
        if self.mode == "two_player":
            if self.current_mastermind == "mastermind":
                self.current_mastermind = "guesser"
            else:
                self.current_mastermind = "mastermind"
        
        self.generate_round_palette()
        
        if self.mode == "classic":
            self.generate_secret()
            self.status = "guessing"
        else:
            self.status = "mastermind_set"

    def get_state(self) -> Dict:
        state = {
            "mode": self.mode,
            "difficulty": self.difficulty,
            "peg_count": self.peg_count,
            "max_attempts": self.max_attempts,
            "round_palette": self.round_palette,
            "attempts_used": self.attempts_used,
            "history": self.history,
            "round_number": self.round_number,
            "status": self.status,
            "scores": self.scores,
            "player_names": self.player_names,
            "current_mastermind": self.current_mastermind
        }
        
        if self.status == "round_over":
            state["secret"] = self.secret
        
        return state
