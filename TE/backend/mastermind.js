const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

// TODO:
//  Trouvez un moyen élégant de cacher la solution du mastermind (game.code) à l'utilisateur.
//  Votre solution ne doit pas utiliser le mot-clé "delete".

// A game object holds the state of a Mastermind game.
// The code is a private list of four colors hidden from the player.
class Game {
	#code;

	// Constructs a new game with the given code and guesses.
	// If no code is given, a random code is generated.
	// If no guesses are given, an empty list of guesses is used.
	constructor(code, guesses) {
		this.#code = code || Game.generateCode();
		this.guesses = guesses || [];
		this.status = 'playing';
	}

	// Plays a guess and returns the feedback.
	play(guess) {
		// TODO: Créez un objet feedback.
		//  Pour l'entrée de l'utilisateur (guess), calculez:
		//  - le nombre de couleurs correctes et à la bonne place (black pins);
		//  - le nombre de couleurs correctes mais à la mauvaise place (white pins).
		let blackPins = 0;
		let whitePins = 0;

		let copyCode = [...this.#code];
		let copyGuess = [...guess];

		for (let i = 0; i < guess.length; i++) {
			if (copyGuess[i] === copyCode[i]) {
				blackPins++;
				copyCode[i] = copyGuess[i] = null;
			}
		}

		for (let i = 0; i < guess.length; i++) {
			let indexSearched = copyCode.indexOf(copyGuess[i])
			if (copyGuess[i] && indexSearched !== -1) {
				whitePins++;
				copyCode[indexSearched] = null;
			}
		}

		const feedback = new Feedback(guess, blackPins, whitePins);

		this.guesses.push(feedback);

		if (this.guesses[this.guesses.length - 1].blackPins === 4) {
			this.status = 'won';
		} else if (this.guesses.length >= 10) {
			this.status = 'lost';
		}

		return feedback;
	}

	// Returns a random code.
	static generateCode() {
		return Array.from(
			Array(4),
			() => colors[Math.floor(Math.random() * colors.length)],
		);
	}
}

// A feedback object contains the guess,
// the number of correct colors and correct positions,
// and the number of correct colors and wrong positions.
class Feedback {
	constructor(guess, blackPins, whitePins) {
		this.guess = guess;
		this.blackPins = blackPins;
		this.whitePins = whitePins;
	}
}

module.exports = { Game, Feedback };
