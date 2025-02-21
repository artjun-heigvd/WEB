import express from 'express';
import cookieParser from 'cookie-parser';
import { EventEmitter } from 'events';
import { getUserByName, getConversationById, Message, Conversation, User } from './data.js';
import { conversationNotFoundError, emptyMessageError, userNotInConversationError } from './errors.js';
import session from "express-session";
import bcrypt from "bcrypt";
import {salt} from "./constants.js";
import xss from "xss";
import passport from "passport"
import LocalStrategy from "passport-local"
const app = express();

let emitter = new EventEmitter()

//Configure passport
app.use(session({
    secret: 'PRIX BETON 1981',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict', // protection from CSRF attack
    },
}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy((username, password, done) => {
    getUserByName(username).then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    console.log("Authentication succesful")
                    return done(null, user)
                }
                return done(null, false, {message: 'Invalid username or password'});
            } else {
                // Remédiation au flag 6
                bcrypt.compareSync('Un truc complètement FOU', bcrypt.genSaltSync(salt))
                return done(null, false, {message: 'Invalid username or password'});
            }
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    getUserByName(username)
        .then((user) => {
        done(null, user);})
        .catch((err) => {
        done(err, null);})
});

// Configure express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(express.static('public'));


// Log all requests to console
app.use('/', (req, res, next) => {
    console.log("Request for " + req.originalUrl);
    next()
})

// Handle browser trying to fetch favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Serve login page
app.get('/login', (req, res) => {
    let errorMessage = xss.filterXSS(req.query.error)
    res.render('login', { errorMessage });
})

// Extract username and password from login request
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=Invalid username or password',
    failureFlash: false
}))

// Check if we're logged in or not
function isLoggedIn(req, res, next) {
    console.log("Auth status : " + req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login?error=You must be logged in to view this content');
}




// Handle logout
app.all('/logout', isLoggedIn ,(req, res) => {
    req.logout(() => {
        res.redirect("/login");
    })
})

// SSE notifications of new messages
app.get("/notifications", isLoggedIn, (req, res) => {
    let user = req.user;
    console.log(`Received notifications request from ${user.username}`);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const onMessage = (message) => {
        console.log(`event emission received, sending notification to ${user.username}`);
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    };

    emitter.addListener("message::" + user.id, onMessage);

    console.log(`Listeners for ${user.username}: ${emitter.listenerCount("message::" + user.id)}`);

    req.on("close", () => {
        console.log(`Notification connection closed for ${user.username}`);
        emitter.removeListener("message::" + user.id, onMessage);
    });
});

function convertConvsForRender(user) {
    return user.getConversations()
        .then((conversations) => Promise.all(conversations.map(async (conversation) => {
            let other = await conversation.getOtherUser(user);
            let lastMessage = await conversation.getLastMessage();
            return {
                uid: conversation.id,
                otherUser: other,
                lastMessage: lastMessage,
            }
        })));
}

// Serve index page
app.get('/', isLoggedIn, async (req, res) => {
    let user = req.user;
    let conversations = await convertConvsForRender(user)

    res.render('index', { currentUser: user, conversations, mainConvUid: undefined, mainConvMessages: [] });
});

// Conversation authorization middleware
app.use('/conversation/:conversationId', isLoggedIn, async (req, res, next) => {
    let user = req.user;
    getConversationById(req.params.conversationId).then(
        (conversation) => {
            if(!conversation) {
                res.status(404).send(conversationNotFoundError());
                return
            }
            if (!conversation.hasUser(user)) {
                console.log(`Trying to get another user's conversation. Requester is ${user.username} (${user.id}))`)
                res.status(403).send(userNotInConversationError(user).reason)
                return
            }

            req.conversation = conversation;
            next();
        },
        () => {
            res.status(404).send(conversationNotFoundError());
        }
    )
});

// Getting a full conversation
app.get("/conversation/:conversationId", isLoggedIn, async (req, res) => {
    let user = req.user
    let mainConvMessages = await req.conversation.getMessages()
    let mainConvUid = req.conversation.id
    let conversations = await convertConvsForRender(user)

    res.render('index', { currentUser: user, conversations, mainConvUid, mainConvMessages })
})

// Posting a message
app.post("/conversation/:conversationId", isLoggedIn, async (req, res) => {
    let user = req.user
    let mainConversation = req.conversation
    let message = xss.filterXSS(req.body.message);

    const other = await mainConversation.getOtherUser(user)

    if (message.length === 0) {
        res.status(403).json(emptyMessageError(user, other))

        return
    }

    // Wait for a second, to avoid spamming if they manage to create a loop.
    await new Promise(resolve => setTimeout(resolve, 500));

    await mainConversation.addMessage(user.id, message);

    emitter.emit("message::" + user.id, [{ conversationId: mainConversation.id, fromMe: true, message }]);
    emitter.emit("message::" + other.id, [{ conversationId: mainConversation.id, fromMe: false, message }]);

    res.status(200).send("Message sent")
})

// Allow clearing all conversations
app.get("/clear", isLoggedIn, async (req, res) => {
    let user = req.user

    await user.clearAllConversations();

    for (let conv of await user.getConversations()) {
        let other = await conv.getOtherUser(user);
        emitter.emit("message::" + other.id, {});
    }

    res.redirect("/")
})

// Allow changing display name
app.post("/displayname", isLoggedIn, (req, res) => {
    let user = req.user
    let displayName = xss.filterXSS(req.body.displayName);
    console.log(`Asked to change display name to ${displayName}`)
    user.changeDisplayName(displayName);
    emitter.emit("message::" + user.id, {});

    res.redirect("/")
})

export default app;