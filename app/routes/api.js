const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../db/UserSchema');
require('dotenv').config();



// const db = client.db("api-testing");

router.patch('/editProfile', async (req, res) => 
{
  // Will be used when the user first signs in OR wants to change profile
  // incoming: discordID, username, gender, school
  // outgoing: edited profile

  let error = '';

  const discordID = req.body.discordID;

  const edit = await User.findOneAndUpdate({discordID:discordID}, 
    { $set:{
      username:req.body.username,
      gender:req.body.gender,
      school:req.body.school,}}
      );

  // Returning the edited profile
  const results = await User.find({discordID:discordID}).toArray();
  usr = results[0].username;
  gen = results[0].gender;
  sch = results[0].school;

  let ret = {discordID:discordID,username:usr,gender:gen,school:sch};
  res.status(200).json(ret);
});

router.post('/viewProfile', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: discordID, games, gender, school, status

  let error = '';

  const {discordID} = req.body;

  const results = await User.find({discordID:discordID})
  .then( (foundUser, err) => {
    if (!err) {
      console.log("Cool dude found:");
      console.log(foundUser);  
      res.status(200).json(foundUser);
    }
    else {
      throw err;
    }
  }).catch(function(err) { console.log("Error: ", err) });

  // let gm = [];
  // let gen = '';
  // let sch = '';
  // let st = '';

  // if( results.length > 0 )
  // {
  //   gm = results[0].games;
  //   gen = results[0].gender;
  //   sch = results[0].school;
  //   st = results[0].status;
  // }

  // let ret = {discordID:discordID,games:gm,gender:gen,school:sch,status:st};
  // res.status(200).json(ret);

});

router.post('/addGame', async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: game

  let error = '';

  const {discordID, games} = req.body;

  const addition = await User.findOneAndUpdate({discordID:discordID}, { $push:{games:games}});

  // Return updated games
  const results = await User.find({discordID:discordID}).toArray();
  let updatedGames = results[0].games;
  res.status(200).json(updatedGames);
});

router.post('/deleteGame', async (req, res, next) => 
{
  // incoming: discordID, gameID
  // outgoing: game

  let error = '';

  const {discordID, gameID} = req.body;
  
  const deletion = await User.findOneAndUpdate({discordID:discordID}, { $pull: { 'games': {gameID:gameID} } });
  
  // Return updated games
  const results = await User.find({discordID:discordID}).toArray();
  let updatedGames = results[0].games;
  res.status(200).json(updatedGames);
  res.status(200).json(results);
});

router.post('/editGame', async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: games

  let error = '';

  const {discordID, games} = req.body;
  const gameID = games.gameID;

  const deletion = await User.findOneAndUpdate({discordID:discordID}, { $pull: { 'games': {gameID:gameID} } });
  const reinsertion = await User.findOneAndUpdate({discordID:discordID}, { $push:{games:games}});

  // Return updated games
  const results = await User.find({discordID:discordID}).toArray();
  let updatedGames = results[0].games;
  res.status(200).json(updatedGames);
});

router.post('/viewGames', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: games

  let error = '';

  const {discordID} = req.body;
  
  const results = await User.find({discordID:discordID}).toArray();

  let games = results[0].games;

  res.status(200).json(games);
});

router.post('/goOnline', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: updated status

  let error = '';

  const {discordID} = req.body;
  const st = 'online';
  
  const goOnline = await User.findOneAndUpdate({discordID:discordID}, 
    { $set:{ status:st,}});

  const results = await User.find({discordID:discordID}).toArray();
  let status = results[0].status;

  res.status(200).json(status);
});

router.post('/goOffline', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: updated status

  let error = '';

  const {discordID} = req.body;
  const st = 'offline';
  
  const goOffline = await User.findOneAndUpdate({discordID:discordID}, 
    { $set:{ status:st,}});

  const results = await User.find({discordID:discordID}).toArray();
  let status = results[0].status;

  res.status(200).json(status);
});

router.post('/addFriend', async (req, res, next) => 
{
  // incoming: discordID, friendDiscordID
  // outgoing: updated friend list

  let error = '';

  const {discordID, friends} = req.body;

  const addition = await User.findOneAndUpdate({discordID:discordID}, { $push:{friends:friends}});

  // Return updated friends
  const results = await User.find({discordID:discordID}).toArray();
  let ret = {friends:results[0].friends};
  res.status(200).json(ret);
});

router.post('/deleteFriend', async (req, res, next) => 
{
  // incoming: discordID, friendDiscordID
  // outgoing: updated friend list

  let error = '';

  const {discordID, friends} = req.body;

  const deletion = await User.findOneAndUpdate({discordID:discordID}, { $pull:{friends:friends}});

  // Return updated friends
  const results = await User.find({discordID:discordID}).toArray();
  let ret = {friends:results[0].friends};
  res.status(200).json(ret);
});

router.post('/viewFriends', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: friends

  let error = '';

  const {discordID} = req.body;
  
  const results = await User.find({discordID:discordID}).toArray();

  let ret = {friends:results[0].friends};
  res.status(200).json(ret);
});

router.post('/test', async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: game, error

  const {discordID, games} = req.body;

  const results = games.gameID;

  res.status(200).json(results);
});

router.use((req, res, next) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// client.connect();

module.exports = router;