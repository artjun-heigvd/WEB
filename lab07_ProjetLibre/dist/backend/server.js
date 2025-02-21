"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var user_1 = __importDefault(require("./src/user"));
var clicker_1 = require("./src/clicker");
var Click = clicker_1.Clicker.Click;
var wsServer = new ws_1.WebSocket.Server({ port: 8080 });
/**
 * Function used to broadcast a message to all connected clients
 * @param message the message to send
 */
var broadcast = function (message) {
    clients.forEach(function (user) {
        user.ws.send(message);
    });
};
var clicker = new Click(broadcast);
var clients = new Map();
var totId = 0;
/**
 * This function is an event handler for when a new WebSocket connection is established.
 */
wsServer.on('connection', function (ws) {
    console.log('WebSocket connection opened');
    var id = totId++;
    clients.set(id, new user_1.default(ws));
    ws.send(JSON.stringify({
        type: 'nbGlobalClicks',
        current: clicker.getCurrentNbClicks(),
        global: clicker.getGlobalClicks()
    }));
    ws.send(JSON.stringify({ type: 'changePet', value: clicker.getPet() }));
    clicker.getWord().then(function (word) {
        ws.send(JSON.stringify({ type: 'word', value: word }));
    }).catch(function (error) {
        console.error('Failed to fetch word:', error);
    });
    // Send the ID to the client
    console.log('Sent client ID:', id);
    ws.send(JSON.stringify({ type: 'clientId', id: id }));
    ws.on('message', function (event) {
        var _a;
        clicker.onMessage(JSON.parse(event.toString()));
        (_a = clients.get(id)) === null || _a === void 0 ? void 0 : _a.incrementClicks();
    });
    ws.on('close', function () {
        console.log('WebSocket connection closed');
        clients.delete(id);
    });
});
