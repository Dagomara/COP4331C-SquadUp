import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import GameRow from '../components/GameRow';
import { Form, Field } from "@progress/kendo-react-form";
import { Checkbox, DropDown, Input, SearchSelector } from "../components/formComponents";
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { games, schools } from "../components/templates";
import { gameTemplates } from "../assets/js/gameTemplates";



import io from 'socket.io-client';

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

class Queue extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined,
            games: undefined,
            loginRedirect: false,
            selectedGame: undefined,
            playersNeeded: 3
        };
        this.startQueue = async(data, event) => {
          console.log("queue requested: ", data);
        
          event.preventDefault();
        };
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
            games: undefined
          });
          await axios.post(`${serverRoot}/api/viewProfile`, {discordID: res.data.discordId})
          .then(res2 => {
              if (res2.data) {
                  console.log("res2.data: ", res2.data);
                  this.setState({
                      username: res2.data.username,
                      tag: res2.data.tag,
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

      //const socket = io(serverRoot);

    }

    doLogout = async (e) => {
      e.preventDefault();
      await axios.get(`${serverRoot}/auth/logout`, {withCredentials: true})
      .then(res => {
        if (!res.data.login) {
          console.log("logout success!");
          this.setState({loginRedirect: true});
        }
        else
          console.log("something unpoggers happened!");
      })
      .catch((err)=>{
        console.log(err);
      });
    };

    updatePlayersNeeded = value => {
      this.setState({
        playersNeeded: value
      })
    };

    render() {
      if (this.state.loginRedirect) return (
        <div className='redirectNotice'>
          <button className='btn btn-primary'>
            <a href="/" className='text-white'>Not logged in. Please go to login page!</a>
          </button>
        </div>
      )

      return (
        <div className='Queue' id='page-top'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
          <div id="wrapper">
            <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="queue"/>
            <div class="d-flex flex-column" id="content-wrapper">
                <div id="content">
                    <div class="non-semantic-protector">
                        <div class="container mb-4 topbar static-top">
                            <h1 class="ribbon"><em><strong class="text-uppercase fw-bolder ribbon-content">The Main Attraction</strong></em></h1>
                        </div>
                        <div class="container-fluid">
                          {/* When a user clicks a game, they will go to the next screen. */}
                          {!this.state.selectedGame && (
                            <div class="row justify-content-center">
                                <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                    <div class="card shadow mb-4">
                                        <div class="card-header d-flex justify-content-between align-items-center">
                                            <h6 class="fs-4 fw-bold m-0">Select A Game</h6>
                                        </div>
                                        <div class="card-body">
                                            {(() => {
                                              // Display a GameRow for each loaded game.
                                                if (this.state.games != undefined && this.state.games.length > 0) {
                                                    return (
                                                    this.state.games.map((game, index) => {
                                                        // The GameRow will pluck some info including game name & icon.
                                                        let selectGame = (e, pluckedInfo)=>{
                                                          let biggerGame = JSON.parse(JSON.stringify(game));
                                                          biggerGame.icon = pluckedInfo.icon;
                                                          biggerGame.name = pluckedInfo.name;
                                                          this.setState({
                                                            selectedGame: biggerGame
                                                          });
                                                          console.log("User picked: ", this.state.selectedGame);
                                                          e.preventDefault();
                                                        };
                                                        return (
                                                            <GameRow
                                                              gameID={game.gameID}
                                                              onClick={selectGame} />
                                                        )
                                                    }));
                                                }
                                                else {
                                                    return (<p class="away">Loading games...</p>);
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>)
                          }
                          {this.state.selectedGame && (
                            <Form onSubmit={this.startQueue}
                            render={(formRenderProps) => (
                              <div class="row justify-content-center">
                                <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                    <div class="card shadow mb-4">
                                        <div class="card-header d-flex align-items-center">
                                            <img src={this.state.selectedGame.icon} 
                                              className="img-fluid rounded-circle gameIconHeader"/>
                                            <h6 class="fs-4 fw-bold m-0">{this.state.selectedGame.name}</h6>
                                        </div>
                                        <div class="card-body">
                                          <div class="row mb-3">
                                          <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                              <div className='row'>
                                                <div className='col-sm-12 col-md-6'>
                                                  <p className="text-white">How many players do you need?</p>
                                                </div>
                                                <div className='col-sm-12 col-md-5'>
                                                  <Slider
                                                    min={3}
                                                    max={10}
                                                    value={this.state.playersNeeded}
                                                    onChange={this.updatePlayersNeeded}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                              <p className="text-white">Any general settings?</p>
                                              <div className="row splash-option text-black" >
                                                <div className="col-sm-12 col-md-3 text-start align-self-center">
                                                  <p className="w-100 text-capitalize">School</p>
                                                </div>
                                                <div className="col align-self-center">
                                                  <Field 
                                                    name="schools"
                                                    options={schools}
                                                    component={SearchSelector}
                                                    classNames="form-control form-control-user w-100" />
                                                </div>
                                              </div>
                                              <div className="row splash-option text-black" >
                                                <div className="col-sm-12 col-md-3 text-start align-self-center">
                                                  <p className="w-100 text-capitalize">Voice Call?</p>
                                                </div>
                                                <div className="col align-self-center">
                                                  <Field 
                                                    name="voiceEnabled"
                                                    component={Checkbox}
                                                    classNames="form-control form-control-user w-100" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                              <p className="text-white">Any general settings?</p>
                                              <div className="row splash-option text-black" >
                                                <div className="col-sm-12 col-md-3 text-start align-self-center">
                                                  <p className="w-100 text-capitalize">School</p>
                                                </div>
                                                <div className="col align-self-center">
                                                  <Field 
                                                    name="schools"
                                                    options={schools}
                                                    component={SearchSelector}
                                                    classNames="form-control form-control-user w-100" />
                                                </div>
                                              </div>
                                              <div className="row splash-option text-black" >
                                                <div className="col-sm-12 col-md-3 text-start align-self-center">
                                                  <p className="w-100 text-capitalize">Voice Call?</p>
                                                </div>
                                                <div className="col align-self-center">
                                                  <Field 
                                                    name="voiceEnabled"
                                                    component={Checkbox}
                                                    classNames="form-control form-control-user w-100" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                              )} />
                          )}
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

export default Queue;