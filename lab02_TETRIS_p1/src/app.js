import { Renderer } from './renderer.js';
import { Game } from './game.js';
import { PlayerInfo } from './playerInfo.js';
import { GameMap } from './gameMap.js';
import { gameCols, gameRows } from './constants.js';
import { Shape } from './shape.js';

/**
 * Initialisation of the tetris game
 * @type {HTMLElement}
 */

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const id = 0;
const id2 = 1;
const gameMap = new GameMap(gameCols, gameRows);
const game = new Game(gameMap);
const shape = new Shape(Shape.getRandomShapeType(), id, gameCols / 2, 0, 0);
const shape2 = new Shape(Shape.getRandomShapeType(), id2, gameCols / 5, 0, 0);
const player = new PlayerInfo(id, shape);
const player2 = new PlayerInfo(2, shape2);
const renderer = new Renderer(game, context);

// Initial game call§
game.set(id, player);
game.set(id2, player2);
renderer.render();
game.step();
