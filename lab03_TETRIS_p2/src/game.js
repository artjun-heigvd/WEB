import { gameRows, gameCols, shapeTypes } from './constants.js';
import { Shape } from './shape.js';
import { GameMap } from './gameMap.js';
import { DropMessage, MoveMessage, RotateMessage } from './messages.js';

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
    return this.get(id)?.shape;
  }

  /**
   * Executes the provided function on each shape in the game.
   * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
   */
  forEachShape(f) {
    this.forEach((p) => f(p.shape));
  }

  /**
   * Moves the given shape to the given column, if possible.
   * @param {Number} id The id of the player whose shape should be moved.
   * @param {Number} col The column to which the shape should be moved.
   */
  moveShape(id, col) {
    if (this.isGameOver) {
      console.log('Game is over, not moving shape >:^(');
      return;
    } if (id === undefined) {
      console.log(`Given player id not defined : ${id}`);
      return;
    }
    // TODO
    if (this.map.testShape(this.get(id).shape, this.get(id).shape.row, col)) {
      this.get(id).shape.col = col;
    }
  }

  /**
   * Rotates the given shape in the given direction, if possible.
   * @param {Number} id The id of the player whose shape should be rotated.
   * @param {String} rotation The direction of the rotation, either "left" or "right"
   */
  rotateShape(id, rotation) {
    // TODO
    if (this.isGameOver) {
      console.log('Game is over, not rotating shape >:^(');
      return;
    } if (id === undefined) {
      console.log(`Given id player is not defined : ${id}`);
      return;
    }
    const shapeRot = this.get(id).shape;
    const newRotation = shapeRot.rotation + (rotation === 'left' ? (shapeTypes[shapeRot.shapeType].length - 1) : 1);
    if (this.map.testShape(shapeRot, shapeRot.row, shapeRot.col, newRotation)) {
      this.get(id).shape.rotation = newRotation;
    }
  }

  /**
   * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
   * @param {Number} playerId The id of the player whose shape should be dropped
   */
  dropShape(playerId) {
    const player = this.get(playerId);
    if (player === undefined) {
      console.log(`Cannot find player ${playerId}; ignoring`);
      return;
    }

    const { shape } = player;
    if (shape === undefined) {
      console.log(
        `Shape ${playerId} does not exist; cannot drop it; ignoring`,
      );
      return;
    }

    this.map.dropShape(shape);

    //Constant not used?? TODO: talk about it
    const count = this.map.clearFullRows();

    // Replace this shape and any overlapping falling
    this.addNewShape(player.id);

    this.forEach((p, id) => {
      const { shape } = p;
      if (shape !== undefined && id !== player.id) {
        if (!this.map.testShape(shape)) {
          this.addNewShape(id);
        }
      }
    });
  }

  /**
   * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
   */
  step() {
    if (this.isGameOver) {
      console.log('Game over, not stepping');
      return;
    }

    const toDrop = [];

    // Move all shapes
    for (const player of this.values()) {
      const { shape } = player;
      if (shape === undefined) {
        continue;
      }
      const { row } = shape;
      if (row === undefined) {
        console.log('Invalid coordinates for shape. Ignoring it.');
        return;
      }
      // If they can move down, move them down
      if (this.map.testShape(shape, row + 1)) {
        shape.row++;
      } else {
        // If they cannot move down, ground them
        toDrop.push(shape);
      }
    }

    toDrop.forEach((shape) => {
      const id = shape.playerId;
      if (this.map.testShape(shape)) {
        this.dropShape(id);
      } else {
        console.log(
          'Shape was not droppable, doing nothing because assuming that a previous `dropShape` has reset it.',
        );
      }
    });
  }

  /**
   * Replace current shape of given player id (if any) with a new random shape.
   * @param {Number} id Id of the player whose shape should be replaced.
   */
  addNewShape(id) {
    const col = parseInt(this.map.width / 2, 10);
    const shapeType = Shape.getRandomShapeType();
    const shape = new Shape(shapeType, id, col, 0, 0);
    const player = this.get(id);
    if (player !== undefined) {
      player.shape = shape;
    } else {
      throw `Cannot find player with id ${id}`;
    }

    if (!this.map.testShape(shape)) {
      this.gameOver();
    }
  }

  /**
   * Resets the game upon game over.
   */
  gameOver() {
    this.isGameOver = true;
    this.clear();
    this.map = new GameMap(gameCols, gameRows);
  }

  /**
   * Handles an incoming message.
   * @param {Number} playerId The id of the player that sent this message.
   * @param {Message} message The message to be handled.
   */
  onMessage(playerId, message) {
    // TODO
    if (message instanceof MoveMessage) {
      this.moveShape(playerId, message.getCol());
    } else if (message instanceof RotateMessage) {
      this.rotateShape(playerId, message.getDirection());
    } else if (message instanceof DropMessage) {
      this.dropShape(playerId);
    } else {
      console.log('Undefined message type; ignoring.');
    }
  }
}
