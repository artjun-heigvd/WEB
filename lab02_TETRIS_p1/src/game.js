import { gameRows, gameCols } from './constants.js';
import { Shape } from './shape.js';
import { GameMap } from './gameMap.js';

export class Game extends Map {
  constructor(gameMap) {
    super();
    this.map = gameMap;
    this.isGameOver = false;
  }

  /**
     * Returns shape of given player, or undefined if no such player or shape.
     * @param {Number} id Id of the player whose shape is to be returned.
     */
  getShape(id) {
    const player = this.get(id);
    if (player !== undefined) {
      return player.getShape();
    }
    console.error(`Player with id ${id} not found.`);
    return undefined;
  }

  /**
     * Executes the provided function on each shape in the game.
     * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
     */
  forEachShape(f) {
    for (const pi of this.values()) {
      f(pi.getShape());
    }
  }

  /**
     * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
     * @param {Number} playerId The id of the player whose shape should be dropped
     */
  dropShape(playerId) {
    if (this.map === undefined) {
      console.error('Map is not defined.');
      return;
    }

    const shape = this.getShape(playerId);
    if (shape === undefined) {
      console.error(`Shape for player ${playerId} not found.`);
      return;
    }
    // Game logic
    this.map.dropShape(shape);
    this.map.clearFullRows();
    this.addNewShape(playerId);
  }

  /**
     * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was
     * touching the ground, and replace it with a new one.
     */
  step() {
    if (this.isGameOver) {
      this.gameOver();
    }

    const shapesToVerify = [];

    // First, descending all the shapes by one, if we can't add it to the list of shapes to verify
    this.forEachShape((shape) => {
      if (this.map.testShape(shape, shape.row + 1)) {
        shape.row += 1;
      } else {
        shapesToVerify.push(shape);
      }
    });

    // Then iterate on all the shapes to verify if they are touching the ground or another shape
    shapesToVerify.forEach((shape) => {
      if (this.map.testShape(shape)) {
        this.dropShape(shape.playerId);
      } else {
        this.addNewShape(shape.playerId);
      }
    });
  }

  /**
     * Replace current shape of given player id (if any) with a new random shape.
     * @param {Number} id Id of the player whose shape should be replaced.
     */
  addNewShape(id) {
    const shapeCol = this.map.width / 2; // Put the shape in the middle of the game

    // Create a new shape for the player
    this.get(id).shape = new Shape(Shape.getRandomShapeType(), id, shapeCol, 0, 0);

    // If the shape overlaps another one, it's joever
    if (!this.map.testShape(this.get(id).getShape())) {
      this.isGameOver = true;
    }
  }

  /**
     * Resets the game upon game over.
     * We're not too sure about what this function should do, so we just reset
     * the gameMap and give the players new shapes.
     */
  gameOver() {
    this.isGameOver = false;
    this.map = new GameMap(gameCols, gameRows);
    // `this.clear()` or what is under
    for (const [id] of this) {
      this.addNewShape(id);
    }
  }
}
