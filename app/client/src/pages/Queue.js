import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import GameRow from '../components/GameRow';
import QueueHandler from '../components/QueueHandler';
import { Form, Field } from "@progress/kendo-react-form";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Checkbox, DropDown, Input, SearchSelector } from "../components/formComponents";
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { games, schools } from "../components/templates";
import { gameTemplates } from "../assets/js/gameTemplates";


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
            filters: {},
            playersNeeded: 3,
            queueStarted: false,
            qrrPayload: undefined
        };
        // begins queueing strategy. 
        this.startQueue = async(data, event) => {
          let payload = {
            discordId: this.state.discordId, gameId: this.state.selectedGame.gameID,
            avatar: this.state.avatar, username: this.state.username,
            players_needed: this.state.playersNeeded, filters: {...this.state.filters, ...data}
          };
          //{...data, ...{filters: this.state.filters, players_needed: this.state.playersNeeded}};
          console.log("queue requested: ", payload);

          // begin socket.io madness!
          this.setState({ queueStarted: true, qrrPayload: payload });
        
          event.preventDefault();
        };
        // Properly manages this.state.filters for matchmaking!
        this.updateFilter = (filt, val) => {
          console.log("updating ", filt, ": ", val);
          // seen on https://davidwalsh.name/merge-objects
          let f = {...this.state.filters};
          f[filt] = val; 
          this.setState({ filters: f });
          console.log("updated filters object: ", f);
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
            games: undefined,
            school: res.data.school
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
                                                          console.log("User picked: ", biggerGame);
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
                          {(this.state.selectedGame && !this.state.queueStarted) && (
                            <Form onSubmit={this.startQueue}
                            initialValues={{
                              voiceEnabled: false
                            }}
                            render={(formRenderProps) => (
                              <div class="row justify-content-center">
                                {formRenderProps.allowSubmit = true}
                                <div class="col-lg-8 col-xl-8 align-self-center align-items-center">
                                    <div class="card shadow mb-4">
                                        <div class="card-header d-flex align-items-center">
                                            <img src={this.state.selectedGame.icon} 
                                              className="img-fluid gameIconHeader"/>
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
                                                    min={1}
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
                                                <div className="col-sm-5 col-md-3 text-start align-self-center">
                                                  <p className="w-100 text-capitalize">Voice Call?</p>
                                                </div>
                                                <div className="col">
                                                  <Field 
                                                    name="voiceEnabled"
                                                    component={Checkbox}
                                                    classNames="form-control form-control-user w-100" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                                              <p className="text-white">Player Filters:</p>
                                              {(() => {
                                                // Grab the selected game's gameTemplate
                                                let filters = gameTemplates[this.state.selectedGame.name].filters;
                                                console.log(filters);
                                                // Run through each filter
                                                return Object.keys(filters).map((field, i) => {
                                                  return (
                                                  <div className="row splash-option" >
                                                    <div className="col-sm-12 col-md-3 text-start align-self-center">
                                                      <p className="w-100 text-capitalize">{field}</p>
                                                    </div>
                                                    <div className="col align-self-center">
                                                      {/* `field` -- the current filter being rendered -- is passed as `name` when updating text in onChange*/}
                                                      {(()=>{
                                                        let changeFunct = ((e) => {
                                                          console.log(`Setting ${e.target.name}: ${e.target.value}...`);
                                                          this.updateFilter(field, e.target.value);
                                                        });
                                                        // see if filters field is an iRange :) (ex: level: "i1-250")
                                                        if (typeof filters[field] === 'string' || filters[field] instanceof String) {
                                                          // ["i1", "250"]
                                                          let splits = filters[field].split("-");
                                                          if (splits[0].charAt(0) == 'i') {
                                                            let lower = parseInt(splits[0].substr(1)); // 1
                                                            let upper = parseInt(splits[1]); // 250
                                                            if (!isNaN(lower) && !isNaN(upper)) {
                                                              return (
                                                                <div>
                                                                  <input className='placeholder-small w-100'
                                                                    placeholder={`Matched ${field}s will be >= this value.`}
                                                                    type="number"
                                                                    name={field}
                                                                    min={lower} max={upper}
                                                                    onChange={changeFunct}
                                                                    step="1"/>
                                                                </div>
                                                              );
                                                            }
                                                          }
                                                          // should never happen, but just in case!
                                                          return (
                                                            <input
                                                              className="form-control"
                                                              onChange={changeFunct}
                                                              name={field}
                                                              type="text" />
                                                          );
                                                        }
                                                        else
                                                          return (
                                                            <MultiSelect
                                                              name={field}
                                                              className="form-control form-control-user w-100"
                                                              data={filters[field]}
                                                              onChange={changeFunct}/>
                                                          );
                                                      })()}
                                                    </div>
                                                  </div>)
                                                })
                                              })()}
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col">
                                              <button class="btn btn-primary fw-bold bg-gradient-danger" onClick={() => {this.setState({selectedGame: undefined})}} type="button">&lt;&nbsp;Back</button>
                                            </div>
                                            <div class="col text-end">
                                              <button class="btn btn-primary bg-gradient-primary" type="submit" onClick={formRenderProps.onSubmit}>Review &gt;<span className='d-none'>Submit</span></button>
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                              )} />
                          )}
                          {this.state.queueStarted && (
                            <QueueHandler 
                              discordId={this.state.discordId}
                              avatar={this.state.avatar}
                              username={this.state.username}
                              qrrPayload={this.state.qrrPayload}
                              goBack={()=>{this.setState({queueStarted: false});}}
                              gameIcon={this.state.selectedGame.icon}
                              gameName={this.state.selectedGame.name}
                            />
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