import ws from 'ws';

/**
 * Class representing a user
 */
export class User {
    nbClicks: number = 0;
    ws: ws.WebSocket;

    /**
     * Constructor
     * @param socket the socket of the user
     */
    constructor(socket: ws.WebSocket) {
        this.ws = socket;
    }

    /**
     * Increment the number of clicks by one
     */
    incrementClicks() {
        this.nbClicks++;
    }
}

export default User;

