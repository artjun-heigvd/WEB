const express = require('express');

const routes = express();

// Enable JSON in request bodies
const bodyParser = require('body-parser');
routes.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing
const cors = require('cors');
routes.use(cors());

// Load the Mastermind Game class
const { Game, Feedback } = require('./mastermind.js');

// Create a map to store the ongoing games
const games = new Map();

// Add a game named "test" for testing purposes
games.set(
	'test',
	new Game(
		['red', 'green', 'blue', 'yellow'],
		[
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'blue', 'purple', 'purple'], 1, 1),
			new Feedback(['red', 'green', 'yellow', 'blue'], 2, 2),
			new Feedback(['red', 'green', 'blue', 'purple'], 3, 0),
		],
	),
);

// Define the API

// TODO:
//  Ajoutez une route pour lister les parties en cours.
// GET /api/games - list all the ongoing games
// STATUS: 200 OK
// JSON: ['partie1', 'partie2', 'partie3']
routes.get('/api/games', (req, res) => {
	res.status(200);
	res.json(Array.from(games.keys()));
})

// POST /api/games - create a new game
routes.post('/api/games', (req, res) => {
	const { id, code } = req.body;
	games.set(id, new Game(code));
	res.status(201);
	res.send();
});

// GET /api/games/:id - get the status of a game
routes.get('/api/games/:id', (req, res) => {
	const { id } = req.params;
	const game = games.get(id);
	res.status(200);
	res.json(game);
});

// POST /api/games/:id/guess - play a guess and get the updated status of a game
routes.post('/api/games/:id/guess', (req, res) => {
	const { id } = req.params;
	const { guess } = req.body;
	const game = games.get(id);
	game.play(guess);
	res.status(201);
	res.json(game);
});

// TODO:
//  Ajoutez une route pour supprimer une partie.
//  DELETE /api/games/:id - delete a game
//  STATUS: 204 No Content
routes.delete('/api/games/:id', (req, res) => {
	const { id } = req.params;
	games.delete(id);
	res.status(204);
	res.send();
})

module.exports = routes;
