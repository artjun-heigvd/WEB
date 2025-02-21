import express from 'express'
import expressWs from 'express-ws'
import {gameCols, gameRows, port,stepIntervalMs} from './src/constants.js'
import {JoinMessage, MessageCodec, SetPlayerMessage, UpdateMapMessage} from "./src/messages.js";
import {Game} from "./src/game.js";
import {GameMap} from "./src/gameMap.js";
import {PlayerInfo} from "./src/playerInfo.js";

const app = express()
expressWs(app)

var nextId = 0
var clients = new Map()

const gameMap = new GameMap(gameCols, gameRows)

const broadcastHandler = (message) => {
    const encodedMessage = MessageCodec.encode(message)
    clients.forEach((socket) => {
        socket.send(encodedMessage)
    })
}
const onGameOver = () => {
    // TODO
    clients.forEach((socket) => {
        socket.close()
    })
    clients.clear()
    nextId = 0
}

// TODO Create a new Game instance and start a game loop
const game = new Game(gameMap, broadcastHandler, onGameOver)

setInterval(()=> {
    game.step()
    clients.forEach((_, id) => {
        game.sendMessage(new SetPlayerMessage(game.get(id)))
    })
},stepIntervalMs)


// Serve the public directory
app.use(express.static('public'))

// Serve the src directory
app.use('/src', express.static('src'))

// Websocket game events
app.ws('/', (socket) => {

    const id = ++nextId

    console.log("New player connected with id: " + id)
    game.introduceNewPlayer(new PlayerInfo(id,null))
    clients.set(id, socket)
    socket.send(MessageCodec.encode(new JoinMessage(id)))
    clients.forEach((_, id) => {
        socket.send(MessageCodec.encode(new SetPlayerMessage(game.get(id))))
    })
    socket.send(MessageCodec.encode(new UpdateMapMessage(gameMap)))

    // TODO The first message the client receives should be a JoinMessage, containing its player id. The server then sends all current state to that client. Received messages from the client should be forwarded to the game instance.
    socket.addEventListener("message", (event) => {
        let message = MessageCodec.decode(event.data)
        game.onMessage(id, message)
    })
    // TODO Ensure the game is notified of a player quitting when the socket is closed.
    socket.addEventListener("close", () => {
        console.log("Player " + id + " disconnected.")
        game.quit(id)
        clients.delete(id)
    })
})

app.listen(port)

console.log("App started.")
