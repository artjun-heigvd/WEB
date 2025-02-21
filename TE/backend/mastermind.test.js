const { describe, it, expect } = require('@jest/globals');
const { Game } = require('./mastermind.js');

const bbbb = ['blue', 'blue', 'blue', 'blue'];
const gggg = ['green', 'green', 'green', 'green'];
const obgr = ['orange', 'blue', 'green', 'red'];
const oogr = ['orange', 'orange', 'green', 'red'];
const oooo = ['orange', 'orange', 'orange', 'orange'];
const ooor = ['orange', 'orange', 'orange', 'red'];
const pppp = ['purple', 'purple', 'purple', 'purple'];
const rgbo = ['red', 'green', 'blue', 'orange'];
const rgbp = ['red', 'green', 'blue', 'purple'];
const rggg = ['red', 'green', 'green', 'green'];
const rgpp = ['red', 'green', 'purple', 'purple'];
const rppp = ['red', 'purple', 'purple', 'purple'];
const rrgg = ['red', 'red', 'green', 'green'];
const rrrg = ['red', 'red', 'red', 'green'];
const rrrr = ['red', 'red', 'red', 'red'];
const rggr = ['red', 'green', 'green', 'red'];
const rrgb = ['red', 'red', 'green', 'blue'];
const roor = ['red', 'orange', 'orange', 'red'];
const ybbp = ['yellow', 'blue', 'blue', 'purple'];
const rgby = ['red', 'green', 'blue', 'yellow'];
const gyyg = ['green', 'yellow', 'yellow', 'green'];

describe('The Mastermind', () => {
	it('should correctly count the number of correct color and correct position in a guess', () => {
		expect(new Game(rrrr).play(gggg).blackPins).toBe(0);
		expect(new Game(rrrr).play(rggg).blackPins).toBe(1);
		expect(new Game(rrgb).play(roor).blackPins).toBe(1);
		expect(new Game(rrrr).play(rrgg).blackPins).toBe(2);
		expect(new Game(rrgg).play(rggr).blackPins).toBe(2);
		expect(new Game(rrrr).play(rrrg).blackPins).toBe(3);
		expect(new Game(rrrr).play(rrrr).blackPins).toBe(4);
		expect(new Game(rgbo).play(rgbo).blackPins).toBe(4);
		expect(new Game(rggr).play(rggr).blackPins).toBe(4);
		expect(new Game(ybbp).play(rgby).blackPins).toBe(1);
		expect(new Game(gyyg).play(gggg).blackPins).toBe(2);
	});

	it('should correctly count the number of correct color and wrong position in a guess', () => {
		expect(new Game(rrrr).play(gggg).whitePins).toBe(0);
		expect(new Game(rrrr).play(rggg).whitePins).toBe(0);
		expect(new Game(rrrr).play(rrgg).whitePins).toBe(0);
		expect(new Game(rrrr).play(rrrg).whitePins).toBe(0);
		expect(new Game(rrrr).play(rrrr).whitePins).toBe(0);
		expect(new Game(pppp).play(oooo).whitePins).toBe(0);
		expect(new Game(rppp).play(ooor).whitePins).toBe(1);
		expect(new Game(rgpp).play(oogr).whitePins).toBe(2);
		expect(new Game(rrgb).play(roor).whitePins).toBe(1);
		expect(new Game(rrgg).play(rggr).whitePins).toBe(2);
		expect(new Game(rgbp).play(obgr).whitePins).toBe(3);
		expect(new Game(rgbo).play(obgr).whitePins).toBe(4);
		expect(new Game(ybbp).play(rgby).whitePins).toBe(1);
		expect(new Game(gyyg).play(gggg).whitePins).toBe(0);
	});

	it('should return the playing status until the game is lost', () => {
		const game = new Game(rrrr);
		for (let i = 0; i < 10; i++) {
			expect(game.status).toBe('playing');
			game.play(bbbb);
		}
		expect(game.status).toBe('lost');
	});

	it('should return the playing status until the game is won', () => {
		const game = new Game(rrrr);
		for (let i = 0; i < 5; i++) {
			expect(game.status).toBe('playing');
			game.play(bbbb);
		}
		expect(game.status).toBe('playing');
		game.play(rrrr);
		expect(game.status).toBe('won');
	});

	it('should generate reasonably random codes', () => {
		const set = new Set();
		for (let i = 0; i < 1000; i++) {
			set.add(Game.generateCode());
		}
		expect(set.size).toBeGreaterThan(990);
	});

	it('should hide the code of the game from the user', () => {
		const game = new Game();
		expect(game.code).toBe(undefined);
	});
});
