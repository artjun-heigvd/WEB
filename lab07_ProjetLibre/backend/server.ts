import {WebSocket, Data, Server} from "ws";
import User from "./src/user";
import {Clicker} from "./src/clicker";
import Click = Clicker.Click;

const wsServer: Server = new WebSocket.Server({port: 8080});

/**
 * Function used to broadcast a message to all connected clients
 * @param message the message to send
 */
const broadcast: Function = (message: string): void => {
    clients.forEach((user: User) => {
        user.ws.send(message);
    })
}

let clicker: Click = new Click(broadcast);
const clients: Map<number, User> = new Map<number, User>();
let totId: number = 0;

/**
 * This function is an event handler for when a new WebSocket connection is established.
 */
wsServer.on('connection', (ws: WebSocket): void => {
    console.log('WebSocket connection opened');
    let id: number = totId++;
    clients.set(id, new User(ws));
    ws.send(JSON.stringify({
        type: 'nbGlobalClicks',
        current: clicker.getCurrentNbClicks(),
        global: clicker.getGlobalClicks()
    }));
    ws.send(JSON.stringify({type: 'changePet', value: clicker.getPet()}));

    clicker.getWord().then(word => {
        ws.send(JSON.stringify({type: 'word', value: word}));
    }).catch(error => {
        console.error('Failed to fetch word:', error);
    });

    // Send the ID to the client
    console.log('Sent client ID:', id);
    ws.send(JSON.stringify({type: 'clientId', id}));

    ws.on('message', (event: Data): void => {
        clicker.onMessage(JSON.parse(event.toString()));
        clients.get(id)?.incrementClicks();
    });

    ws.on('close', (): void => {
        console.log('WebSocket connection closed');
        clients.delete(id);
    });
});
