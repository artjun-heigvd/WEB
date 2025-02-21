import { cellPixelSize } from './constants.js';
import { DropMessage, MoveMessage, RotateMessage } from './messages.js';

/**
 * Handles the mousemove event on the canvas.
 * @param event The mousemove event
 * @param messageListener
 */
export function mouseMoveHandler(event, messageListener) {
  // offsetX est la position X de la souris dans l'objet qui contient l'event
  const currentMouseCol = Math.trunc(event.offsetX / cellPixelSize);
  // movementX est le déplacement de la souris depuis le dernier event
  const lastMouseCol = Math.trunc((event.offsetX - event.movementX) / cellPixelSize);
  if (currentMouseCol === lastMouseCol) { // vérifie que l'on bouge la souris

  } else {
    console.log(currentMouseCol);
    messageListener(new MoveMessage(currentMouseCol));
  }
}

/**
 * Sets up all event listeners for user interactions:
 * - A click on the canvas or a key press on the down arrow will send a `DropMessage`.
 * - A movement of the mouse on the canvas will send a `MoveMessage` with the corresponding column.
 * - A key press on the left or right arrow will send a left or right `RotateMessage`.
 * @param canvas The canvas on which the game is drawn
 * @param messageListener The callback function handling the messages to be sent. It expects a `Message` as unique argument.
 */
export function setListeners(canvas, messageListener) {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        console.log('down');
        messageListener(new DropMessage());
        break;
      case 'ArrowLeft':
        console.log('left');
        messageListener(new RotateMessage('left'));
        break;
      case 'ArrowRight':
        console.log('right');
        messageListener(new RotateMessage('right'));
        break;
      default:
        break;
    }
  });

  canvas.addEventListener('mousemove', (event) => {
    mouseMoveHandler(event, messageListener);
  });

  canvas.addEventListener('click', () => {
    console.log('click');
    messageListener(new DropMessage());
  });
}


