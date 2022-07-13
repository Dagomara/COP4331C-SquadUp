const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/getFriends", (req, res) => {
    res.json({message : 'NO FRIENDS'});
});

app.post('/editProfile', async (req, res) => 
{
  // incoming: discordID, name, gender, school
  // outgoing: discordID, error

  let error = '';

  const { username } = req.body;

  let _search = search.trim();
  
  const db = client.db("<database-name>");
  const results = await db.collection('Users').find({"Users":{$regex:_search+'.*', $options:'r'}}).toArray();
  
  let usr = '';
  let tg = -1;
  let gm = [];
  let sch = -1;

  if( results.length > 0 )
  {
    usr = results[0].username;
    tg = results[0].tag;
    gm = results[0].games;
    sch = results[0].school;
  }

  let ret = { username:usr, tag:tg, games:gm, school:sch, error:''};
  res.status(200).json(ret);
});

app.get('/viewProfile', async (req, res) => 
{
  // incoming: username
  // outgoing: username, games, school, error

  let error = '';

  const { username } = req.body;

  let _search = search.trim();
  
  const db = client.db("<database-name>");
  const results = await db.collection('Users').find({"Users":{$regex:_search+'.*', $options:'r'}}).toArray();
  
  let usr = '';
  let tg = -1;
  let gm = [];
  let sch = -1;

  if( results.length > 0 )
  {
    usr = results[0].username;
    tg = results[0].tag;
    gm = results[0].games;
    sch = results[0].school;
  }

  let ret = { username:usr, tag:tg, games:gm, school:sch, error:''};
  res.status(200).json(ret);
});

app.listen(port, () =>
{
  console.log('Server listening on port ' + port);
});