import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let db = new sqlite3.Database('./dictons.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the dictons.sqlite database.');
});

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Configure express
app.use(express.urlencoded({ extended: true })); // Add this line


// Configure express
// Configure the template engine
app.set('view engine', 'ejs');

// Connect to the database

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get('/', (req, res) => {
    getRandomDicton(dicton => {
        res.render('dicton',{dicton: dicton});
    });
});


function getRandomDicton(callback){
    db.get("SELECT dicton FROM dictons ORDER BY RANDOM() LIMIT 1", (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            callback(row.dicton);
        }
    });
}


// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul>
app.get('/list/', (req, res) => {
    getAllDictons(dictons => {
        res.render('list',{ dictons: dictons });
    });

});

function getAllDictons(callback){
    db.all("SELECT dicton FROM dictons ORDER BY id", (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            callback(row);
        }
    });
}

// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get('/create', (req, res) => {
   res.render('create');
});

// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post('/create', (req, res) => {
    postNewDicton(req.body, id => {
        res.redirect(`/${id}`);
    });
});



function postNewDicton(dicton, callback){
    let sql = 'INSERT INTO dictons(dicton) VALUES (?)';
    db.run(sql, dicton.dicton, function(err) {
        if (err) {
            return console.error(err.message);
        }
        callback(this.lastID);
    });
}

// GET /:id
// Returns a dicton by its id.
app.get('/:id', (req, res) => {
    getDictonById(req.params.id, dicton => {
        res.render('dicton',{dicton: dicton});
    })
});

function getDictonById(id, callback) {

    db.get(`SELECT dicton FROM dictons WHERE id = ${id}`, (err, row) => {
       if(err){
           console.error(err.message);
       } else{

           callback(row.dicton);
       }
    });
}

export default app;
