require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require('massive');  
const app = express();

// const PORT = 4000;

const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const {CONNECTION_STRING, SESSION_SECRET, SERVER_PORT} = process.env;

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected');
});
app.use(express.json());

app.use(session({
        resave: false,
        saveUninitialized: true,
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 * 7
        },
        secret: SESSION_SECRET
    })
);
 
//ENDPOINTS
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', treasureCtrl.getUserTreasure);
app.get('/api/treasure/user', auth.userOnly,treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.userOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
});
