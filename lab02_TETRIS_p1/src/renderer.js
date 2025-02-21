import { cellPixelSize, shapeColors, stepIntervalMs } from './constants.js';
import { Shape } from './shape.js';

function cellToPixel(x) {
  return x * cellPixelSize;
}

export class Renderer {
  constructor(game, context) {
    this.game = game;
    this.context = context;
  }

  /**
     * Clears the context and draws all falling and dropped shapes.
     */
  render() {
    if (!this.lastFrameTime) {
      this.lastFrameTime = performance.now();
    }

    // Request the next animation frame
    requestAnimationFrame(this.render.bind(this));

    // Calculate the elapsed time since the last frame
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.lastFrameTime;

    // Update the game state at a fixed interval (e.g., every second)
    if (elapsedTime > stepIntervalMs) { // 1000 milliseconds = 1 second
      this.game.step();
      this.lastFrameTime = currentTime;
    }

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.game.forEachShape(this.drawShape.bind(this));

    // Draw the shapes in the map
      this.game.map.map.forEach((row, rowIndex) => {
          row.forEach((cellValue, colIndex) => {
              if (cellValue !== -1) {
                  this.context.fillStyle = shapeColors[cellValue % shapeColors.length];
                  const x = cellToPixel(colIndex);
                  const y = cellToPixel(rowIndex);
                  this.context.fillRect(x, y, cellPixelSize, cellPixelSize);
              }
          });
      });
  }

  /**
     *
     * @param shape{Shape}
     */
  drawShape(shape) {
    this.context.fillStyle = shapeColors[shape.playerId % shapeColors.length];
    const shapeCoords = shape.getCoordinates();
    shapeCoords.forEach(([x, y]) => {
      const pixelX = cellToPixel(x + shape.col);
      const pixelY = cellToPixel(y + shape.row);

      this.context.fillRect(
        pixelX,
        pixelY,
        cellPixelSize,
        cellPixelSize,
      );
    });
  }
}
