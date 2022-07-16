require('dotenv').config(); // get .env stuffs
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
// register express session with MongoStore
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
// const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/connect');

app.use(cors());
app.use(bodyParser.json());

db.then(() => console.log('Connected to MongoDB.')).catch(err => console.log(err));

app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false, // session management
    resave: false,
    name: 'discord.oauth2',
    // Session Store for users to stay logged in
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));





app.use(express.static(path.join(__dirname, 'public')));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use("/api", require("./routes/api"));
app.use("/auth", require("./routes/auth"));

//app.get('/', isAuthorized, (req, res) => {});

// All other GET requests not handled before will return our React app
//if (process.env.NODE_ENV === 'production') {
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
//}

app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
});
