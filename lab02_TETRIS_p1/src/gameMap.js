export class GameMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    /** 2D array storing for each position the id of the player whose
     * block is there, or -1 otherwise. */
    this.map = Array.from({ length: height }, () => Array(width).fill(-1));
  }

  /**
     * Drops the given shape, i.e. moves it down until it touches something, and then grounds it.
     * @param {Shape} shape The shape to be dropped.
     */
  dropShape(shape) {
    let i = 0;
    do {
      i += 1;
    } while (this.testShape(shape, shape.row + i));

    // Go to the previous valid state and grounds it
    shape.row += i - 1;
    this.groundShape(shape);
  }

  /**
     * Grounds the given shape, i.e. transfers it to the map table.
     * @param {Shape} shape The shape to be grounded.
     */
  groundShape(shape) {
    const shapeCoords = shape.getCoordinates();
    shapeCoords.forEach(([x, y]) => {
      if (y + shape.row < this.height) {
        this.map[y + shape.row][x + shape.col] = shape.playerId;
      }
    });
  }

  /**
     * Tests whether the given shape is overlapping a block or is out of bounds on the left, right, or bottom of the map.
     * This method allows the test to be done with row, col and/or rotation that are different from those of the shape itself.
     *
     * Note that we do not consider a shape to be out of bounds if it is (even partly) above the top of the map.
     *
     * @param {Shape} shape The shape to be tested
     * @param {Number} row Optional row at which the shape should be tested. If omitted, uses that of the shape.
     * @param {Number} col Optional col at which the shape should be tested. If omitted, uses that of the shape.
     * @param {Number} rotation Optional rotation with which the shape should be tested. If omitted, uses that of the shape.
     * @returns true if and only if the shape does not overlap anything and is not out of bounds.
     */
  testShape(shape, row = shape.row, col = shape.col, rotation = shape.rotation) {
    // Copies the coordinates, so we don't modify the base array
    const copiedShapeCoords = shape.getCoordinates(rotation).map((coord) => [...coord]);
    copiedShapeCoords.forEach((value) => {
      value[0] += col;
      value[1] += row;
    });

    //Will return true if one of the array passes the check, so we invert it
    return !copiedShapeCoords.some(([x, y]) => {
        return (
            x < 0 ||
            x >= this.width ||
            y < 0 ||
            y >= this.height ||
            this.map[y][x] !== -1
        );
    });
  }

  /**
     * Clears any row that is fully complete.
     */
  clearFullRows() {
    this.map.forEach((row, index) => {
      // If all cells are -1, mark the row as -1
      if (row.every((cell) => cell !== -1)) {
        this.clearRow(index);
      }
    });
  }

  /**
     * Clears the given row, and moves any row above it down by one.
     * @param {Number} row The row to be cleared.
     */
  clearRow(row) {
    this.map.splice(row, 1); // Delete the row
    this.map.unshift(Array(this.width).fill(-1)); // Add an empty array at the top
  }

  /**
     * Returns the id of the player whose block is grounded at the given position, or -1 otherwise.
     * @param {Number} row the requested row
     * @param {Number} col the requested column
     * @returns the id of the player whose block is grounded at the given position, or -1 otherwise
     */
  getPlayerAt(row, col) {
    return this.map[row][col];
  }
}
