const router = require("express").Router();
const axios = require("axios");
const url = require('url');
const guildID = process.env.GUILD_ID;
const User = require('../db/UserSchema');
const cors = require('cors');

if (process.env.NODE_ENV === "production")
  var allowlist = ['https://cop4331-squadup.herokuapp.com:3000', 'https://cop4331-squadup.herokuapp.com:3000'];
else
  var allowlist = ['http://localhost:3000', 'http://localhost:3001'];
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

// Provide oAuth2 authentication, prepare new users into db 
router.get("/callback", cors(corsOptionsDelegate), async (req, res) => {
    const accessCode = req.query.code; 
    let username;
    let isUserNew = false;
    console.log(`callback: code is ${accessCode}`);
    if(!accessCode){
        res.send("No access code returned from discord")
    }
    else {
        let redirectUri = process.env.URL_ROOT+process.env.PORT+"/auth/callback";
        // make form for our site
        const data = {
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": redirectUri,
            "scopes": "identify guilds guilds.join",
            "code": accessCode
        };
        // console.log(`data:`);
        // console.log(data);

        // Get the access token from disc
        await axios.post("https://discordapp.com/api/oauth2/token", new url.URLSearchParams(data).toString())
        .then((res) =>{
            //let resJson = JSON.stringify(res);
            console.log(`res used beyond:`);
            console.log(res.data);
            return res.data;
        })
        .then(async (response) => {
            console.log(`'authorization': ${response.token_type} ${response.access_token}`);
            // First, get the user. 
            await axios.get("https://discordapp.com/api/users/@me", {
              headers: {
                'Authorization': `${response.token_type} ${response.access_token}`
              }
            })
            .then((res2) => {
                // console.log("res2.data: ");
                // console.log(res2.data);
                return res2.data;
            })
            .then(async (userResponse) =>{
                username = `${userResponse.username}#${userResponse.discriminator}`
                console.log(`username: ${username}`);
                req.session.userdata = userResponse;

                // See if user exists already
                const user = await User.findOne({ discordID: userResponse.id });
                if (user) {
                    console.log("User exists.");
                    req.session.userdata.username = user.username;
                    req.session.userdata.discriminator = user.tag;
                    // make sure to update users's avatar information!
                    console.log(`userResponse.avatar: ${userResponse.avatar}`)
                    user.avatar = userResponse.avatar;
                    console.log(`user.avatar: ${user.avatar}`)
                    let updatedUser = await user.save();
                    console.log("user avatar updated");
                    console.log(updatedUser);
                }
                else {
                    console.log(`Adding new user ${userResponse.username}`);
                    isUserNew = true;
                    let newUser = await User.create({
                        discordID: userResponse.id,
                        username: userResponse.username,
                        tag: parseInt(userResponse.discriminator),
                        avatar: userResponse.avatar,
                        status: "online",
                        gender: "",
                        school: "",
                        games: [],
                        friends: [],
                        blocked: []
                    });
                    let savedUser = await newUser.save();
                    console.log(`savedUser: ${savedUser}`);
                    // session save this user
                }

            }).catch((error) => {
                console.log(error);
            });
            
            console.log("about to do ask for guilds")
            await axios.get('https://discordapp.com/api/users/@me/guilds', {
                headers: {
                  authorization: `${response.token_type} ${response.access_token}`
                }
            })
            .then((res2) => {
                // console.log("res2 #2: ");
                // console.log(res2.data);
                return res2.data;
            })
            .then(async (gResponse) => {
              console.log("got to gResponse section");
              //req.session.guilds = gResponse;
              console.log(req.session.userdata);
              //console.log(req.session.guilds);

              // add user to SquadUP server if they're not already there
              // this is turned off for now TODO: Fix server joining
              let svr = gResponse.find(obj => obj.id == guildID);
              if (!svr && false) {
                console.log(`PUTting ${req.session.userdata.username} into the SquadUP guild:`);
                console.log(`Access token: ${response.access_token}`);
                console.log(`discordID: ${req.session.userdata.id}`);
                let parms = { "access_token": response.access_token };

                let guildAddUrl = `https://discord.com/api/guilds/${guildID}/members/${req.session.userdata.id}`;
                console.log(`guildAddUrl: ${guildAddUrl}`);
                axios.put(guildAddUrl, { access_token: response.access_token })
                .then(gRes => {
                    console.log(`statusCode: ${gRes.status.response.request.data}`);
                    //console.log(res);
                })
                .catch(error => {
                    console.error(error);
                    console.log("damn");
                });
              }
              
              //req.session.cookie.discordID = req.session.userdata.id;
              console.log("redirect!");
              if (isUserNew)
                res.redirect(process.env.URL_ROOT+"3000/welcome");
              else 
                res.redirect(process.env.URL_ROOT+"3000/queue");
              }).catch((error) => {
                console.log(error);
            });
          }).catch((error) => {
            console.log(error);
        });
    
    }
});

// GET userData router from **ComponentDidMount** 
router.get("/getUserData", cors(corsOptionsDelegate), (req, res)=>{
    
    console.log("tryna get userdata");
    //console.log("req.session:", req.session);
    if(!req.session.userdata){
        console.log("no data");
        res.json({
            login : false,
        })
        res.redirect('/error');
    }
    else{
        //console.log(req);
        // res.set("Access-Control-Allow-Origin", process.env.URL_ROOT+"3000"); 
        // res.set("Access-Control-Allow-Credentials", "true");
        // res.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
        // res.set("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
        res.json({
            login : true,
            discordId: req.session.userdata.id,
            tag: req.session.userdata.discriminator,
            username : req.session.userdata.username,
            avatar: req.session.userdata.avatar
        })
    }
});

// TODO: fix logout 
// Log out
router.get('/logout', cors(corsOptionsDelegate), (req, res) => {
    if (req.session.userdata) {
        // res.set("Access-Control-Allow-Origin", process.env.URL_ROOT+"3001"); 
        console.log(`Logging out ${req.session.userdata.username}...`);
        delete req.session.userdata;
        //delete req.session.cookie;
        res.json({
            login : false
        });
        console.log("req.session: \n", req.session);
    }
});

module.exports = router;