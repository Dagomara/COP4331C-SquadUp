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
  // incoming: discordID, username, gender, school
  // outgoing: discordID, error

  let error = '';

  const discordID = req.body.discordID;

  const db = client.db("api-testing");
  const results = await db.collection('Users').findOneAndUpdate({discordID:discordID}, 
    { $set:{
      username:req.body.username,
      gender:req.body.gender,
      school:req.body.school,}}
      );

  res.status(200).json(results);
});

app.post('/viewProfile', async (req, res) => 
{
  // incoming: tag, username
  // outgoing: games, gender, school, status

  let error = '';

  const { username, tag} = req.body;

  const db = client.db("api-testing");
  const results = await db.collection('Users').find({username:username, tag: tag}).toArray();

  let games = [];
  let gender = '';
  let school = '';
  let status = '';

  if( results.length > 0 )
  {
    games = results[0].games;
    gender = results[0].gender;
    school = results[0].school;
    status = results[0].status;

    let ret = {
      games:games, 
      gender:gender, 
      school:school, 
      status:status,
      error:''};
    res.status(200).json(ret);
  }
  else
  {
    error = 'User not found';
    res.status(200).json(error);
  }
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