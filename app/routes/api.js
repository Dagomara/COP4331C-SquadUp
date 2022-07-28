const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../db/UserSchema');
const cors = require('cors')
require('dotenv').config();
const clientRoot = process.env.URL_ROOT_CLIENT;
const serverRoot = process.env.URL_ROOT_SERVER;

// CORS middlewares for /api
var allowlist = [clientRoot, serverRoot];
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

  let discordID = req.body.discordID;

  await User.findOneAndUpdate({discordID:discordID},
    { $set:{
      username:req.body.username,
      gender:req.body.gender,
      school:req.body.school,
      tag:req.body.tag
    }}
  );

  // Returning the edited profile
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0) {
        let ret = {discordID:users[0].discordID,username:users[0].username,gender:users[0].gender,school:users[0].school,tag:users[0].tag};
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
  // outgoing: discordID, games, gender, school, status, avatar

  let discordID = req.body.discordID;
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

  let {discordID, games} = req.body;

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

  let {discordID, gameID} = req.body;
  
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

  let {discordID, games} = req.body;
  let gameID = games.gameID;

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
  
  let {discordID} = req.body;
  
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

  let {discordID} = req.body;
  let st = 'online';
  
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

  let {discordID} = req.body;
  let st = 'offline';
  
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

  let {discordID, friends} = req.body;

  let addition = await User.findOneAndUpdate({discordID:discordID}, { $push:{friends:friends}});

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

  let {discordID, friends} = req.body;

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

  let {discordID} = req.body;
  console.log(discordID);
  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].friends);  
      else {
        console.log("Request issue. Telling user to retry...");
        throw "Try try reloading!";
      }
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/viewFriendsMobile', cors(corsOptionsDelegate), async (req, res) => 
{
  // incoming: discordID
  // outgoing: friends discordID, friends username, friends avatar

  const { discordID } = req.body;
  let friendsArray = [String];

  let user = await User.find({discordID:discordID});

  try{
    for (let i = 0; i < user[0].friends.length; i++){
    let friendId = user[0].friends[i];    // Get friend ID from user
    let friendSearch = await User.find({discordID:friendId});   // Search each specific friend
    let friendData = {DiscordID:friendSearch[0].discordID, username:friendSearch[0].username, avatar:friendSearch[0].avatar};  // Prepare the string to be inserted
    friendsArray.push(friendData);   // Insert string to be returned
  }
  friendsArray.shift();
  res.status(200).json(friendsArray);
  }catch(err) {
    res.status(400).json({"error": err})
  }

  // await User.find({discordID:discordID})
  // .then( (users, err) => {
  //   if (!err) {
  //     if (users.length > 0){
  //       for (let i = 0; i < users[0].friends.length; i++){
  //       let friendId = users[0].friends[i];    // Get friend ID from user
  //       let friendSearch = User.find({discordID:friendId});   // Search each specific friend
  //       let friendData = {DiscordID:friendSearch[0].discordID, username:friendSearch[0].username, avatar:friendSearch[0].avatar};  // Prepare the string to be inserted
  //       friendsArray.push(friendData);   // Insert string to be returned
  //       }
  //       friendsArray.shift();
  //       res.status(200).json(friendsArray);}
  //     else{
  //       console.log("Request issue. Telling user to retry...");
  //       throw "Try try reloading!";
  //     }
  //   }
  //   else
  //     throw err;
  // }).catch(function(err) {
  //   res.status(400).json({"error": err});
  // });
  
});

router.post('/addBlocked', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID, blockedDiscordID
  // outgoing: updated blocked list

  let {discordID, blocked} = req.body;

  try{
    await User.findOneAndUpdate({discordID:discordID}, { $push:{blocked:blocked}});
    let removeAsFriend = await User.find({discordID:discordID}, {friends:blocked});
    if (removeAsFriend[0].friends.length > 0){
      await User.findOneAndUpdate({discordID:discordID}, { $pull:{friends:blocked}});
    }
  }catch(err) {
    res.status(400).json({"error": err});
  };

  // Return updated blocked list
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

  let {discordID, blocked} = req.body;

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

  let {discordID} = req.body;

  await User.find({discordID:discordID})
  .then( (users, err) => {
    if (!err) {
      if (users.length > 0)
        res.status(200).json(users[0].blocked);  
      else {
        console.log("Request issue. Telling user to retry...");
        throw "Try try reloading!";
      }
    }
    else
      throw err;
  }).catch(function(err) {
    res.status(400).json({"error": err});
  });
});

router.post('/deleteAccount', cors(corsOptionsDelegate), async (req, res) => 
{
    // incoming: discordID
    // outgoing: deleted account
    
    const {discordID} = req.body;
    console.log(`Trying to delete ${discordID}...`)

    User.deleteOne({ discordID:discordID}).then(function(){
      console.log("User deleted"); // Success
      res.status(200).json({"user deleted": discordID});
  }).catch(function(error){
      console.log(error); // Failure
      res.status(400).json("error");
  });
});

router.post('/getSmallProfile', cors(corsOptionsDelegate), async (req, res) => 
{
  // incoming: discordID
  // outgoing: username, avatar

  const {discordID} = req.body;

  try{
    let search = await User.find({discordID:discordID }).select({ "username": 1, "avatar": 1, "_id": 0});
    res.status(200).json(search[0]);
  }
  catch(err){
    res.status(400).json("error");
  }

});

router.post('/test', cors(corsOptionsDelegate), async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: friends discordID, friends username, friends avatar

  // const {school, gender} = req.body;
  // let search = await User.find({school:school, gender:gender , }).select({ "username": 1, "_id": 0});

  // const {gameID, gender} = req.body;
  // let search = await User.find({'games.gameID':gameID, gender:gender }).select({ "username": 1, "_id": 0});

  let {discordID, blocked} = req.body;
  await User.findOneAndUpdate({discordID:discordID}, { $push:{blocked:blocked}});

  let removeAsFriend = await User.find({discordID:discordID}, {friends:blocked});
  if (removeAsFriend[0].length > 0){
    await User.findOneAndUpdate({discordID:discordID}, { $pull:{friends:blocked}});
  }
  
  res.status(200).json(removeAsFriend[0].friends);
});

module.exports = router;