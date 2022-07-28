import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import GameRow from '../components/GameRow';
import GameModal from '../components/GameModal';
import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
    LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
   serverRoot = HEROKU_ROOT_SERVER;
}
else {
   serverRoot = LOCALHOST_ROOT_SERVER;
}
const clientId = CLIENT_ID;


//axios.method('url', data(if needed), {withCredentials: true})

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined,
            tag: undefined,
            gender: undefined,
            school: undefined,
            status: "offline",
            games: undefined,
            loginRedirect: false,
            modalGame: false,
            selectedGame: undefined,
            selectedGameID: undefined
        };
        this.setGameM = (val) => {
          this.setState({
            modalGame: val
          }); 
        }
        this.selectGame = (id) => {
          this.state.selectedGameID = id;
          this.setState({
            selectedGameID: id
          });
        }
      }

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount = async () => {
      await axios.get(`${serverRoot}/auth/getUserData`, {withCredentials: true})
      .then(async res => {
        console.log("res.data.login: " + res.data.login);
        if(res.data.login) {
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`,
            tag: res.data.tag,
            status: "online",
            games: undefined
          });
          await axios.post(`${serverRoot}/api/viewProfile`, {discordID: res.data.discordId})
          .then(res2 => {
              if (res2.data) {
                  console.log("res2.data: ", res2.data);
                  this.setState({
                      username: res2.data.username,
                      tag: res2.data.tag,
                      gender: res2.data.gender,
                      school: res2.data.school,
                      games: res2.data.games
                  });
                  console.log("updated state w/ new games: ", this.state);
              }
          })
        }
        else {
          // Redirect to login page if user was not logged in!
          this.setState({loginRedirect: true});
        }
      }).catch((err)=>{
        console.log(err);
      });
    }

    render() {
      if (this.state.loginRedirect) return (
        <div className='redirectNotice'>
          <button className='btn btn-primary'>
            <a href="/" className='text-white'>Not logged in. Please go to login page!</a>
          </button>
        </div>
      )
  
      return (
        <div className='Profile' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
            <div id="wrapper">
            <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="profile"/>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <div class="non-semantic-protector">
                    <div class="container mb-4 topbar static-top">
                        <h1 class="ribbon"><em><strong class="text-uppercase fw-bolder ribbon-content">My Profile</strong></em></h1>
                    </div>
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <div class="col-lg-4">
                                <div class="card mb-3">
                                    <div class="card-body text-center shadow"><img class="rounded-circle mb-3 mt-4" src={this.state.avatarURL} 
                                    onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}} 
                                    width="160" height="160" />
                                        <div>
                                            <p class="profile-username"><span>@</span>{this.state.username}<span>#{this.state.tag}</span></p>
                                            <p class="profile-subheading">{this.state.school || "No School"}, {this.state.gender || "No Gender"}<br/></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <div class="row">
                                    <div class="col">
                                        <div class="card shadow mb-4">
                                            <div class="card-header d-flex justify-content-between align-items-center">
                                                <h6 class="fs-4 fw-bold m-0">Games</h6>
                                            </div>
                                            <div class="card-body">
                                                {(() => {
                                                    // Display a GameRow for each loaded game.
                                                    if (this.state.games != undefined && this.state.games.length > 0) {
                                                        return (
                                                        this.state.games.map((game, index) => {
                                                          console.log("Currently built game: ", game)
                                                            // The GameRow will pluck some info including game name & icon.
                                                            let selectGame = (e, pluckedInfo)=>{
                                                              let biggerGame = JSON.parse(JSON.stringify(game));
                                                              biggerGame.icon = pluckedInfo.icon;
                                                              biggerGame.name = pluckedInfo.name;
                                                              this.setState({
                                                                selectedGame: biggerGame
                                                              });
                                                              console.log("User picked: ", biggerGame);
                                                              e.preventDefault();
                                                            };
                                                            return (
                                                                <GameRow
                                                                    gameID={game.gameID}
                                                                    onClick={() => {
                                                                      this.setGameM(true);
                                                                      console.log("user clicked game with gameID ", game.gameID)
                                                                      this.selectGame(game.gameID);
                                                                      }}
                                                                />
                                                            )
                                                        }));
                                                    }
                                                    else {
                                                        return (<p class="away">No games? Lame.</p>);
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/theme.js"></script>
        </div>
      );
    }
}

export default Profile;