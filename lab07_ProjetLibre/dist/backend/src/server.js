import express from 'express';
import expressWs from 'express-ws';
import User from './user';
import MessageModule from './message.ts';
import { Clicker } from './clicker.ts';
var MessageCodec = MessageModule.MessageCodec;
// ... (Constants, cached assets - if any - port, etc.)
const animals = ["sheep", "cow", "pig", "goat", "cat", "chicken"];
const app = express();
const appWs = expressWs(app); // Enable WebSocket functionality
const users = new Map();
let nextUserId = 0;
// Helper function for broadcasting messages
function broadcastMessage(message) {
    for (const user of users.values()) {
        user.ws.send(MessageCodec.encode(message));
    }
}
const clicker = new Clicker.Click(animals, broadcastMessage); // Assuming 'animals' is defined elsewhere
// WebSocket Handling
appWs.app.ws('/', (ws, req) => {
    const userId = nextUserId++;
    const user = new User(0, ws);
    users.set(userId, user);
    ws.on('message', (message) => {
        const decodedMessage = MessageCodec.decode(message);
        //A changer, c'est nul pour l'instant
        switch (decodedMessage.constructor.name) {
            case 'ClickMessage':
                user.nbClicks += decodedMessage.data;
                // Envoyer un UpdateClickMessage à tous les clients connectés
                broadcastMessage(new MessageModule.UpdateClickMessage(user.nbClicks));
                break;
            // ... (autres cas pour les différents types de messages)
        }
        // ... (WebSocket message and close handling - as before)
    });
    // Express Routes
    // ... (add routes for handling clicks, other interactions)
    // Example:
    app.post('/click', (req, res) => {
        clicker.click(1); // Example: Clicking the pig
        res.sendStatus(200);
    });
    // Start the Server
    const port = 3000; // Or use process.env.PORT for flexibility
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
