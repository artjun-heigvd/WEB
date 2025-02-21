import { assert, expect } from "chai";
import { mouseMoveHandler } from "../src/inputListener.js";
import { cellPixelSize } from "../src/constants.js";

describe("Input listener", () => {
  it("Moving mouse to same position should not send message twice", () => {
    let testIncr = () => {assertIncrement += 1;};
    let assertIncrement = 0;
    for(let i = 0; i < cellPixelSize; i++){
      // Reste dans la fausse cellule 0 mais fait un mouvement de 1 cellule puis bouge de moins en moins.
      mouseMoveHandler({offsetX: 0, movementX : cellPixelSize - i}, testIncr);
    }
    // Fait un assez gros mouvement et déplacement pour appeler le callback
    mouseMoveHandler({offsetX: cellPixelSize, movementX : cellPixelSize}, testIncr);
    assert.equal(assertIncrement, 2);
  });
});
