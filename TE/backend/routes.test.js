const { describe, it, expect } = require('@jest/globals');
const request = require('supertest');
const routes = require('./routes.js');

describe('The API', () => {
	it('should allow to list games even if none has been created', async () => {
		const list = await request(routes).get('/api/games');
		expect(list.statusCode).toEqual(200);
		expect(list.body).toEqual(['test']);
	});

	it('should allow to create first game', async () => {
		const create = await request(routes)
			.post('/api/games')
			.send({ id: 'g1', code: ['red', 'green', 'blue', 'yellow'] });
		expect(create.statusCode).toEqual(201);
	});

	it('should list the first games', async () => {
		const list = await request(routes).get('/api/games');
		expect(list.statusCode).toEqual(200);
		expect(list.body).toEqual(['test', 'g1']);
	});

	it('should return the correct status after a first bad guess', async () => {
		const guess = await request(routes)
			.post('/api/games/g1/guess')
			.send({ guess: ['red', 'green', 'yellow', 'blue'] });
		const feedback = guess.body.guesses.pop();
		expect(guess.statusCode).toEqual(201);
		expect(guess.body.status).toEqual('playing');
		expect(feedback.blackPins).toEqual(2);
		expect(feedback.whitePins).toEqual(2);
	});

	it('should return the correct status after a second good guess', async () => {
		const gess = await request(routes)
			.post('/api/games/g1/guess')
			.send({ guess: ['red', 'green', 'blue', 'yellow'] });
		const feedback = gess.body.guesses.pop();
		expect(gess.statusCode).toEqual(201);
		expect(gess.body.status).toEqual('won');
		expect(feedback.blackPins).toEqual(4);
		expect(feedback.whitePins).toEqual(0);
	});

	it('should allow to create second game', async () => {
		const create = await request(routes)
			.post('/api/games')
			.send({ id: 'g2', code: ['red', 'green', 'blue', 'yellow'] });
		expect(create.statusCode).toEqual(201);
	});

	it('should list the first and the second games', async () => {
		const list3 = await request(routes).get('/api/games');
		expect(list3.statusCode).toEqual(200);
		expect(list3.body).toEqual(['test', 'g1', 'g2']);
	});

	it('should return the correct status after ten bad good guesses', async () => {
		for (let i = 0; i < 10; i++) {
			const guess = await request(routes)
				.post('/api/games/g2/guess')
				.send({ guess: ['red', 'green', 'yellow', 'blue'] });
			expect(guess.statusCode).toEqual(201);
		}
	});

	it('should allow the deletion of the second game', async () => {
		// Delete the second game
		const delete1 = await request(routes).delete('/api/games/g2');
		expect(delete1.statusCode).toEqual(204);
	});

	it('should not list the second games anymore', async () => {
		const list4 = await request(routes).get('/api/games');
		expect(list4.statusCode).toEqual(200);
		expect(list4.body).toEqual(['test', 'g1']);
	});
});
