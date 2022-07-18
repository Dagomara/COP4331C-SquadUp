const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../db/UserSchema');
const cors = require('cors')
require('dotenv').config();

// const db = client.db("api-testing");

// CORS middlewares for /api
var allowlist = ['http://localhost:3000', 'http://localhost:3001']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
        origin: true, // reflect (enable) the requested origin in the CORS response
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        optionsSuccessStatus: 200,
        credentials: true
    } 
  } else {
    corsOptions = {
        origin: false // disable CORS for this request
    }
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


router.patch('/editProfile', cors(corsOptionsDelegate), async (req, res) => 
{
  // Will be used when the user first signs in OR wants to change profile
  // incoming: discordID, username, gender, school
  // outgoing: edited profile

  const discordID = req.body.discordID;

  await User.findOneAndUpdate({discordID:discordID},
    { $set:{
      username:req.body.username,
      gender:req.body.gender,
      school:req.body.school,}}
  );

  // Returning the edited profile
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0) {
        let ret = {discordID:users[0].discordID,username:users[0].username,gender:users[0].gender,school:users[0].school};
        res.status(200).json(ret);
      }
      else
        console.log("issue found", users);
    }
    else {
      throw err;
    }
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/viewProfile', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: discordID, games, gender, school, status

  const {discordID} = req.body;
  console.log(`Finding ${discordID}...`);

  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0) {
        console.log("Cool dude found:");
        console.log(users[0]);
        res.status(200).json(users[0]);  
      }
      else
        console.log("issue found", users);
    }
    else {
      throw err;
    }
  }).catch(function(err) {
    console.log("Error: ", err);
    res.status(400).json({"error": err});
  });
});

router.post('/addGame', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: updated games

  const {discordID, games} = req.body;

  // Push new game to the "games" array
  await User.findOneAndUpdate({discordID:discordID}, { $push:{games:games}});

  // Return updated games
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0) {
        res.status(200).json(users[0].games);  
      }
      else
        console.log("issue found", users);
    }
    else {
      throw err;
    }
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/deleteGame', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, gameID
  // outgoing: updated games

  const {discordID, gameID} = req.body;
  
  // Delete game by gameID
  await User.findOneAndUpdate({discordID:discordID}, { $pull: { 'games': {gameID:gameID} } });
  
  // Return updated games
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].games);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/editGame', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: updated games

  const {discordID, games} = req.body;
  const gameID = games.gameID;

  // Deleting old game filters
  await User.findOneAndUpdate({discordID:discordID}, { $pull: { 'games': {gameID:gameID} } });
  // Reinserting new game filters
  await User.findOneAndUpdate({discordID:discordID}, { $push:{games:games}});

  // Return updated games
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].games);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/viewGames', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: games
  
  const discordID = req.body;
  
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].games);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/goOnline', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: updated status

  let error = '';

  const {discordID} = req.body;
  const st = 'online';
  
  await User.findOneAndUpdate({discordID:discordID}, 
    { $set:{ status:st,}});

  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].status);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/goOffline', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: updated status

  const {discordID} = req.body;
  const st = 'offline';
  
  await User.findOneAndUpdate({discordID:discordID}, 
    { $set:{ status:st,}});

  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].status);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/addFriend', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, friendDiscordID
  // outgoing: updated friend list

  let error = '';

  const {discordID, friends} = req.body;

  const addition = await User.findOneAndUpdate({discordID:discordID}, { $push:{friends:friends}});

  // Return updated friends
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].friends);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/deleteFriend', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, friendDiscordID
  // outgoing: updated friend list

  let error = '';

  const {discordID, friends} = req.body;

  await User.findOneAndUpdate({discordID:discordID}, { $pull:{friends:friends}});

  // Return updated friends
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].friends);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/viewFriends', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: friends

  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].friends);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/addBlocked', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, blockedDiscordID
  // outgoing: updated blocked list

  const {discordID, blocked} = req.body;

  await User.findOneAndUpdate({discordID:discordID}, { $push:{blocked:blocked}});

  // Return updated blocked
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].blocked);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/deleteBlocked', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, blockedDiscordID
  // outgoing: updated blocked list

  const {discordID, blocked} = req.body;

  await User.findOneAndUpdate({discordID:discordID}, { $pull:{blocked:blocked}});

  // Return updated blocked
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].blocked);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/viewBlocked', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: blocked

  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].blocked);  
      else
        console.log("issue found", users);
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/test', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: game, error

  const {discordID, games} = req.body;

  const results = games.gameID;

  res.status(200).json(results);
});

// router.use((req, res, next) =>
// {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, DELETE, OPTIONS'
//   );
//   next();
// });

// client.connect();

module.exports = router;