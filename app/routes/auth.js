const router = require("express").Router();
const axios = require("axios");
const url = require('url');

// Provide oAuth2 authentication, prepare new users into db 
router.get("/callback", async (req, res) => {
    const accessCode = req.query.code; 
    let username;
    console.log(`callback: code is ${accessCode}`);
    if(!accessCode){
        res.send("No access code returned from discord")
    }
    else {
        let redirectUri = "http://localhost:"+process.env.PORT+"/auth/callback";
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
            .then(userResponse =>{
              username = `${userResponse.username}#${userResponse.discriminator}`
              console.log(`username: ${username}`);
              req.session.userdata = userResponse;
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
            .then(gResponse => {
              console.log("got to gResponse section");
              req.session.guilds = gResponse;
              console.log(req.session.userdata);
              console.log(req.session.guilds);
              res.redirect("http://localhost:3000/queue");
              }).catch((error) => {
                console.log(error);
            });
          }).catch((error) => {
            console.log(error);
        });
    
    }
});

// GET userData router from **ComponentDidMount** 
router.get("/getUserData",(req, res)=>{
    console.log("tryna get userdata");
    if(!req.session.userdata){
        console.log("no data");
        res.json({
            login : false,
        })
    }
    else{
        res.set("Access-Control-Allow-Origin", "*"); 
        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
        res.set("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
        res.json({
            login : true,
            discordId: req.session.userdata.id,
            username : username,
            avatar: req.session.userdata.avatar
        })
    }
  })


module.exports = router;