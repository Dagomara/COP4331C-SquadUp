const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();

module.exports = router;

app.patch('/editProfile', async (req, res) => 
{
  // Will be used when the user first signs in OR wants to change profile
  // incoming: discordID, username, gender, school
  // outgoing: edited profile

  let error = '';

  const discordID = req.body.discordID;
  const db = client.db("api-testing");

  const edit = await db.collection('Users').findOneAndUpdate({discordID:discordID}, 
    { $set:{
      username:req.body.username,
      gender:req.body.gender,
      school:req.body.school,}}
      );

  // Returning the edited profile
  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  usr = results[0].username;
  gen = results[0].gender;
  sch = results[0].school;

  let ret = {discordID:discordID,username:usr,gender:gen,school:sch};
  res.status(200).json(ret);
});

app.post('/viewProfile', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: discordID, games, gender, school, status

  let error = '';

  const {discordID} = req.body;

  const db = client.db("api-testing");
  const results = await db.collection('Users').find({discordID:discordID}).toArray();

  let gm = [];
  let gen = '';
  let sch = '';
  let st = '';

  if( results.length > 0 )
  {
    gm = results[0].games;
    gen = results[0].gender;
    sch = results[0].school;
    st = results[0].status;
  }

  let ret = {discordID:discordID,games:gm,gender:gen,school:sch,status:st};
  res.status(200).json(ret);

});

app.post('/addGame', async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: game

  let error = '';

  const {discordID, games} = req.body;

  const db = client.db("api-testing");
  const addition = await db.collection('Users').findOneAndUpdate({discordID:discordID}, { $push:{games:games}});

  // Return updated games
  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let updatedGames = results[0].games;
  res.status(200).json(updatedGames);
});

app.post('/deleteGame', async (req, res, next) => 
{
  // incoming: discordID, gameID
  // outgoing: game

  let error = '';

  const {discordID, gameID} = req.body;
  
  const db = client.db("api-testing");
  const deletion = await db.collection('Users').findOneAndUpdate({discordID:discordID}, { $pull: { 'games': {gameID:gameID} } });
  
  // Return updated games
  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let updatedGames = results[0].games;
  res.status(200).json(updatedGames);
  res.status(200).json(results);
});

app.post('/editGame', async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: games

  let error = '';

  const {discordID, games} = req.body;
  const gameID = games.gameID;

  const db = client.db("api-testing");
  const deletion = await db.collection('Users').findOneAndUpdate({discordID:discordID}, { $pull: { 'games': {gameID:gameID} } });
  const reinsertion = await db.collection('Users').findOneAndUpdate({discordID:discordID}, { $push:{games:games}});

  // Return updated games
  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let updatedGames = results[0].games;
  res.status(200).json(updatedGames);
});

app.post('/viewGames', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: games

  let error = '';

  const {discordID} = req.body;
  
  const db = client.db("api-testing");
  const results = await db.collection('Users').find({discordID:discordID}).toArray();

  let games = results[0].games;

  res.status(200).json(games);
});

app.post('/goOnline', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: updated status

  let error = '';

  const {discordID} = req.body;
  const st = 'online';
  
  const db = client.db("api-testing");
  const goOnline = await db.collection('Users').findOneAndUpdate({discordID:discordID}, 
    { $set:{ status:st,}});

  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let status = results[0].status;

  res.status(200).json(status);
});

app.post('/goOffline', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: updated status

  let error = '';

  const {discordID} = req.body;
  const st = 'offline';
  
  const db = client.db("api-testing");
  const goOffline = await db.collection('Users').findOneAndUpdate({discordID:discordID}, 
    { $set:{ status:st,}});

  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let status = results[0].status;

  res.status(200).json(status);
});

app.post('/addFriend', async (req, res, next) => 
{
  // incoming: discordID, friendDiscordID
  // outgoing: updated friend list

  let error = '';

  const {discordID, friends} = req.body;

  const db = client.db("api-testing");
  const addition = await db.collection('Users').findOneAndUpdate({discordID:discordID}, { $push:{friends:friends}});

  // Return updated friends
  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let ret = {friends:results[0].friends};
  res.status(200).json(ret);
});

app.post('/deleteFriend', async (req, res, next) => 
{
  // incoming: discordID, friendDiscordID
  // outgoing: updated friend list

  let error = '';

  const {discordID, friends} = req.body;

  const db = client.db("api-testing");
  const deletion = await db.collection('Users').findOneAndUpdate({discordID:discordID}, { $pull:{friends:friends}});

  // Return updated friends
  const results = await db.collection('Users').find({discordID:discordID}).toArray();
  let ret = {friends:results[0].friends};
  res.status(200).json(ret);
});

app.post('/viewFriends', async (req, res, next) => 
{
  // incoming: discordID
  // outgoing: friends

  let error = '';

  const {discordID} = req.body;
  
  const db = client.db("api-testing");
  const results = await db.collection('Users').find({discordID:discordID}).toArray();

  let ret = {friends:results[0].friends};
  res.status(200).json(ret);
});

app.post('/test', async (req, res, next) => 
{
  // incoming: discordID, game
  // outgoing: game, error

  const {discordID, games} = req.body;

  const db = client.db("api-testing");
  const results = games.gameID;

  res.status(200).json(results);
});

app.use((req, res, next) =>
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

// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) =>
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

//app.listen(5000); // start Node + Express server on port 5000
app.listen(PORT, () =>
{
  console.log('Server listening on port ' + PORT);
});